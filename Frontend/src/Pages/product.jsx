import { useEffect, useState } from 'react'
import style from './product.module.css'
import Detalhes from './detalhes'
import erro from '../assets/error_48px.png'
import sucesso from '../assets/ok_48px.png'
import Sms from '../sms/sms'

function Product() {

  {/*listagem de productos*/ }

  const [itens, setItens] = useState([])
  const [abrir, setAbrir] = useState(false)
  const [selecionado, setSelecionar] = useState([])
  const [usuario, setUsuario] = useState([])


  const listToken = () => {

    const data = localStorage.getItem('user')
    if (data) {

      setUsuario(JSON.parse(data))

    }

  }


  useEffect(() => {listToken()}, [])




  useEffect(() => {

    const buscar = async () => {

      try {
        const resultado = await fetch("http://localhost:3000/ListarProductos")

        if (!resultado.ok) {

          throw new Error('erro ao listar produtos')
        }

        const date = await resultado.json();


        setItens(date)
        setAtivar(true);
        setIcon(sucesso);
        setTexto('Seja Bem-vindo');
        setTimeout(() => { setAtivar(false) }, 2000)


      } catch (error) {
        setAtivar(true);
        setIcon(sucesso);
        setTexto(error.message + 'Erro ao listar os Produtos');
        setTimeout(() => { setAtivar(false) }, 2000)

      }
    }

    buscar();
  }, [])


  {/*Chamada do token de usuarios */ }


  {/*Inserir productos ao carrinho*/ }

  const [texto, setTexto] = useState(null)
  const [ativar, setAtivar] = useState(null)
  const [icon, setIcon] = useState(null)
  const [carregando, setCarregando] = useState(false)



  const insertCart = async (e, produto) => {
    e.preventDefault()

    if (usuario === null || usuario.id === null) {
      setAtivar(true);
      setIcon(erro);
      setTexto('Faça login por favor se não possui uma conta registresse');
      setTimeout(() => { setAtivar(false) }, 1000)
      return
    }

    setCarregando(true)

    const dados = {
      foto: produto.foto,
      producto: produto.producto,
      categoria: produto.categoria,   
      qtd: produto.qtd,              
      preco: produto.preco,
      descricao: produto.descricao,
      idCliente: usuario.id,
      idProduto: produto.id
    }

    try {

      const resposta = await fetch('http://localhost:3000/apiCart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)

      })


      const resultado = await resposta.json()


      if (!resposta.ok) {
        throw new Error(resultado.sms || resultado.message || 'Erro de servidor')
      }

      setAtivar(true);
      setIcon(sucesso);
      setTexto(resultado.message || 'Producto adicionado ao carrinho');
      setTimeout(() => { setAtivar(false) }, 1000)

    } catch (error) {

      setAtivar(true);
      setIcon(erro);
      setTexto(error.message);
      setTimeout(() => { setAtivar(false) }, 2000)

    } finally {
      setCarregando(false)
    }
  }


  return (
    <>
      <div className={style.container}>

        {
          itens.map((produtos) => {

            return (

              <div key={produtos.id} className={style.produto}>
                <div className={style.img}>
                  <img src={produtos.foto} />
                </div>

                <div className={style.geral}>
                  <div className={style.textos}>

                    <span style={{ color: 'black', fontWeight: 700 }}>{produtos.producto}</span>
                    <span style={{ opacity: '0' }}>{produtos.descricao}</span>
                    <span className={style.preco}>{produtos.preco} kz</span>

                  </div>

                  <div className={style.btn}>

                    <button onClick={(e) => insertCart(e, produtos)} disabled={carregando}>
                      {carregando ? 'A adicionar...' : 'Adicionar ao Carrinho'}
                    </button>

                    <button onClick={() => {
                      setAbrir(true)
                      setSelecionar(produtos)
                    }}> Ver Detalhes</button>

                  </div>
                </div>
              </div>

            )

          })
        }

      </div>

      {itens && (<Detalhes open={abrir} close={() => {
        setAbrir(false)
      }} itens={selecionado}>
      </Detalhes>
      )}

      <Sms mostar={ativar} icon={icon} texto={texto}></Sms>

    </>

  )
}

export default Product
