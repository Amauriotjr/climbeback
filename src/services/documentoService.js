const Documento = require('../models/Documento');

class DocumentoService {
  
  async create(documentoData) {
    const novoDocumento = await Documento.create(documentoData);
    return novoDocumento;
  }

  
  async getAll() {
    const documentos = await Documento.findAll();
    return documentos;
  }

  
  async getById(id) {
    const documento = await Documento.findByPk(id);
    if (!documento) {
      throw new Error("Documento não encontrado");
    }
    return documento;
  }

  
  async update(id, updateData) {
    const documento = await this.getById(id);
    await documento.update(updateData);
    return documento;
  }

  
  async delete(id) {
    const documento = await this.getById(id);
    await documento.destroy();
    return { message: "Documento deletado com sucesso" };
  }
}

module.exports = DocumentoService;