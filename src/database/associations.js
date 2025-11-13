function applyAssociations(sequelize) {
  const { 
    User, Proposta, Empresa, Representante, Cargo, Contrato, 
    Documento, Tarefa, Permissao, CargoPermissao 
  } = sequelize.models;

  // Cargo ↔ User
  Cargo.hasMany(User, { foreignKey: 'cargo_id' });
  User.belongsTo(Cargo, { foreignKey: 'cargo_id' });

  // User ↔ Proposta
  User.hasMany(Proposta, { foreignKey: 'usuario_id', sourceKey: 'id_usuario' });
  Proposta.belongsTo(User, { foreignKey: 'usuario_id', targetKey: 'id_usuario' });

  // Empresa ↔ Proposta  (PK de Empresa = id_empresa)
  Empresa.hasMany(Proposta, { foreignKey: 'empresa_id', sourceKey: 'id_empresa' });
  Proposta.belongsTo(Empresa, { foreignKey: 'empresa_id', targetKey: 'id_empresa' });

  // Empresa ↔ Representante
  Empresa.hasMany(Representante, { foreignKey: 'id_empresa', sourceKey: 'id_empresa' });
  Representante.belongsTo(Empresa, { foreignKey: 'id_empresa', targetKey: 'id_empresa' });

  // Cargo ↔ Permissão (tabela pivô)
  Cargo.belongsToMany(Permissao, { through: CargoPermissao, foreignKey: 'id_cargo', otherKey: 'id_permissao' });
  Permissao.belongsToMany(Cargo, { through: CargoPermissao, foreignKey: 'id_permissao', otherKey: 'id_cargo' });

  // Tarefa ↔ User (responsável)
  Tarefa.belongsTo(User, { foreignKey: 'responsavel_id', targetKey: 'id_usuario' });
  User.hasMany(Tarefa, { foreignKey: 'responsavel_id', sourceKey: 'id_usuario' });

  // Documento ↔ (Tarefa, Empresa, Contrato)
  Documento.belongsTo(Tarefa,   { foreignKey: 'tarefa_id',   targetKey: 'id_tarefa' });
  Documento.belongsTo(Empresa,  { foreignKey: 'empresa_id',  targetKey: 'id_empresa' });
  Documento.belongsTo(Contrato, { foreignKey: 'contrato_id', targetKey: 'id_contrato' });

  // Proposta ↔ Contrato (1–1)  (PK de Proposta = id_proposta)
  Proposta.hasOne(Contrato, { foreignKey: 'proposta_id', sourceKey: 'id_proposta', as: 'contrato' });
  Contrato.belongsTo(Proposta, { foreignKey: 'proposta_id', targetKey: 'id_proposta', as: 'proposta' });

  // Empresa ↔ Contrato (1–N)
  Empresa.hasMany(Contrato, { foreignKey: 'empresa_id', sourceKey: 'id_empresa', as: 'contratos' });
  Contrato.belongsTo(Empresa, { foreignKey: 'empresa_id', targetKey: 'id_empresa', as: 'empresa' });

  // (Opcional, mas útil para integridade e includes)
  Tarefa.belongsTo(Contrato, { foreignKey: 'contrato_id', targetKey: 'id_contrato' });
  Tarefa.belongsTo(Proposta, { foreignKey: 'proposta_id', targetKey: 'id_proposta' });
}

module.exports = { applyAssociations };
