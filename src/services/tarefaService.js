const Tarefa = require('../models/Tarefa');
const { criarNotificacao } = require('./notificacaoService');

class TarefaService {
  async create(tarefaData) {
    const t = await Tarefa.create(tarefaData);
    if (t?.responsavel_id) {
      const titulo = t.titulo || 'Tarefa';
      const msg = `Nova tarefa atribuída: ${titulo}`;
      try { await criarNotificacao(t.responsavel_id, msg); } catch {}
    }
    return t;
  }
  async getAll() {
    return await Tarefa.findAll();
  }
  async getById(id) {
    const tarefa = await Tarefa.findByPk(id);
    if (!tarefa) {
      throw new Error("Tarefa não encontrada");
    }
    return tarefa;
  }
  async update(id, updateData) {
    const tarefa = await this.getById(id);
    const statusAntes = tarefa.status;
    const responsavelAntes = tarefa.responsavel_id;
    
    await tarefa.update(updateData);
    
    // Notifica se mudou status
    if (updateData.status && statusAntes !== updateData.status && tarefa.responsavel_id) {
      const msg = `Tarefa "${tarefa.titulo}" mudou para: ${updateData.status}`;
      try { await criarNotificacao(tarefa.responsavel_id, msg); } catch {}
    }
    
    // Notifica se mudou responsável
    if (updateData.responsavel_id && responsavelAntes !== updateData.responsavel_id) {
      const msg = `Nova tarefa atribuída: ${tarefa.titulo}`;
      try { await criarNotificacao(updateData.responsavel_id, msg); } catch {}
    }
    
    return tarefa;
  }
  async delete(id) {
    const tarefa = await this.getById(id);
    await tarefa.destroy();
    return { message: "Tarefa deletada com sucesso" };
  }
}

module.exports = TarefaService;