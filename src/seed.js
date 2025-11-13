const sequelize = require('./db');
const bcrypt = require("bcrypt");

require('./models/User');
require('./models/Empresa');
require('./models/Representante');
require('./models/Proposta');
require('./models/Cargo');
require('./models/Contrato');
require('./models/Permissao');
require('./models/CargoPermissao');
require('./models/Documento');
require('./models/Tarefa');

const { Cargo, Empresa, User } = sequelize.models;

async function runSeed() {
  console.log('Iniciando o script de seed...');
  try {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    console.log('Checagem de chaves estrangeiras desabilitada.');

    await sequelize.sync({ force: true });
    console.log('Banco de dados limpo e sincronizado.');
    console.log('Iniciando a inserção de dados...');
    const cargoDev = await Cargo.create({ nome_cargo: 'Desenvolvedor' });
    console.log(`- Cargo criado: ${cargoDev.nome_cargo} (ID: ${cargoDev.id_cargo})`);

    const empresaClimbe = await Empresa.create({
      nome_fantasia: 'Climbe Soluções Digitais',
      cnpj: '34.028.316/0001-03'
    });
    console.log(`- Empresa criada: ${empresaClimbe.nome_fantasia} (ID: ${empresaClimbe.id_empresa})`);

    const senhaHash = await bcrypt.hash('senha_padrao_123', 10);
    const usuarioAdmin = await User.create({
      nome_completo: 'Admin do Sistema',
      cargo_id: cargoDev.id_cargo,
      cpf: '000.000.000-00',
      email: 'admin@climbe.com',
      contato: '79999999999',
      senha_hash: senhaHash
    });
    console.log(`- Usuário criado: ${usuarioAdmin.nome_completo} (ID: ${usuarioAdmin.id_usuario})`);

    console.log('\nSeed executado com sucesso!');

  } catch (error) {
    console.error('Erro ao executar o seed:', error);
  } finally {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    await sequelize.close();
    console.log('Checagem de chaves estrangeiras reabilitada. Conexão com o banco fechada.');
  }
}

runSeed();