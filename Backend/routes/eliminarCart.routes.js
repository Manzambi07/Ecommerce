const express = require('express')
const routes = express.Router()
const { carrinho } = require('../baseDedados')

routes.delete('/elimiCart/:id', (req, res) => {
    
    const id = parseInt(req.params.id);
    carrinho.destroy({ where: { id } }).then(linhasApagadas => {
        if (linhasApagadas === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado no carrinho' });
        }
        res.status(200).json({ mensagem: 'Produto eliminado com sucesso' });
    }).catch((error) => {
        res.status(500).json({ erro: error.message });
        console.log(error.message);
    });
});

module.exports = routes