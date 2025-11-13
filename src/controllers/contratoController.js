// src/controllers/contratoController.js
const contratoService = require('../services/contratoService');

exports.create = async (req, res) => {
  try {
    const out = await contratoService.create(req.body);
    res.status(201).json(out);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.findAll = async (_req, res) => {
  try {
    const out = await contratoService.findAll();
    res.json(out);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.findById = async (req, res) => {
  try {
    const out = await contratoService.findById(req.params.id);
    res.json(out);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const out = await contratoService.update(req.params.id, req.body);
    res.json(out);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.generateFromProposta = async (req, res) => {
  try {
    const out = await contratoService.generateFromProposta(req.params.id);
    res.status(201).json(out);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.findByEmpresa = async (req, res) => {
  try {
    const out = await contratoService.findByEmpresa(req.params.id);
    res.json(out);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await contratoService.remove(req.params.id);
    res.status(204).send();
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};
