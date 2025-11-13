const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Empresa = sequelize.define("Empresa", {
  id_empresa: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  razao_social: { type: DataTypes.STRING(255) },
  nome_fantasia: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  cnpj: { 
    type: DataTypes.CHAR(18), 
    allowNull: false,
    unique: true
  },
  logradouro: { type: DataTypes.STRING(255) },
  numero: { type: DataTypes.STRING(255) },
  bairro: { type: DataTypes.STRING(255) },
  cidade: { type: DataTypes.STRING(255) },
  uf: { type: DataTypes.STRING(2) },
  cep: { type: DataTypes.STRING(10) },
  telefone: { type: DataTypes.STRING(50) },
  email: { type: DataTypes.STRING(255) }
}, {
  tableName: "empresas",
  timestamps: false,
  underscored: true
});

module.exports = Empresa;