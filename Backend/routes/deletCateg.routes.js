const expres = require('express')
const router = expres.Router()
const { categoria } = require('../baseDedados')

router.delete('/eliminarCat/:id', (req, res) => {

    const id = parseInt(req.params.id)
    try {

        if(id === null){
                    res.status(500).json({ erro: error.message, sms: 'erro ao eliminar registro' })
                    return  
        }
        
        categoria.destroy({ where: { id } })

        res.status(204).json({ sms: 'registro eliminado' })

    } catch (error) {
        res.status(500).json({ erro: error.message, sms: 'erro ao eliminar registro' })
    }

})

module.exports = router