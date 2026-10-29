const expres = require('express')
const router= expres.Router()
const {clientes} = require('../baseDedados')



router.put('/EditarUser/:id', async (req, res) => {
  const { nome, email, morada, foto, senha } = req.body
  const campos = { nome, email, morada }
  if (foto) campos.foto = foto
  if (senha) campos.senha = senha
  await clientes.update(campos, { where: { id: req.params.id } })
  res.json({ mensagem: 'ok' })
})

module.exports= router