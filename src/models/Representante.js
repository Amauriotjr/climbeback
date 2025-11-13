const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Empresa = require("./Empresa");

const Representante = sequelize.define("Representante", {
  id_representante: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  id_empresa: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Empresa,
      key: "id_empresa"
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  },
  nome: { type: DataTypes.STRING(255), allowNull: false },
  cpf: { type: DataTypes.CHAR(14), allowNull: false, unique: true },
  contato: { type: DataTypes.STRING(50) }
}, {
  tableName: "representantes",
  timestamps: false,
  underscored: true
});

Representante.belongsTo(Empresa, { foreignKey: "id_empresa" });

module.exports = Representante;