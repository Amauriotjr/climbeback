// src/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Climbe Backend API',
      version: '1.0.0',
      description: 'Documentação da API do projeto Climbe Backend, gerada automaticamente com Swagger.',
    },
    servers: [
      {
        url: '/api', // <- mantém, pois suas rotas são montadas em /api/...
        description: 'Servidor Principal (base path)',
      },
    ],
  },
  apis: [
    './src/routes/*.js',
    './src/routes/**/*.js',                // 👈 ADICIONE ESTA LINHA (varre subpastas de routes)
    './src/dtos/*.js', 
    './src/models/*.js',
    './src/integrations/googleCalendar/*.js',
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;

