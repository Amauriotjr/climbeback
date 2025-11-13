const User = require("../models/User");
const bcrypt = require("bcrypt");

class UserService {
  async createUser(userData) {
    const { email, cpf, senha } = userData;
    const userExists = await User.findOne({ where: { email } }) || await User.findOne({ where: { cpf } });
    if (userExists) {
      throw new Error("Usuário já cadastrado com este e-mail ou CPF.");
    }

    const senha_hash = await bcrypt.hash(senha, 10);
    const newUser = await User.create({ ...userData, senha_hash });
    
    const { senha_hash: _, ...userWithoutPassword } = newUser.toJSON();
    return userWithoutPassword;
  }

  async getAllUsers() {
    return await User.findAll({ attributes: { exclude: ['senha_hash'] } });
  }

  async getUserById(id) {
    const user = await User.findByPk(id, { attributes: { exclude: ['senha_hash'] } });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    return user;
  }

  async updateUser(id, updateData) {
    const user = await this.getUserById(id);
    if (updateData.senha) {
      updateData.senha_hash = await bcrypt.hash(updateData.senha, 10);
      delete updateData.senha;
    }
    await user.update(updateData);
    
    const { senha_hash, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async deleteUser(id) {
    const user = await this.getUserById(id);
    await user.destroy();
    return { message: "Usuário deletado com sucesso" };
  }
}

module.exports = UserService;