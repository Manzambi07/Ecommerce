const expres = require('express')
const router = expres.Router()
const { categoria } = require('../baseDedados')


//Adicionar categorias
router.post('/categInserir', async (req, res) => {
    const dados = req.body
    try {
        await categoria.create(dados)
        res.status(201).json({ sms: 'dados criado com sucesso' })
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

module.exports = router