const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Comentario = sequelize.define('Comentario', {
  id_comentario: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  tarefa_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: { model: 'tarefas', key: 'id_tarefa' }
  },
  autor_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: { model: 'usuarios', key: 'id_usuario' }
  },
  texto: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'comentarios',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em'
});

module.exports = Comentario;
