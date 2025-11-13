// src/services/contratoService.js
const Contrato = require('../models/Contrato');
const Proposta = require('../models/Proposta');
const Empresa  = require('../models/Empresa');

async function create(data) {
  return await Contrato.create(data);
}

async function findAll() {
  return await Contrato.findAll({
    include: [
      { model: Proposta, as: 'proposta' },
      { model: Empresa,  as: 'empresa'  }
    ],
    order: [['id_contrato','DESC']]
  });
}

async function findById(id) {
  const item = await Contrato.findByPk(id, {
    include: [
      { model: Proposta, as: 'proposta' },
      { model: Empresa,  as: 'empresa'  }
    ]
  });
  if (!item) throw new Error('Contrato não encontrado');
  return item;
}

async function update(id, data) {
  const item = await findById(id);
  await item.update(data);
  return item;
}

// regra: só gera contrato se a proposta estiver "aprovada"
async function generateFromProposta(propostaId) {
  const proposta = await Proposta.findByPk(propostaId);
  if (!proposta) throw new Error('Proposta não encontrada');

  const status = String(proposta.status || '').toLowerCase().trim();
  if (status !== 'aprovada') {
    throw new Error('Só é possível gerar contrato de proposta APROVADA');
  }

  const existente = await Contrato.findOne({ where: { proposta_id: propostaId } });
  if (existente) return existente;

  const empresaId = proposta.empresa_id;
  if (!empresaId) throw new Error('Proposta não vinculada a uma empresa');

  const valorFinal = proposta.valor_aprovado ?? proposta.valor_total ?? 0;

  const novo = await Contrato.create({
    proposta_id: propostaId,
    empresa_id: empresaId,
    valor_final: valorFinal,
    status: 'ativo',
    data_assinatura: new Date(),
    observacoes: `Gerado automaticamente a partir da proposta #${proposta.id}`
  });

  return novo;
}

async function findByEmpresa(empresaId) {
  return await Contrato.findAll({
    where: { empresa_id: empresaId },
    include: [
      { model: Proposta, as: 'proposta' },
      { model: Empresa,  as: 'empresa'  }
    ],
    order: [['id_contrato','DESC']]
  });
}

module.exports = {
  create, findAll, findById, update,
  generateFromProposta, findByEmpresa
};
