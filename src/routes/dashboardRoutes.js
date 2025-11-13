
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');


router.get(
  '/stats',
  dashboardController.getStats 
);

router.get(
  '/pipeline',
  dashboardController.getPipeline
);

router.get(
  '/equipe',
  dashboardController.getEquipePerformance
);

module.exports = router;