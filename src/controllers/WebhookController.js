// src/controllers/WebhookController.js
import UserService from '../services/UserService.js';

class WebhookController {
  async handle(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      // Validação de segurança do Stripe
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id; 

      await UserService.virarPro(userId);
      console.log(`[SUCESSO] Usuário ${userId} atualizado via Webhook.`);
    }

    return res.status(200).json({ received: true });
  }
}
export default new WebhookController();