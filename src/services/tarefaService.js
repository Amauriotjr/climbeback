const Tarefa = require('../models/Tarefa');

class TarefaService {
  async create(tarefaData) {
    return await Tarefa.create(tarefaData);
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
    await tarefa.update(updateData);
    return tarefa;
  }
  async delete(id) {
    const tarefa = await this.getById(id);
    await tarefa.destroy();
    return { message: "Tarefa deletada com sucesso" };
  }
}

module.exports = TarefaService;