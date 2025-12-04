const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const { notifyAdmins } = require("../services/emailService");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ---------------------
// LOGIN (Google ou email/senha)
// ---------------------
exports.login = async (req, res) => {
  try {
    const { email, senha, googleToken } = req.body;
    let user;

    if (googleToken) {
      // --- Login com Google ---
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const emailGoogle = payload.email;

      user = await User.findOne({ where: { email: emailGoogle } });

      if (!user) {
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
        return res.status(403).json({ message: "Usuário criado. Aguardando aprovação de administrador." });
      }

      //if (user.situacao !== "ativo") {
       // return res.status(403).json({ message: "Usuário não aprovado." });
      //}

      if (!user.senha_hash || user.senha_hash.trim() === "") {
        return res.status(200).json({
          message: "Defina uma senha para seu login futuro sem Google.",
          requirePassword: true
        });
      }

    } else if (email && senha) {
      // --- Login tradicional ---
      user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ message: 'Usuário não encontrado.' });
      if (user.situacao !== 'ativo') return res.status(403).json({ message: 'Usuário não aprovado.' });

      const valid = await bcrypt.compare(senha, user.senha_hash);
      if (!valid) return res.status(401).json({ message: 'Senha incorreta.' });
    } else {
      return res.status(400).json({ message: "Envie googleToken OU email e senha." });
    }

    // Gera JWT
    const token = jwt.sign(
      { id: user.id_usuario, email: user.email, cargo_id: user.cargo_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------
// Aprovar usuário
// ---------------------
exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    user.situacao = "ativo";
    await user.save();

    res.json({ message: "Usuário aprovado com sucesso." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------
// Rejeitar usuário
// ---------------------
exports.rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    user.situacao = "negado";
    await user.save();

    res.json({ message: "Usuário rejeitado." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------
// Definir senha (usuário vindo do Google)
// ---------------------
exports.setPassword = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

    if (user.situacao !== "ativo") {
      return res.status(403).json({ message: "Usuário não aprovado." });
    }

    if (user.senha_hash && user.senha_hash.trim() !== "") {
      return res.status(400).json({ message: "Usuário já possui senha definida." });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    user.senha_hash = hashedPassword;
    await user.save();

    res.json({ message: "Senha definida com sucesso! Agora você pode fazer login sem Google." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.register = async (req, res) => {
  try {
    const { email, cpf, senha } = req.body;

   const exists = await User.findOne({ where: { cpf } }) || await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ error: "Usuário já cadastrado com esse CPF ou e-mail." });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const user = await User.create({
      ...req.body,
      situacao: "pendente",
      senha_hash: hashedPassword 
    });

    await notifyAdmins(user);

    const { senha_hash, ...userWithoutPassword } = user.toJSON();
    return res.status(201).json(userWithoutPassword);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};