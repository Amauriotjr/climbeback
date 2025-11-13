const path = require('path');
const { DataTypes } = require("sequelize");
const sequelize = require(path.join(__dirname, '..', 'db.js'));

const User = sequelize.define("User", {
  id_usuario: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  nome_completo: { 
    type: DataTypes.STRING(255), 
    allowNull: false
  },
  cargo_id: { 
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING(14), 
    allowNull: false,
    unique: true,
  },
  email: { 
    type: DataTypes.STRING(150), 
    allowNull: false, 
    unique: true 
  },
  contato: { 
    type: DataTypes.STRING(20), 
    allowNull: false 
  },
  situacao: { 
    type: DataTypes.ENUM("ativo", "inativo"), 
    defaultValue: "ativo" 
  },
  senha_hash: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  }
}, {
  tableName: "usuarios", 
  timestamps: false,      
  underscored: true       
});

module.exports = User;
