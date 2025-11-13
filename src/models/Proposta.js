const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Proposta = sequelize.define('Proposta', {
  id_proposta: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('rascunho', 'enviada', 'aprovada', 'rejeitada'),
    defaultValue: 'rascunho'
  }
}, {
  tableName: 'propostas',
  timestamps: true
});

module.exports = Proposta;