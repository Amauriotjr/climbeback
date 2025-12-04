const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Servico = sequelize.define("Servico", {
  id_servico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome_servico: { 
    type: DataTypes.STRING(255), 
    allowNull: false
  },
  tipo_servico: { 
    type: DataTypes.ENUM("Contabilidade", "Valuation", "BPO", "CFO", "M&A"),
    allowNull: false
  },
  descricao: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  preco_base: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  duracao_estimada: { 
    type: DataTypes.INTEGER, // em dias
    allowNull: true 
  },
  situacao: { 
    type: DataTypes.ENUM("ativo", "inativo"), 
    defaultValue: "ativo" 
  },
  data_criacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  data_atualizacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "servicos", 
  timestamps: false,      
  underscored: true       
});

module.exports = Servico;

