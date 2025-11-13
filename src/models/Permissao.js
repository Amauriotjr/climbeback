const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Permissao = sequelize.define('Permissao', {
  id_permissao: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    comment: 'Ex: "criar_proposta", "editar_contrato", "ver_relatorios_financeiros"'
  }
}, {
  tableName: 'permissoes',
  timestamps: false
});

module.exports = Permissao;