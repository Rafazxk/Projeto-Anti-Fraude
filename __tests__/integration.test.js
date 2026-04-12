import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken'; // Importe a lib

describe('Guardix Integration API', () => {
    let token;

    beforeAll(() => {
        // Geramos um token real assinado pela sua chave secreta
        // Certifique-se de que a variável de ambiente JWT_SECRET esteja carregada no teste
        const secret = process.env.JWT_SECRET || 'chave_padrao_para_teste';
       
        token = jwt.sign({ userId: 123 }, secret, { expiresIn: '1h' });
    });

    test('POST /api/link - Deve passar com token real', async () => {
        const response = await request(app)
            .post('/api/link')
            .set('Authorization', `Bearer ${token}`) // Enviando o token real
            .send({ url: 'http://go0ogle.ru' });
        
        expect(response.statusCode).toBe(200); // Agora deve passar!
    });
});