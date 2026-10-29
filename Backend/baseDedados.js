
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const { FORCE } = require('sequelize/lib/index-hints');

const sequelize = new Sequelize(

  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {

  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false,

}

)

//tabelas 
const produtos = sequelize.define('produtos', {
  foto: { type: DataTypes.TEXT },
  producto: { type: DataTypes.TEXT, allowNull: false },
  categoria: { type: DataTypes.TEXT, allowNull: false },
  qtd: { type: DataTypes.INTEGER, allowNull: false },
  preco: { type: DataTypes.DECIMAL, allowNull: false },
  descricao: { type: DataTypes.TEXT, allowNull: false }
})
const clientes = sequelize.define('clientes', {

  foto: {
    type: DataTypes.BLOB
  },
  nome: {
    type: DataTypes.TEXT
  },
  email: {
    type: DataTypes.TEXT
  },
  senha: {
    type: DataTypes.TEXT
  },
  morada: {

    type: DataTypes.TEXT
  },
  role: {
    type: DataTypes.TEXT
  }
})


const carrinho = sequelize.define('carrinho', {

  foto: {
    type: DataTypes.TEXT
  },

  producto: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  categoria: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  qtd: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  preco: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  idCliente: {

    type: DataTypes.INTEGER

  },
  idProduto: {

    type: DataTypes.INTEGER
  }
})

const CodigoVerificacao = sequelize.define('CodigoVerificacao', {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  codigoHash: { type: DataTypes.STRING, allowNull: false },
  expiraEm: { type: DataTypes.DATE, allowNull: false },
  tentativas: { type: DataTypes.INTEGER, defaultValue: 0 }
})


const Venda = sequelize.define('Venda', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idCliente: { type: DataTypes.INTEGER, allowNull: false },
  total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  metodoPagamento: { type: DataTypes.STRING },
  estado: { type: DataTypes.STRING, defaultValue: 'pendente' }
});

const ItemVenda = sequelize.define('ItemVenda', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idVenda: { type: DataTypes.INTEGER, allowNull: false },
  idProduto: { type: DataTypes.INTEGER, allowNull: false },
  nomeProduto: { type: DataTypes.STRING, allowNull: false },
  precoUnitario: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  quantidade: { type: DataTypes.INTEGER, allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false }
});


const categoria = sequelize.define('categoria', {

  categoria: {
    
    type: DataTypes.TEXT

  }

})




Venda.hasMany(ItemVenda, { foreignKey: 'idVenda' });
ItemVenda.belongsTo(Venda, { foreignKey: 'idVenda' });



// associações
carrinho.belongsTo(clientes, { foreignKey: 'idCliente', as: 'clientes' })
carrinho.belongsTo(produtos, { foreignKey: 'idProduto', as: 'produtos' })

clientes.hasMany(carrinho, { foreignKey: 'idCliente', as: 'carrinhos' })
produtos.hasMany(carrinho, { foreignKey: 'idProduto', as: 'carrinhos' })
// Exportando todos os modelos e a conexão em um único objeto
module.exports = {
  sequelize,
  produtos,
  clientes,
  carrinho,
  CodigoVerificacao,
  Venda,
  ItemVenda,
  categoria
};