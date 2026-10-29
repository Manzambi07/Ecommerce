const expres = require('express')
const router = expres.Router()
const { categoria } = require('../baseDedados')
const { where } = require('sequelize')


//Editar categorias
router.put('/EditarCategoria/:id', async (req, res) => {  
    
    const id = parseInt(req.params.id)
    const dados = req.body
   try {
    if (Number.isNaN(id)) {
        return res.status(400).json({ erro: 'id inválido' })
    }
    await categoria.update({ categoria: dados.categoria }, { where: { id } })
    res.status(200).json({ sucesso: 'registro alterado com sucesso' })
} catch (error) {
    res.status(500).json({ erro: error.message })
}

})

module.exports = router