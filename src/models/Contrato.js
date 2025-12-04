const path = require('path');
const { DataTypes } = require("sequelize");
const sequelize = require(path.join(__dirname, '..', 'db.js'));

const Contrato = sequelize.define("Contrato", {
  id_contrato: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  proposta_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  empresa_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  documento_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    comment: 'ID do documento (PDF/Arquivo) oficial deste contrato'
  },
  valor_final: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('rascunho', 'ativo', 'suspenso', 'encerrado'),
    defaultValue: 'rascunho'
  },
  data_assinatura: {
    type: DataTypes.DATE,
    allowNull: true
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: "contratos",
  timestamps: true 
});

module.exports = Contrato;