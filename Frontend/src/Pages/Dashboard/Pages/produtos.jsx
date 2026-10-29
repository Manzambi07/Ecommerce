import style from './category.module.css'

import { Edit, Trash, Search, X, } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Sms from '../../../sms/sms'
import erro from '../../../assets/error_48px.png'
import sucesso from '../../../assets/ok_48px.png'
import img from '../../../assets/male_user_24px.png'



// tira acentos e maiúsculas para a pesquisa ("jose" encontra "José")
const normalizar = (t = '') =>
  String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const iniciais = (nome = '') =>
  nome.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?'


export default function Produtos() {


  const PORT = 'http://localhost:3000'

  const foto = useRef(null)
  const product = useRef(null)
  const categ = useRef(null)
  const qtd = useRef(null)
  const preco = useRef(null)
  const descricao = useRef(null)



  const [produto, setUproduto] = useState([])
  const [carregandoLista, setCarregandoLista] = useState(true)
  const [mostar, setMostrar] = useState(true)
  const [busca, setBusca] = useState('')
  const [editando, setEditando] = useState(null)
  const [carregar, setCarregando] = useState(false)


  const [texto, setTexto] = useState(null)
  const [ativar, setAtivar] = useState(null)
  const [icon, setIcon] = useState(null)


  const cancelarEdicao = () => {
    setEditando(null)
    setMostrar(true)
  }


  const editarUsuario = (u) => {
    setEditando(u)
    setMostrar(false)

  }

  const [preview, setPreview] = useState(null)


  // liberta a pré-visualização antiga quando muda ou ao sair
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview) }
  }, [preview])


  const escolherFoto = (e) => {
    const ficheiro = e.target.files?.[0]
    setPreview(ficheiro ? URL.createObjectURL(ficheiro) : null)
  }

  const irAdicionar = () => setMostrar(false)
  const termo = normalizar(busca.trim())
  const filtrados = termo
    ? produto.filter((u) => normalizar(`${u.id} ${u.producto}`).includes(termo))
    : produto



  const saveEidt = async (e) => {


    e.preventDefault()

    setCarregando(true)

    try{

    const dados = {
      foto: foto.current.value,
      producto: product.current.value,
      categoria: categ.current.value,
      qtd: qtd.current.value,
      preco: preco.current.value,
      descricao: descricao.current.value
    }


        const resposta = await fetch(editando ? `${PORT}/editarProd/:${editando.id}` : `${PORT}/inserirProd`, {
        method: editando ? 'PUT' : 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(dados)

      })


      if (!resposta.ok) {
        const resultado = await resposta.json()
        throw new Error(resposta.erro || resposta.mensagem || 'erro na resposta do servidor')
      }


      setTexto(editando ? 'producto inserido com sucesso' : 'Registro alterado com sucesso'); setIcon(sucesso); setAtivar(true)
      setTimeout(() => setAtivar(false), 1300)

    }catch (error) {
      setTexto(error.message); setIcon(erro); setAtivar(true)
      setTimeout(() => setAtivar(false), 1300)
    }finally{
      setCarregando(false)
    }

  }





  const produtos = async () => {

    try {

      const resposta = await fetch('http://localhost:3000/ListarProductos')

      const resultado = await resposta.json()

      setUproduto(resultado)

    } catch (error) {

      setTexto(error.message); setIcon(erro); setAtivar(true)
      setTimeout(() => setAtivar(false), 1300)

    } finally {
      setCarregandoLista(false)
    }


  }
  useEffect(() => { produtos() }, [])

  const [category, setcategory] = useState([])

  const categorias = async () => {

    try {

      const resposta = await fetch('http://localhost:3000/ListarCategory')
      const resultado = await resposta.json()

      setcategory(resultado)
    } catch (error) {
      setTexto(error.message); setIcon(erro); setAtivar(true)
      setTimeout(() => setAtivar(false), 1300)
    } finally {
      setCarregandoLista(false)
    }


  }

  useEffect(() => { categorias() }, [])


  return (
    <>

      <form className={style.formulario} onSubmit={saveEidt} >

        <div className={style.menu} role="tablist">

          <button type="button" role="tab" aria-selected={mostar}
            className={mostar ? style.ativo : ''} onClick={() => setMostrar(true)}>
            Productos
          </button>

          <button type="button" role="tab" aria-selected={!mostar}
            className={!mostar ? style.ativo : ''} onClick={() => setMostrar(false)}>
            {editando ? 'Editar' : 'Adicionar'}
          </button>

        </div>

        {mostar === true && (

          <div className={`${style.tableLugar} ${style.painel}`}>

            <div className={style.barra}>

              <div className={style.pesquisa}>
                <Search size={18} className={style.pesquisaIcone} color='blue' />
                <input
                  id="pesquisar"
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
                  placeholder="Pesquisar por nome,ou ID"
                  aria-label="Pesquisar utilizadores"
                  autoComplete="off"
                />
                {busca && (
                  <button type="button" className={style.limpar}
                    onClick={() => setBusca('')} aria-label="Limpar pesquisa">
                    <X size={16} />
                  </button>
                )}
              </div>

              <span className={style.contador}>
                {termo
                  ? `${filtrados.length} de ${produto.length} Productos`
                  : `${produto.length} ${produto.length === 1 ? 'Productos' : 'Productos'}`}
              </span>

            </div>

            <div className={style.tabelaWrap}>
              <table className={style.table}>

                <thead>
                  <tr>
                    <th>ID</th> <th>foto</th>  <th>producto</th> <th>categoria</th> <th>qtd</th> <th>preco</th> <th>descricao</th> <th>Qr code</th>  <th>Ações</th>
                  </tr>
                </thead>

                <tbody>

                  {carregandoLista && (
                    <tr>
                      <td colSpan={5} className={style.vazio}>A carregar categorias...</td>
                    </tr>
                  )}

                  {!carregandoLista && filtrados.length === 0 && (
                    <tr>
                      <td colSpan={5} className={style.vazio}>
                        {termo ? (
                          <>
                            Nenhum resultado para “{busca}”.{' '}
                            <button type="button" className={style.linkBtn} onClick={() => setBusca('')}>
                              Limpar pesquisa
                            </button>
                          </>
                        ) : (
                          <>
                            Ainda não há categorias.{' '}
                            <button type="button" className={style.linkBtn} onClick={irAdicionar}>
                              Adicionar o primeiro
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )}

                  {!carregandoLista && filtrados.map((u) => (
                    <tr key={u.id}>

                      <td>{u.id}</td>
                      <td>{u.foto}</td>
                      <td >
                        <div className={style.nomeCelula}>
                          <span className={style.avatar}>{iniciais(u.producto)}</span>
                          {u.producto}
                        </div>
                      </td>

                      <td>{u.categoria}</td>
                      <td>{u.qtd}</td>
                      <td>{u.preco}</td>
                      <td>{u.descricao}</td>
                      <td></td>

                      <td>
                        <div className={style.acoes}>

                          <button type="button" className={`${style.iconBtn} ${style.editar}`}
                            onClick={() =>

                              editarUsuario(u)

                            } aria-label={`Editar ${u.id}`} title="Editar">
                            <Edit size={18} className={style.icon} color='blue' />
                          </button>

                          <button type="button" className={`${style.iconBtn} ${style.apagar}`}
                            aria-label={`Eliminar ${u.id}`} title="Eliminar" onClick={(e) => {
                              e.preventDefault()
                              eliminarCat(u)

                            }}>
                            <Trash size={18} className={style.icon} color='blue' />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>

        )
        }



        {mostar === false && (

          <div className={style.painel} key={editando?.id ?? 'novo'}>

            <div className={style.cabecalho}>
              <h2>{editando ? 'Editar productos' : 'Novo Productos'}</h2>
              <p>
                {editando
                  ? 'Altere só o que precisa '
                  : 'Preencha os dados para inserir Productos.'}
              </p>
            </div>


            <div className={style.img}>
              <img ref={foto} src={preview || img} alt="Pré-visualização da foto" />
              <div>
                <span className={style.rotuloFoto}>Foto</span>
                <label htmlFor="registro-foto" className={style.escolher}>
                  {preview ? 'Trocar imagem' : 'Escolher imagem'}
                </label>
                <input ref={foto} onChange={escolherFoto} id="registro-foto" type="file" accept="image/*" hidden />
              </div>
            </div>

            <div className={style.inputs}>
              <div className={style.largo}>
                <label htmlFor="reg-nome">Producto</label>
                <input id="reg-nome" ref={product} type="text" defaultValue={editando?.producto} autoComplete="name" required />
              </div>
              <div className={style.largo}>
                <label htmlFor="reg-nome">Categoria</label>
                <select ref={categ} defaultValue={editando?.categoria} value="categoria" required>

                <option value="" disabled>selecione...</option>

                  {category.map((c) =>
                  (
                    <option key={c.id} value={c.id}>{c.categoria}</option>
                  )
                  )}

                </select>

              </div>

              

              <div className={style.largo}>
                <label htmlFor="reg-nome">Qtd</label>
                <input id="reg-nome" ref={qtd} type="number" defaultValue={editando?.qtd} autoComplete="name" required />
              </div>
              <div className={style.largo}>
                <label htmlFor="reg-nome">Preço</label>
                <input id="reg-nome" ref={preco} type="text" defaultValue={editando?.preco} autoComplete="name" required />
              </div>
              <div className={style.largo}>
                <label htmlFor="reg-nome">Descrição</label>
                <input id="reg-nome" ref={descricao} type="text" defaultValue={editando?.descricao} autoComplete="name" required />
              </div>

            </div>

            <div className={style.btn}>
              {editando && (
                <button type="button" className={`${style.button} ${style.secundario}`} onClick={cancelarEdicao} disabled={carregar}>
                  Cancelar
                </button>
              )}
              <button className={style.button} disabled={carregar}>
                {carregar ? 'Aguarde por favor...' : editando ? 'Guardar alterações' : ' Adicionar productos'}
              </button>
            </div>


          </div>


        )

        }


      </form>
      <Sms mostar={ativar} icon={icon} texto={texto}></Sms>


    </>
  )



}