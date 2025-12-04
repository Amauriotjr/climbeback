const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Cargo = require('./Cargo');
const Permissao = require('./Permissao'); 

const CargoPermissao = sequelize.define('CargoPermissao', {
  id_cargo: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    references: {
      model: Cargo,
      key: 'id_cargo'
    }
  },
  id_permissao: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    references: {
      model: Permissao,
      key: 'id_permissao'
    }
  }
}, {
  tableName: 'cargo_permissoes',
  timestamps: false
});

module.exports = CargoPermissao;