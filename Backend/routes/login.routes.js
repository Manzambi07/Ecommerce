const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { clientes } = require('../baseDedados')



router.post('/api/login', async (req, res) => {
   
    const { email, senha } = req.body;

    try {

        const usuario = await clientes.findOne({ where: { email } })

        if (!usuario) {
            
            return res.status(401).json({ mensagem: 'Utilizador nao encontrado' })

        }

        const validada = await bcrypt.compare(senha, usuario.senha);

        if (!validada) {

            return res.status(401).json({ mensagem: 'Senha incorreta' });
            
        }

        const token = jwt.sign({ id: usuario.id, role: usuario.role }, 'SEGREDO_AQUI', { expiresIn: '1d' });
        res.status(200).json({ token, usuario })

    } catch (error) {
        res.status(500).json({ mensagem: 'Erro no servidor', erro: error.message })
    }
})

module.exports = router