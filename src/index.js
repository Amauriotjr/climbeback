require('dotenv').config();
const express = require("express");
const sequelize = require('./db');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

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
require('./models/Servico');
require('./models/GoogleToken');

const { applyAssociations } = require('./database/associations');
applyAssociations(sequelize);

const app = express();
app.use(express.json());
app.use(cors());

const userRoutes = require("./routes/userRoutes");
const empresaRoutes = require("./routes/empresaRoutes");
const representanteRoutes = require("./routes/representanteRoutes");
const propostasRoutes = require('./routes/propostasRoutes');
const documentosRoutes = require('./routes/documentosRoutes');
const cargoRoutes = require('./routes/cargoRoutes');
const tarefaRoutes = require('./routes/tarefaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const googleDriveRoutes = require('./routes/integrations/googleDriveRoutes');
const servicoRoutes = require('./routes/servicoRoutes');
const contratoRoutes = require('./routes/contratoRoutes');
const contratosIntegrationRoutes = require('./routes/contratosIntegrationRoutes');
const googleCalendarRoutes = require('./integrations/googleCalendar/routes');

app.use("/api/usuarios", userRoutes);
app.use("/api/empresas", empresaRoutes);
app.use("/api/representantes", representanteRoutes);
app.use('/api/propostas', propostasRoutes);
app.use('/api/documentos', documentosRoutes);
app.use('/api/integrations/google-drive', googleDriveRoutes);
app.use('/api/cargos', cargoRoutes);
app.use('/api/tarefas', tarefaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/servicos', servicoRoutes);
app.use('/api/contratos', contratoRoutes);
app.use('/api', contratosIntegrationRoutes);
app.use('/api/google-calendar', googleCalendarRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const PORT = process.env.PORT || 3000;

// Função para inicializar o banco de dados
async function initializeDatabase() {
  try {
    // Testa a conexão
    await sequelize.authenticate();
    console.log('✓ Conexão com o banco de dados estabelecida com sucesso!');
    
    // Sincroniza o banco (cria tabelas se não existirem)
    await sequelize.sync({ alter: true });
    console.log('✓ Banco de dados e associações sincronizados!');
    
    // Verifica se precisa executar o seed (se não houver dados)
    const { Cargo } = sequelize.models;
    const cargoCount = await Cargo.count();
    
    if (cargoCount === 0) {
      console.log('→ Banco vazio detectado. Executando seed inicial...');
      await runInitialSeed();
    } else {
      console.log('✓ Banco já possui dados. Seed não necessário.');
    }
    
  } catch (error) {
    console.error('✗ Erro ao inicializar o banco de dados:', error.message);
    throw error;
  }
}

// Função de seed inicial
async function runInitialSeed() {
  const bcrypt = require("bcrypt");
  const { Cargo, Empresa, User } = sequelize.models;
  
  try {
    const cargoDev = await Cargo.create({ nome_cargo: 'Desenvolvedor' });
    console.log(`  - Cargo criado: ${cargoDev.nome_cargo}`);

    const empresaClimbe = await Empresa.create({
      nome_fantasia: 'Climbe Soluções Digitais',
      cnpj: '34.028.316/0001-03'
    });
    console.log(`  - Empresa criada: ${empresaClimbe.nome_fantasia}`);

    const senhaHash = await bcrypt.hash('senha_padrao_123', 10);
    const usuarioAdmin = await User.create({
      nome_completo: 'Admin do Sistema',
      cargo_id: cargoDev.id_cargo,
      cpf: '000.000.000-00',
      email: 'admin@climbe.com',
      contato: '79999999999',
      senha_hash: senhaHash
    });
    console.log(`  - Usuário criado: ${usuarioAdmin.nome_completo}`);
    console.log('✓ Seed inicial executado com sucesso!');
    
  } catch (error) {
    console.error('✗ Erro ao executar seed inicial:', error.message);
    throw error;
  }
}

// Inicia o servidor
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error("✗ Falha ao iniciar o servidor:", err.message);
    process.exit(1);
  });
