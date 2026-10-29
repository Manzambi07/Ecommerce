const express = require('express')
const router = express.Router()
const { produtos } = require('../baseDedados')
const { where } = require('sequelize')

//rotas de listagem de produtos
router.get('/ListarProductos', (req, res) => {

      const qtd =  produtos.qtd

      produtos.findAll().then((dados) => {
            res.status(201).json(dados);
      }).catch((error) => {
            res.status(500).json({ mensagem: 'erro na resposta', erro: error.message })
      })
})

module.exports = router