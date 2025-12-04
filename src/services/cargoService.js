const Cargo = require('../models/Cargo');

class CargoService {
  async create(cargoData) {
    return await Cargo.create(cargoData);
  }
  async getAll() {
    return await Cargo.findAll();
  }
}

module.exports = CargoService;