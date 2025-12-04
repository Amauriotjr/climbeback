const Proposta = require('../models/Proposta'); 
const Empresa = require('../models/Empresa');
const Tarefa = require('../models/Tarefa');
const User = require('../models/User');

const { Op, fn, col, literal } = require('sequelize');

exports.getStats = async () => {
  const [totalClientes, propostasAtivas, valorEmNegociacao, tarefasPendentes] = await Promise.all([
    
    Empresa.count(),
    
    Proposta.count({ where: { status: 'enviada' } }),
    
    Proposta.sum('valor', { where: { status: 'enviada' } }),
    
    Tarefa.count({ 
      where: { 
        status: { 
          [Op.in]: ['a_fazer', 'em_andamento'] 
        } 
      } 
    })
  ]);

  return {
    totalClientes: totalClientes || 0,
    propostasAtivas: propostasAtivas || 0,
    valorEmNegociacao: parseFloat(valorEmNegociacao) || 0, 
    tarefasPendentes: tarefasPendentes || 0,
  };
};

exports.getPipeline = async () => {
  const pipeline = await Proposta.findAll({
    attributes: [
      'status',
      [fn('SUM', col('valor')), 'total']
    ],
    group: ['status'], 
    raw: true 
  });

  return pipeline.map(item => ({
    ...item,
    total: parseFloat(item.total) || 0
  }));
};

exports.getEquipePerformance = async () => {
  const performance = await Tarefa.findAll({
    attributes: [
      [col('User.nome_completo'), 'usuario'], 
      
      [fn('SUM', literal("CASE WHEN status IN ('concluida', 'realizada') THEN 1 ELSE 0 END")), 'concluidas'],
      
      [fn('SUM', literal("CASE WHEN status IN ('a_azer', 'em_andamento') THEN 1 ELSE 0 END")), 'pendentes']
    ],
    include: [{
      model: User,
      attributes: [] 
    }],
    group: [col('User.id_usuario'), col('User.nome_completo')], 
    raw: true
  });

  return performance.map(item => ({
    ...item,
    concluidas: parseInt(item.concluidas, 10) || 0,
    pendentes: parseInt(item.pendentes, 10) || 0
  }));
};
