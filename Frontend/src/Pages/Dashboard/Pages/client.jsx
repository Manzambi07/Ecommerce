import style from './User.module.css'
import { Edit, Trash, Eye, EyeOff, Search, X } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import Sms from '../../../sms/sms'


const API = 'http://localhost:3000'

// tira acentos e maiúsculas para a pesquisa ("jose" encontra "José")
const normalizar = (t = '') =>
  String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const iniciais = (nome = '') =>
  nome.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?'

// 0 a 4 pontos
const forcaSenha = (s) => {
  let p = 0
  if (s.length >= 8) p++
  if (/[A-Z]/.test(s)) p++
  if (/\d/.test(s)) p++
  if (/[^A-Za-z0-9]/.test(s)) p++
  return p
}

export default function client() {



  const [usuario, setUsuario] = useState([])
  const [carregandoLista, setCarregandoLista] = useState(true)
  const [mostar, setMostrar] = useState(true)
  const [busca, setBusca] = useState('')
  const [editando, setEditando] = useState(null) // utilizador que está a ser editado
  const [senhasVisiveis, setSenhasVisiveis] = useState({})

  
  const [texto, setTexto] = useState(null)
  const [ativar, setAtivar] = useState(null)
  const [icon, setIcon] = useState(null)


  // mensagem (toast)
  const aviso = (msg, icone, ms = 3200) => {
    setTexto(msg); setIcon(icone); setAtivar(true)
    setTimeout(() => setAtivar(false), ms)
  }


  {/*listagem de usuarios*/ }

  const listar = async () => {
    setCarregandoLista(true)
    try {
      const resultado = await fetch(`${API}/listarClient`, { method: 'GET' })
      if (!resultado.ok) throw new Error('Erro de Servidor')
      setUsuario(await resultado.json())
    } catch (error) {
      console.log(error.message)
    } finally {
      setCarregandoLista(false)
    }
  }

  useEffect(() => { listar() }, [])


  // liberta a pré-visualização antiga quando muda ou ao sair
  


  /* ---------- navegação entre abas / edição ---------- */

  const irListagem = () => {
    setMostrar(true)
    if (editando) { setEditando(null); limparFormulario() }
  }

  const irAdicionar = () => setMostrar(false)



  const alternarSenhaLinha = (id) =>
    setSenhasVisiveis((s) => ({ ...s, [id]: !s[id] }))





  // serve para cadastrar E para editar


  /* ---------- pesquisa ---------- */

  const termo = normalizar(busca.trim())
  const filtrados = termo
    ? usuario.filter((u) => normalizar(`${u.id} ${u.nome} ${u.email}`).includes(termo))
    : usuario


  return (
    <>
      <form className={style.formulario} >

        <div className={style.menu} role="tablist">

          <button type="button" role="tab" aria-selected={mostar}
            className={mostar ? style.ativo : ''} onClick={irListagem}>
            Clientes
          </button>

         

        </div>

        {mostar === true && (

          <div className={`${style.tableLugar} ${style.painel}`}>

            <div className={style.barra}>

              <div className={style.pesquisa}>
                <Search size={18} className={style.pesquisaIcone}  color='blue'/>
                <input
                  id="pesquisar"
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
                  placeholder="Pesquisar por nome, email ou ID"
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
                  ? `${filtrados.length} de ${usuario.length} Clientes`
                  : `${usuario.length} ${usuario.length === 1 ? 'Cliente' : 'Clientes'}`}
              </span>

            </div>

            <div className={style.tabelaWrap}>
              <table className={style.table}>

                <thead>
                  <tr>
                    <th>ID</th> <th>Nome</th> <th>Email</th> <th>Senha</th>  <th>Morada</th> 
                  </tr>
                </thead>

                <tbody>

                  {carregandoLista && (
                    <tr>
                      <td colSpan={5} className={style.vazio}>A carregar utilizadores...</td>
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
                            Ainda não há utilizadores.{' '}
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
                      <td >
                        <div className={style.nomeCelula}>
                          <span className={style.avatar}>{iniciais(u.nome)}</span>
                          {u.nome}
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <div className={style.senhaCelula}>
                          <span className={style.senhaTexto}>
                            {senhasVisiveis[u.id] ? u.senha : '••••••••'}
                          </span>
                          <button type="button" className={style.iconBtn}
                            onClick={() => alternarSenhaLinha(u.id)}
                            aria-label={senhasVisiveis[u.id] ? 'Esconder senha' : 'Mostrar senha'}>
                            {senhasVisiveis[u.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </td>
                        <td>{u.morada}</td>
                     
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>

        )
        }


      </form>
      <Sms mostar={ativar} icon={icon} texto={texto}></Sms>

    </>


  )



}