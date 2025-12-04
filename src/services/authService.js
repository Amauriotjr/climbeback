const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const { notifyAdmins } = require("./emailService");


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function login({ email, senha, googleToken }) {
  let user;

  if (googleToken) {
    // --- Login pelo Google
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const emailGoogle = payload.email;

    user = await User.findOne({ where: { email: emailGoogle } });

    if (!user) {
      // Novo usuário inativo
      user = await User.create({
        nome_completo: payload.name || "Usuário Google",
        cargo_id: 2,
        cpf: "00000000000",
        email: emailGoogle,
        contato: "N/A",
        senha_hash: "",
        situacao: "inativo"
      });

      await notifyAdmins(user);
      throw { status: 403, message: "Usuário criado. Aguardando aprovação de administrador." };
    }

    if (user.situacao !== "ativo") {
      throw { status: 403, message: "Usuário não aprovado." };
    }

    if (!user.senha_hash) {
      return { requirePassword: true, message: "Defina uma senha para seu login futuro." };
    }

  } else if (email && senha) {
    // --- Login tradicional
    user = await User.findOne({ where: { email } });
    if (!user) throw { status: 401, message: "Usuário não encontrado." };
    if (user.situacao !== "ativo") throw { status: 403, message: "Usuário não aprovado." };

    const valid = await bcrypt.compare(senha, user.senha_hash);
    if (!valid) throw { status: 401, message: "Senha incorreta." };
  } else {
    throw { status: 400, message: "Informe Google Token ou email/senha." };
  }

  // Gera JWT
  const token = jwt.sign(
    { id: user.id_usuario, email: user.email, cargo_id: user.cargo_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );

  return { token };
}

async function approveUser(id) {
  const user = await User.findByPk(id);
  if (!user) throw { status: 404, message: "Usuário não encontrado." };
  user.situacao = "ativo";
  await user.save();

  try {
    const { criarNotificacao } = require('./notificacaoService');
    const msg = "Seu cadastro foi aprovado! Agora você pode acessar o sistema.";
    await criarNotificacao(user.id_usuario, msg);
  } catch {}
  
  return { message: "Usuário aprovado com sucesso." };
}

async function rejectUser(id) {
  const user = await User.findByPk(id);
  if (!user) throw { status: 404, message: "Usuário não encontrado." };
  user.situacao = "negado";
  await user.save();

   try {
    const { criarNotificacao } = require('./notificacaoService');
    const msg = "Seu cadastro não foi aprovado. Entre em contato com o administrador para mais informações.";
    await criarNotificacao(user.id_usuario, msg);
  } catch {}
  
  return { message: "Usuário rejeitado." };
}

module.exports = { login, approveUser, rejectUser };