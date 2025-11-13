const dashboardService = require('../services/dashboardService');

exports.getStats = async (req, res) => {
  try {
    const stats = await dashboardService.getStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPipeline = async (req, res) => {
  try {
    const pipeline = await dashboardService.getPipeline();
    res.status(200).json(pipeline);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEquipePerformance = async (req, res) => {
  try {
    const performance = await dashboardService.getEquipePerformance();
    res.status(200).json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};