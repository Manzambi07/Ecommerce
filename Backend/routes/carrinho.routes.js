const express = require('express')
const routes = express.Router()
const {carrinho} = require('../baseDedados')

routes.post('/apiCart', (req, res) => {

    const dados = req.body

    carrinho.create(dados).then((result) => {  
        res.status(201).json({ message: 'Producto adicionado ao carrinho', sms: result.id })

    }).catch((err) => {

        res.status(500).json({ message: 'Erro de servidor', sms: err.message })
        console.log(err.message)

    });

})



module.exports = routes