import UserService from "../services/UserService.js";

 console.log("ARQUIVO CONTROLLER CARREGADO")

class UserController {
  async register(req, res) {
    try {
      const user = await UserService.register(req.body);
      return res.status(201).json(user);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      console.log("debug - controller ", req.body);
      const {user, token } = await UserService.login(req.body);
      
      const resposta = {
        user: {
          id: user.user.id,
          email: user.email
        },
        token
      }
      console.log("debug - ", resposta);
      return res.status(200).json(resposta);
    } catch (err) {
      return res.status(401).json({ error: err.message });
    }
  }
  
  async virarPro(req, res){
    try{
      const userId = req.user.id;
      const user = await UserService.virarPro(userId);
      
      console.log("id que o controller recebeu: ", userId);
      return res.status(200).json({ message: "Upgrade Concluído", user });
    } catch(err){
      return res.status(400).json({ error: err.message });
    }
  }
}

export default new UserController();