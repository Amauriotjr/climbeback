const DocumentoService = require('../services/documentoService');
const documentoService = new DocumentoService();
const { clients } = require('../services/googleClient');

const documentoController = {
  // cria
  async create(req, res) {
    try {
      const novoDocumento = await documentoService.create(req.body);
      return res.status(201).json(novoDocumento);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // lista todos
  async getAll(req, res) {
    try {
      const documentos = await documentoService.getAll();
      return res.status(200).json(documentos);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // obtém por id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const documento = await documentoService.getById(id);
      return res.status(200).json(documento);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  },

  // atualiza
  async update(req, res) {
    try {
      const { id } = req.params;
      const documento = await documentoService.update(id, req.body);
      return res.status(200).json(documento);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // deleta
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await documentoService.delete(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  },

  // ---- SHEETS ----
  async copySheet(req, res) {
    try {
      const { copyTemplateToContrato } = require('../services/sheetsService');
      const created = await copyTemplateToContrato({
        templateFileId: req.body.templateFileId,
        nome: req.body.nome,
        contratoId: req.body.contratoId,
        userId: req.body.userId,
        empresaId: req.body.empresaId
      });
      return res.status(201).json(created);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async setSheetPermissions(req, res) {
    try {
      const { setPermissions } = require('../services/sheetsService');
      const result = await setPermissions({ ...req.body, userId: req.userId });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async debugFile(req, res) {
    try {
      const { id } = req.query;
      const { drive } = clients();
      const meta = await drive.files.get({
        fileId: id,
        supportsAllDrives: true,
        fields: 'id,name,owners(emailAddress,displayName),permissions(emailAddress,role),mimeType,parents'
      });
      return res.json(meta.data);
    } catch (e) {
      return res.status(400).json({ error: e.message, code: e.code, errors: e.errors });
    }
  }
};

module.exports = documentoController;