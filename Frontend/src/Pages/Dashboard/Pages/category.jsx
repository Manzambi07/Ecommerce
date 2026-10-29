import style from './category.module.css'

import { Edit, Trash, Search, X, } from 'lucide-react'
import { useRef, useState } from 'react'
import Sms from '../../../sms/sms'
import erro from '../../../assets/error_48px.png'
import sucesso from '../../../assets/ok_48px.png'
import { useEffect } from 'react'


const API = 'http://localhost:3000'



// tira acentos e maiúsculas para a pesquisa ("jose" encontra "José")
const normalizar = (t = '') =>
  String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const iniciais = (nome = '') =>
  nome.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?'



export default function Category() {

  const [usuario, setUsuario] = useState([])
  const [carregandoLista, setCarregandoLista] = useState(true)
  const [mostar, setMostrar] = useState(true)
  const [busca, setBusca] = useState('')
  const [editando, setEditando] = useState(null)
  const categoria = useRef(null)
  const [carregar, setCarregando] = useState(false)


  const [texto, setTexto] = useState(null)
  const [ativar, setAtivar] = useState(null)
  const [icon, setIcon] = useState(null)

  const termo = normalizar(busca.trim())
  const filtrados = termo
    ? usuario.filter((u) => normalizar(`${u.id} ${u.categoria}`).includes(termo))
    : usuario

  const irAdicionar = () => setMostrar(false)

  // mensagem (toast)
  const aviso = (msg, icone, ms = 3200) => {
    setTexto(msg); setIcon(icone); setAtivar(true)
    setTimeout(() => setAtivar(false), ms)
  }

  const categorias = async () => {

    try {

      const resposta = await fetch('http://localhost:3000/ListarCategory')

      const resultado = await resposta.json()

      setUsuario(resultado)
      console.log(usuario)

    } catch (error) {

      setTexto(error.message); setIcon(erro); setAtivar(true)
      setTimeout(() => setAtivar(false), 1300)

    } finally {
      setCarregandoLista(false)
    }


  }

  useEffect(() => { categorias() }, [])

  const editarUsuario = (u) => {
    setEditando(u)
    setMostrar(false)

  }

  const cancelarEdicao = () => {
    setEditando(null)
    setMostrar(true)
  }


  const salvarUser = async (e) => {

    e.preventDefault()

    setCarregando(true)

    const dados = {
      categoria: categoria.current.value,
    }

    try {

      const resposta = await fetch(editando ? `${API}/EditarCategoria/${editando.id}` : `${API}/categInserir`, {
        method: editando ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      }
      )

      if (!resposta.ok) {
        const r = await resposta.json().catch(() => ({}))
        throw new Error(r.erro || r.mensagem || 'erro na resposta do servidor')
      }

      aviso(editando ? 'Alterações guardadas' : 'categoria inserida com sucesso', sucesso)

      setEditando(null)
      setMostrar(true)
      categorias()

    } catch (error) {

      aviso(error.message, erro, 4000)

    } finally {

      setCarregando(false)

    }
  }


  const eliminarCat = async (u) => {

    try {

      const resposta = await fetch(`http://localhost:3000/eliminarCat/${u.id}`, {

        method: 'DELETE',
        headers: { 'Content-Type': 'Application/json' }
      })

      if (!resposta.ok) {

        const r = await resposta.json().catch(() => ({}))
        throw new Error(r.erro || r.mensagem || 'erro na resposta do servidor')
      }



      setTexto('Registro eliminado')
      setAtivar(true)
      setIcon(erro)



      setTimeout(() => {
        setAtivar(false)
        location.reload()
      }, 2000)



    } catch (error) {

      setTexto('Erro ao eliminar registro  ' + error.message)
      setAtivar(true)
      setIcon(erro)

      setTimeout(() => {
        setAtivar(false)
      }, 2000)


    }



  }


  return (
    <>

      <form className={style.formulario} onSubmit={salvarUser}>

        <div className={style.menu} role="tablist">

          <button type="button" role="tab" aria-selected={mostar}
            className={mostar ? style.ativo : ''} onClick={() => setMostrar(true)}>
            Categoria
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
                  ? `${filtrados.length} de ${usuario.length} Categorias`
                  : `${usuario.length} ${usuario.length === 1 ? 'Categorias' : 'Categorias'}`}
              </span>

            </div>

            <div className={style.tabelaWrap}>
              <table className={style.table}>

                <thead>
                  <tr>
                    <th>ID</th> <th>Categoria</th>  <th>Ações</th>
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
                      <td>
                        <div className={style.nomeCelula}>
                          <span className={style.avatar}>{iniciais(u.categoria)}</span>
                          {u.categoria}
                        </div>
                      </td>

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
              <h2>{editando ? 'Editar Categoria' : 'Nova Categoria'}</h2>
              <p>
                {editando
                  ? 'Altere só o que precisa '
                  : 'Preencha os dados para inserir categoria.'}
              </p>
            </div>

            <div className={style.inputs}>
              <div className={style.largo}>
                <label htmlFor="reg-nome">Categoria</label>
                <input id="reg-nome" ref={categoria} type="text" defaultValue={editando?.categoria} autoComplete="name" required />
              </div>
            </div>

            <div className={style.btn}>
              {editando && (
                <button type="button" className={`${style.button} ${style.secundario}`} onClick={cancelarEdicao} disabled={carregar}>
                  Cancelar
                </button>
              )}
              <button className={style.button} disabled={carregar}>
                {carregar ? 'Aguarde por favor...' : editando ? 'Guardar alterações' : ' Adicionar categoria'}
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