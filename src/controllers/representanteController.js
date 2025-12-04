const Representante = require("../models/Representante");
const Empresa = require("../models/Empresa");
const isValidCPF = require("../utils/validateCPF");

// Small email validator (simple)
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

// Criar representante
exports.createRepresentante = async (req, res) => {
  try {
    const { id_empresa, nome, cpf, contato, email } = req.body;

    if (!id_empresa || !nome || !cpf || !email) {
      return res.status(400).json({ error: "id_empresa, nome, CPF e email são obrigatórios" });
    }

    if (!isValidCPF(cpf)) {
      return res.status(400).json({ error: "CPF inválido" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }

    const empresa = await Empresa.findByPk(id_empresa);
    if (!empresa) return res.status(400).json({ error: "Empresa não encontrada" });

    const existsCpf = await Representante.findOne({ where: { cpf } });
    if (existsCpf) return res.status(400).json({ error: "CPF já cadastrado" });

    const existsEmail = await Representante.findOne({ where: { email } });
    if (existsEmail) return res.status(400).json({ error: "Email já cadastrado" });

    const representante = await Representante.create({ id_empresa, nome, cpf, contato, email });
    res.status(201).json(representante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar representante
exports.updateRepresentante = async (req, res) => {
  try {
    const representante = await Representante.findByPk(req.params.id);
    if (!representante) return res.status(404).json({ error: "Representante não encontrado" });

    if (req.body.id_empresa) {
      const empresa = await Empresa.findByPk(req.body.id_empresa);
      if (!empresa) return res.status(400).json({ error: "Empresa não encontrada" });
    }

    if (req.body.cpf) {
      if (!isValidCPF(req.body.cpf)) {
        return res.status(400).json({ error: "CPF inválido" });
      }

      const existsCpf = await Representante.findOne({ where: { cpf: req.body.cpf } });
      if (existsCpf && existsCpf.id_representante !== representante.id_representante) {
        return res.status(400).json({ error: "CPF já cadastrado" });
      }
    }

    if (req.body.email) {
      if (!isValidEmail(req.body.email)) {
        return res.status(400).json({ error: "Email inválido" });
      }

      const existsEmail = await Representante.findOne({ where: { email: req.body.email } });
      if (existsEmail && existsEmail.id_representante !== representante.id_representante) {
        return res.status(400).json({ error: "Email já cadastrado" });
      }
    }

    await representante.update(req.body);
    res.json(representante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todos os representantes
exports.getRepresentantes = async (req, res) => {
  try {
    const representantes = await Representante.findAll();
    res.json(representantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar representante por ID
exports.getRepresentanteById = async (req, res) => {
  try {
    const representante = await Representante.findByPk(req.params.id);
    if (!representante) return res.status(404).json({ error: "Representante não encontrado" });
    res.json(representante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deletar representante
exports.deleteRepresentante = async (req, res) => {
  try {
    const representante = await Representante.findByPk(req.params.id);
    if (!representante) return res.status(404).json({ error: "Representante não encontrado" });

    await representante.destroy();
    res.json({ message: "Representante deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
