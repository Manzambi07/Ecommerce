const expres = require('express')
const router = expres.Router()
const { clientes } = require('../baseDedados')
const { route } = require('./listarCart.routes')

router.get('/ListarUser', async (req, res) => {

    const admin = 'Admin'

    try {
        const dados = await clientes.findAll({ where: { role: admin } })
        res.status(200).json(dados)
    } catch (error) {

        res.status(500).json({ erro: error.message || 'Erro ao listar usuarios' })

    }

})

module.exports = router