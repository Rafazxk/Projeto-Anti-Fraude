import jwt from "jsonwebtoken";


export default function authMiddleware(req, res, next) {
  console.log("1. Middleware recebendo requisição...");
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("Erro: Header ausente");
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.user_id,
      email: decoded.email
     }; 
    console.log("Middleware: token ok - id:", req.user.id);
    console.log("middleware: email ok -", req.user.email);
    
    next(); 
    
  } catch (err) {
    console.log("Erro no JWT:", err.message);
    return res.status(401).json({ error: "Token inválido" });
  }
}