const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const GoogleToken = sequelize.define('GoogleToken', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  access_token: { type: DataTypes.TEXT, allowNull: false },
  refresh_token: { type: DataTypes.TEXT, allowNull: true },
  scope: { type: DataTypes.TEXT, allowNull: true },
  token_type: { type: DataTypes.STRING(32), allowNull: true },
  expiry_date: { type: DataTypes.BIGINT, allowNull: true }
}, {
  tableName: 'google_tokens',
  timestamps: true,
  underscored: true,
});

module.exports = GoogleToken;