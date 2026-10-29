const expres = require('express')
const router = expres.Router()
const { clientes } = require('../baseDedados')
const { where } = require('sequelize')

router.get('/listarClient', async (req, res) => {

    const role = 'cliente'

    try {

        const dados = await clientes.findAll({where:{role:role}})
        res.status(200).json(dados)

    }catch(error){
      console.log(error)
      res.status(500).json({erro:error,sms:'erro ao listar usuarios'})
    }
    
})

module.exports= router