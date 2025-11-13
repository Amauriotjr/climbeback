CREATE TABLE IF NOT EXISTS contratos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  proposta_id INT UNSIGNED NOT NULL,
  empresa_id  INT UNSIGNED NOT NULL,
  valor_final DECIMAL(12,2) NOT NULL,
  data_assinatura DATETIME NULL,
  status ENUM('rascunho','ativo','suspenso','encerrado') DEFAULT 'rascunho',
  observacoes TEXT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
