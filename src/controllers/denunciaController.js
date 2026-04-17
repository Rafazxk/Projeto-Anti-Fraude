import db from '../config/database.js';

const listarFeed = async (req, res) => {
    try {

        const query = `
            SELECT 'link' as tipo, url as valor, SUM(denuncias) as total 
            FROM links_reportados 
            GROUP BY url 
            HAVING SUM(denuncias) >= 1
            
            UNION ALL
            
            SELECT 'telefone' as tipo, numero as valor, SUM(denuncias) as total 
            FROM telefones_reportados 
            GROUP BY numero 
            HAVING SUM(denuncias) >= 1
            
            ORDER BY total DESC 
            LIMIT 5;
        `;
        
        const result = await db.query(query);
        
        // Retorna os dados para o seu dashboard.js usar no feed
        res.json(result.rows);
    } catch (err) {
        console.error("Erro ao carregar feed:", err);
        res.status(500).json({ error: "Erro interno ao carregar o feed de alertas." });
    }
 };

const criarDenuncia = async (req, res) => {
    const { tipo, valor, descricao } = req.body;
    try {
        if (tipo === 'link') {
            await db.query(
                'INSERT INTO links_reportados (url, denuncias) VALUES ($1, 1)', 
                [valor]
            );
        } else {
            await db.query(
                'INSERT INTO telefones_reportados (numero, denuncias) VALUES ($1, 1)', 
                [valor]
            );
        }
        res.status(201).json({ message: "Denúncia registrada com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: "Erro ao registrar no banco." });
    }
}

export default {
  listarFeed,
  criarDenuncia
};