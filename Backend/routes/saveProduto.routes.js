const express = require('express')
const router = express.Router()
const { produtos } = require('../baseDedados')

router.post('/inserirProd', (req, res) => {

    const dados = req.body
    try {

        produtos.create(dados)
        res.status(201).json({mensagem:'producto criado com sucesso'})

    }catch{
        res.status(500).json({erro:'erro ao inserir productos'})
    }
   
})

module.exports = router