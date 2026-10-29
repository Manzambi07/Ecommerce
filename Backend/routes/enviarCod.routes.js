const express = require('express');
const router = express.Router();
const crypto = require('crypto');
require('dotenv').config({ override: true });
const enviarEmail = require('../utils/mailer');
const { clientes, CodigoVerificacao } = require('../baseDedados');

// Função de hash idêntica à usada na rota de InserirCliente
const gerarHash = (codigo) => crypto.createHash('sha256').update(codigo).digest('hex');

router.post('/enviar-codigo', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ erro: 'Email obrigatório' });

        const jaExiste = await clientes.findOne({ where: { email } });
        if (jaExiste) return res.status(400).json({ erro: 'Este email já está cadastrado' });

        // Gera o código numérico de 6 dígitos
        const codigo = String(crypto.randomInt(100000, 1000000));

        // Cria ou atualiza o registro do código com o hash da função
        await CodigoVerificacao.upsert({
            email,
            codigoHash: gerarHash(codigo),
            expiraEm: new Date(Date.now() + 10 * 60 * 1000), // 10 minutos
            tentativas: 0
        });

        // Envia o código em texto puro por email
        await enviarEmail(email, codigo);

        res.json({ ok: true, mensagem: 'Código enviado com sucesso' });

    } catch (e) {
        console.error(e);
        res.status(500).json({ erro: 'Não foi possível enviar o email' });
    }
});

module.exports = router;