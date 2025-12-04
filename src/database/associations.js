function applyAssociations(sequelize) {
  const { 
    User, Proposta, Empresa, Representante, Cargo, Contrato, 
    Documento, Tarefa, Permissao, CargoPermissao, Notificacao, Comentario 
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
  // (Relação onde o Documento "aponta" para o pai)
  Documento.belongsTo(Tarefa,   { foreignKey: 'tarefa_id',   targetKey: 'id_tarefa' });
  Documento.belongsTo(Empresa,  { foreignKey: 'empresa_id',  targetKey: 'id_empresa' });
  Documento.belongsTo(Contrato, { foreignKey: 'contrato_id', targetKey: 'id_contrato', as: 'contrato_pai' });

  // Proposta ↔ Contrato (1–1)  (PK de Proposta = id_proposta)
  Proposta.hasOne(Contrato, { foreignKey: 'proposta_id', sourceKey: 'id_proposta', as: 'contrato' });
  Contrato.belongsTo(Proposta, { foreignKey: 'proposta_id', targetKey: 'id_proposta', as: 'proposta' });

  // Empresa ↔ Contrato (1–N)
  Empresa.hasMany(Contrato, { foreignKey: 'empresa_id', sourceKey: 'id_empresa', as: 'contratos' });
  Contrato.belongsTo(Empresa, { foreignKey: 'empresa_id', targetKey: 'id_empresa', as: 'empresa' });

  // --- NOVO: Contrato ↔ Documento (O Contrato aponta para o PDF Assinado) ---
  // Isso permite fazer: Contrato.findOne({ include: 'documento_assinado' })
  Contrato.belongsTo(Documento, { 
    foreignKey: 'documento_id', 
    targetKey: 'id_documento', 
    as: 'documento_assinado' 
  });
  // --------------------------------------------------------------------------

  // (Opcional, mas útil para integridade e includes)
  Tarefa.belongsTo(Contrato, { foreignKey: 'contrato_id', targetKey: 'id_contrato' });
  Tarefa.belongsTo(Proposta, { foreignKey: 'proposta_id', targetKey: 'id_proposta' });

  // User ↔ Notificacao (destinatário)
  User.hasMany(Notificacao, { foreignKey: 'usuario_id_destino', sourceKey: 'id_usuario', as: 'notificacoes_recebidas' });
  Notificacao.belongsTo(User, { foreignKey: 'usuario_id_destino', targetKey: 'id_usuario', as: 'destinatario' });

  // Tarefa ↔ Comentario; User ↔ Comentario (autor)
  Tarefa.hasMany(Comentario, { foreignKey: 'tarefa_id', sourceKey: 'id_tarefa', as: 'comentarios' });
  Comentario.belongsTo(Tarefa, { foreignKey: 'tarefa_id', targetKey: 'id_tarefa', as: 'tarefa' });
  User.hasMany(Comentario, { foreignKey: 'autor_id', sourceKey: 'id_usuario', as: 'comentarios' });
  Comentario.belongsTo(User, { foreignKey: 'autor_id', targetKey: 'id_usuario', as: 'autor' });
}

module.exports = { applyAssociations };