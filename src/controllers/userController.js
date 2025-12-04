const UserService = require('../services/userServices');
const userService = new UserService();

const userController = {
  async create(req, res) {
    try {
      const novoUsuario = await userService.createUser(req.body);
      return res.status(201).json(novoUsuario);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const userAtualizado = await userService.updateUser(req.params.id, req.body);
      return res.status(200).json(userAtualizado);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const result = await userService.deleteUser(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  },
};

module.exports = userController;