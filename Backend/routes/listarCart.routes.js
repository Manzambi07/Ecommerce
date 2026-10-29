const express = require('express')
const router = express.Router()
const { carrinho, clientes } = require('../baseDedados')  


router.get('/ListarCart/:id', async (req, res) => {  
  const idcliente = req.params.id 
  try {
    const Carrinho = await carrinho.findAll({
     where: { idCliente: idcliente },  
      include: ['clientes']
    })
    res.status(200).json(Carrinho)  // 200 para listagem, não 201 (201 é "criado") 204 eliminado  
  } catch (error) {
      console.log(error) 
      res.status(500).json({ mensagem: 'erro na resposta', erro: error.message })
  }
})

module.exports = router