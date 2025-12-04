const DocumentoService = require('../services/documentoService');
const documentoService = new DocumentoService();
const { clients } = require('../services/googleClient');
const fs = require('fs');
const path = require('path');

// --- AJUDANTES ---

// 1. Traduz MIME TYPE (do upload) para ENUM (do banco)
function mapMimeToEnum(mimeType) {
  if (!mimeType) return 'outro';
  const mime = mimeType.toLowerCase();
  if (mime === 'application/pdf') return 'pdf';
  if (mime.startsWith('image/')) return 'imagem';
  if (mime.includes('spreadsheet') || mime.includes('excel') || mime.includes('sheet')) return 'planilha';
  return 'outro';
}

// 2. Traduz ENUM (do banco) para MIME TYPE e EXTENSÃO (para o download)
function getDownloadInfo(tipoEnum) {
  switch (tipoEnum) {
    case 'pdf':      return { mime: 'application/pdf', ext: '.pdf' };
    case 'imagem':   return { mime: 'image/jpeg',      ext: '.jpg' }; // Assume jpg por padrão
    case 'planilha': return { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', ext: '.xlsx' };
    case 'relatorio':return { mime: 'application/pdf', ext: '.pdf' };
    default:         return { mime: 'application/octet-stream', ext: '' };
  }
}

const documentoController = {
  
  // --- UPLOAD ---
  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado." });
      }

      console.log('Arquivo recebido:', req.file);

      // Corrige o tipo para salvar no banco
      const tipoEnum = mapMimeToEnum(req.file.mimetype);

      const dadosDocumento = {
        nome: req.body.nome || req.file.originalname,
        tipo: tipoEnum,
        url: req.file.path, 
        
        contrato_id: req.body.contratoId ? Number(req.body.contratoId) : null,
        tarefa_id: req.body.tarefaId ? Number(req.body.tarefaId) : null,
        empresa_id: req.body.empresaId ? Number(req.body.empresaId) : null,
        
        google_file_id: null 
      };

      const novoDoc = await documentoService.create(dadosDocumento);
      return res.status(201).json(novoDoc);
    } catch (error) {
      console.error("Erro no upload:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // --- DOWNLOAD (CORRIGIDO PARA NÃO VIRAR TXT) ---
  async download(req, res) {
    try {
      const { id } = req.params;
      const doc = await documentoService.getById(id);

      if (!doc) {
        return res.status(404).json({ error: "Documento não encontrado." });
      }

      // Se for link externo (Google Drive)
      if (doc.url && (doc.url.startsWith('http') || doc.url.startsWith('www'))) {
        return res.redirect(doc.url);
      }

      const filePath = path.resolve(doc.url);
      
      if (fs.existsSync(filePath)) {
        // 1. Descobre o tipo correto
        const info = getDownloadInfo(doc.tipo);
        
        // 2. Força o cabeçalho para o navegador entender
        res.setHeader('Content-Type', info.mime);

        // 3. Garante que o nome tenha extensão (Ex: "teste" vira "teste.pdf")
        let fileName = doc.nome;
        if (!fileName.includes('.')) {
          fileName += info.ext;
        }

        // 4. Envia o arquivo
        return res.download(filePath, fileName);
      } else {
        return res.status(404).json({ error: "Arquivo físico não encontrado no servidor." });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // --- CRUD PADRÃO ---
  async create(req, res) {
    try {
      const novoDocumento = await documentoService.create(req.body);
      return res.status(201).json(novoDocumento);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const documentos = await documentoService.getAll();
      return res.status(200).json(documentos);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const documento = await documentoService.getById(id);
      return res.status(200).json(documento);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const documento = await documentoService.update(id, req.body);
      return res.status(200).json(documento);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

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