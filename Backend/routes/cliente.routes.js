const express = require('express')
const router = express.Router()
const { clientes, CodigoVerificacao } = require('../baseDedados') // acrescentei CodigoVerificacao
const bcrypt = require('bcrypt')
const crypto = require('crypto') // novo




const hash = (codigo) => crypto.createHash('sha256').update(codigo).digest('hex') // novo

//inserir clientes
router.post('/InserirCliente', async (req, res) => {
    try {
        const dados = req.body;

        // ---------- verificação do código (novo) ----------
        const registo = await CodigoVerificacao.findOne({ where: { email: dados.email } })
        if (!registo) return res.status(400).json({ erro: 'Peça um código primeiro' })

        if (registo.expiraEm < new Date()) {
            await registo.destroy()
            return res.status(400).json({ erro: 'Código expirado, peça outro' })
        }

        if (registo.tentativas >= 5) {
            return res.status(429).json({ erro: 'Demasiadas tentativas, peça outro código' })
        }

        if (registo.codigoHash !== hash(String(dados.codigo))) {
            await registo.increment('tentativas')
            return res.status(400).json({ erro: 'Código incorreto' })
        }
        // ---------------------------------------------------

        delete dados.codigo // não vai para a tabela clientes

        const senhaHash = await bcrypt.hash(dados.senha, 10);
        dados.senha = senhaHash;

        const sucesso = await clientes.create(dados);
        await registo.destroy() // novo: o código só pode ser usado uma vez

        res.status(201).json({ message: 'cliente inserido', cliente: sucesso });
    } catch (error) {
        console.log('Erro de validação:', error.errors?.map(e => e.message));
        console.log(error.message);
        res.status(500).json({ mensagem: 'erro ao inserir cliente', erro: error.message });
    }
});


module.exports = router