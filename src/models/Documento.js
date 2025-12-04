const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Documento = sequelize.define('Documento', {
  id_documento: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('planilha', 'relatorio', 'pdf', 'imagem', 'outro'),
    allowNull: false
  },
url: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'URL para o arquivo no Google Sheets, S3, ou outro storage'
  },

  google_file_id: {
    type: DataTypes.STRING(128),
    allowNull: true
  },
  google_spreadsheet_id: {
    type: DataTypes.STRING(128),
    allowNull: true
  },
  is_bloqueado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },

  empresa_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
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
  cargo_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'cargos',
      key: 'id_cargo'
    }
  },
  tarefa_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'tarefas',
      key: 'id_tarefa'
    }
  }
}, {
  tableName: 'documentos',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em'
});

module.exports = Documento;