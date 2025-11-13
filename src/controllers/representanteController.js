const Representante = require("../models/Representante");
const Empresa = require("../models/Empresa");
const isValidCPF = require("../utils/validateCPF");

// Criar representante
exports.createRepresentante = async (req, res) => {
  try {
    const { id_empresa, nome, cpf, contato } = req.body;

    if (!id_empresa || !nome || !cpf) {
      return res.status(400).json({ error: "id_empresa, nome e CPF são obrigatórios" });
    }

    if (!isValidCPF(cpf)) {
      return res.status(400).json({ error: "CPF inválido" });
    }

    const empresa = await Empresa.findByPk(id_empresa);
    if (!empresa) return res.status(400).json({ error: "Empresa não encontrada" });

    const exists = await Representante.findOne({ where: { cpf } });
    if (exists) return res.status(400).json({ error: "CPF já cadastrado" });

    const representante = await Representante.create({ id_empresa, nome, cpf, contato });
    res.status(201).json(representante);
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

      const exists = await Representante.findOne({ where: { cpf: req.body.cpf } });
      if (exists && exists.id_representante !== representante.id_representante) {
        return res.status(400).json({ error: "CPF já cadastrado" });
      }
    }

    await representante.update(req.body);
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
