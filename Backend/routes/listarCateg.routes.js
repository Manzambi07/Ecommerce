const expres = require('express')
const router = expres.Router()
const { categoria } = require('../baseDedados')


//listar categorias

router.get('/ListarCategory', async (req, res) => {

    try {
        const dados = await categoria.findAll()
        res.status(200).json(dados)

    } catch (error) {
        res.status(500).json({ mensagem: error.message || 'Erro ao Listar ' })
    }
})

module.exports = router


