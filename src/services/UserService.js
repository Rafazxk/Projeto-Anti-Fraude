import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository.js";
import bcrypt from "bcryptjs";

class UserService {
  async register({ email, senha, tipo_pessoa }) {
    const userExists = await UserRepository.findByEmail(email);

    if (userExists) {
      throw new Error("Usuário já existe");
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const user = await UserRepository.create({
      email,
      senha: senhaHash,
      tipo_pessoa
    });

    return user;
  }

  async login({ email, senha }) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      throw new Error("Senha inválida");
    }

   //gerar token 
   
   const token = jwt.sign(
     { user_id: user.user_id },
     { token: process.env.JWT_SECRET }, 
     { expiresIn: "1d" }
     );

    return { user, token };
  }
}

export default new UserService();