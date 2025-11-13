// src/models/Contrato.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Contrato = sequelize.define('Contrato', {
  id_contrato: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  proposta_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  empresa_id:  { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  valor_final: { type: DataTypes.DECIMAL(12,2), allowNull: false },
  data_assinatura: { type: DataTypes.DATE, allowNull: true },
  status: {
    type: DataTypes.ENUM('rascunho','ativo','suspenso','encerrado'),
    defaultValue: 'rascunho'
  },
  observacoes: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'contratos',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Contrato;
