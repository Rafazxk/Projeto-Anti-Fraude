import UserService from "../services/UserService.js";

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
      const {user, token } = await UserService.login(req.body);
      
      return res.status(200).json({
        user,
        token
      });
    } catch (err) {
      return res.status(401).json({ error: err.message });
    }
  }
}

export default new UserController();