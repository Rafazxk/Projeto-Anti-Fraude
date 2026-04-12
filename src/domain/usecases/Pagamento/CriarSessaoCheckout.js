import Stripe from 'stripe';

export class CriarSessaoCheckout {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
async execute({ userId, email }) {
    try {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer_email: email,
            line_items: [{
                price: process.env.STRIPE_PRICE_ID, 
                quantity: 1,
            }],
            success_url: `${process.env.APP_URL}/dashboard?status=success`,
            cancel_url: `${process.env.APP_URL}/dashboard?status=canceled`,
            cliente_reference_id: userId
        });
        return session.id;
    } catch (error) {
        // ESSA LINHA VAI TE SALVAR
        console.error("ERRO DO STRIPE:", error.message);
        throw new Error(`Falha no Stripe: ${error.message}`);
    }
}
    
}