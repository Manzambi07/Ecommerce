const expres = require('express')
const router = expres.Router()
const { Op, literal } = require('sequelize')
// ⚠️ troca "Carrinho" pelo nome do model do carrinho que usas na rota /elimiCart
const { sequelize, produtos, Venda, ItemVenda, carrinho } = require('../baseDedados')


router.post('/venda', async (req, res) => {

  const { idCliente, metodoPagamento, itens } = req.body;
  const t = await sequelize.transaction();

  console.log(' itens chegaram:' + idCliente, metodoPagamento, itens)

  try {
    let total = 0;
    const linhas = [];

    for (const item of itens) {
      const quantidade = Number(item.quantidade);

      if (!Number.isInteger(quantidade) || quantidade <= 0) {
        throw new Error('Quantidade inválida');
      }

      const produto = await produtos.findByPk(item.idProduto, {
        transaction: t,
        lock: t.LOCK.UPDATE   // evita duas compras ao mesmo tempo gastarem o mesmo stock
      });

      if (!produto) throw new Error(`Produto ${item.idProduto} não existe`);
      if (produto.qtd < quantidade) {
        throw new Error(`Stock insuficiente para ${produto.producto}`);
      }

      const subtotal = Number(produto.preco) * quantidade;
      total += subtotal;

      linhas.push({
        idProduto: produto.id,
        nomeProduto: produto.producto,
        precoUnitario: produto.preco,
        quantidade,
        subtotal
      });

      // ✅ CORRIGIDO: antes escrevia em "stock", mas o campo que lês acima é "qtd".
      // Como "stock" não existe no model, o Sequelize ignorava e nada descia.
      await produto.update(
        { qtd: produto.qtd - quantidade },
        { transaction: t }
      );

      // ✅ NOVO: o cliente já comprou este produto, então sai do carrinho
      if (item.idCarrinho) {
        await carrinho.destroy({
          where: { id: item.idCarrinho },
          transaction: t
        });
      }
    }

    const venda = await Venda.create(
      { idCliente, total, metodoPagamento },
      { transaction: t }
    );

    await ItemVenda.bulkCreate(
      linhas.map(l => ({ ...l, idVenda: venda.id })),
      { transaction: t }
    );

    await t.commit();

    // ✅ NOVO: devolve tudo o que o recibo precisa
    res.json({
      sucesso: true,
      idVenda: venda.id,
      total,
      metodoPagamento,
      data: venda.createdAt || new Date(),
      itens: linhas
    });
  } catch (erro) {
    await t.rollback();
    res.status(400).json({ sucesso: false, mensagem: erro.message });
  }
})

module.exports = router