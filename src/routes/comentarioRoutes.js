const express = require('express');
const router = express.Router();

const controller = require('../controllers/comentarioController');
const validate = require('../middlewares/validate');
const { comentarioCreateDto } = require('../dtos/comentarioDto');

// POST /api/comentarios
router.post('/', validate(comentarioCreateDto), controller.criar);

// GET /api/comentarios/por-tarefa/:tarefaId
router.get('/por-tarefa/:tarefaId', controller.listarPorTarefa);

module.exports = router;
