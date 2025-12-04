const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Notificacao = sequelize.define('Notificacao', {
  id_notificacao: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  mensagem: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  lida: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  usuario_id_destino: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    }
  }
}, {
  tableName: 'notificacoes',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em'
});

module.exports = Notificacao;
