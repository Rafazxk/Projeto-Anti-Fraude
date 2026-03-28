import jwt from "jsonwebtoken";

const SECRET = "dsadjsadj";

export default function authMiddleware(req, res, next) {
  console.log("1. Middleware recebendo requisição...");
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("Erro: Header ausente");
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; 
    console.log("2. Token válido! Chamando next()...");
    
    next(); // <--- SE ESSA LINHA NÃO FOR EXECUTADA, O CONTROLLER NUNCA ABRE
    
  } catch (err) {
    console.log("Erro no JWT:", err.message);
    return res.status(401).json({ error: "Token inválido" });
  }
}