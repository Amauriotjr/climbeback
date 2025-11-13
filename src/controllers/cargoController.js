const CargoService = require('../services/cargoService');
const cargoService = new CargoService();

const cargoController = {
  async create(req, res) {
    try {
      const novoCargo = await cargoService.create(req.body);
      return res.status(201).json(novoCargo);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
  async getAll(req, res) {
    try {
      const cargos = await cargoService.getAll();
      return res.status(200).json(cargos);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = cargoController;