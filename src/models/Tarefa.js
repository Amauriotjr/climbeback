const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Tarefa = sequelize.define('Tarefa', {
  id_tarefa: {
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
    type: DataTypes.TEXT,
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM('atividade', 'reuniao'),
    allowNull: false,
    defaultValue: 'atividade'
  },
  status: {
    type: DataTypes.ENUM('a_fazer', 'em_andamento', 'concluida', 'agendada', 'realizada', 'cancelada'),
    allowNull: false,
    defaultValue: 'a_fazer'
  },
  data_inicio: {
    type: DataTypes.DATE,
    allowNull: true
  },
  data_fim: {
    type: DataTypes.DATE,
    allowNull: true
  },

  responsavel_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    }
  },
  empresa_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'empresas',
      key: 'id_empresa'
    }
  },
  contrato_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'contratos',
      key: 'id_contrato'
    }
  },
  proposta_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'propostas',
      key: 'id_proposta'
    }
  }
}, {
  tableName: 'tarefas',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em'
});

module.exports = Tarefa;
