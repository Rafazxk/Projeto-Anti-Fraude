import { CriarSessaoCheckout } from '../domain/usecases/Pagamento/CriarSessaoCheckout.js';

export const PagamentoController = {
    async checkout(req, res) {
        console.log("(CONTROLLER) INICIANDO PAGAMENTO ")
        try {
            const useCase = new CriarSessaoCheckout();
            
            const sessionId = await useCase.execute({ 
                userId: req.user.id, 
                email: req.user.email 
            });
            
            console.log("(CONTROLLER) ", sessionId);
            
            return res.json({ id: sessionId });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export default PagamentoController;