const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Cargo = sequelize.define('Cargo', {
  id_cargo: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome_cargo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'cargos',
  timestamps: false 
});

module.exports = Cargo;