import style from './User.module.css'
import { Edit, Trash, Eye, EyeOff, Search, X } from 'lucide-react'
import img from '../../../assets/male_user_24px.png'
import { useEffect, useState, useRef } from 'react'
import Sms from '../../../sms/sms'
import erro from '../../../assets/error_48px.png'
import sucesso from '../../../assets/ok_48px.png'

const EXIGIR_CODIGO = true
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
const ROTULOS_FORCA = ['', 'Fraca', 'Média', 'Boa', 'Forte']

export default function User() {

  const foto = useRef(null)
  const nome = useRef(null)
  const email = useRef(null)
  const morada = useRef(null)
  const  role = "Admin"

  const [usuario, setUsuario] = useState([])
  const [carregandoLista, setCarregandoLista] = useState(true)
  const [mostar, setMostrar] = useState(true)
  const [busca, setBusca] = useState('')
  const [editando, setEditando] = useState(null) // utilizador que está a ser editado
  const [senhasVisiveis, setSenhasVisiveis] = useState({})

  const [senhaC, setsenha] = useState('')
  const [confirmar, setconfirmar] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [carregar, setCarregar] = useState(false)

  const [texto, setTexto] = useState(null)
  const [ativar, setAtivar] = useState(null)
  const [icon, setIcon] = useState(null)

  const [preview, setPreview] = useState(null)

  const [codigo, setCodigo] = useState('')
  const [codigoEnviado, setCodigoEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const senhasDiferentes = confirmar !== '' && senhaC !== confirmar
  const precisaCodigo = EXIGIR_CODIGO && !editando // ao editar não pede código
  const forca = forcaSenha(senhaC)

  // mensagem (toast)
  const aviso = (msg, icone, ms = 3200) => {
    setTexto(msg); setIcon(icone); setAtivar(true)
    setTimeout(() => setAtivar(false), ms)
  }


  {/*listagem de usuarios*/ }

  const listar = async () => {
    setCarregandoLista(true)
    try {
      const resultado = await fetch(`${API}/ListarUser`, { method: 'GET' })
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
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview) }
  }, [preview])


  const escolherFoto = (e) => {
    const ficheiro = e.target.files?.[0]
    setPreview(ficheiro ? URL.createObjectURL(ficheiro) : null)
  }

  // se mudar o email depois de pedir o código, tem de pedir outro
  const aoMudarEmail = () => {
    if (codigoEnviado) {
      setCodigoEnviado(false)
      setCodigo('')
    }
  }

  const limparFormulario = () => {
    setsenha(''); setconfirmar(''); setCodigo('')
    setCodigoEnviado(false); setPreview(null); setVerSenha(false)
  }

  /* ---------- navegação entre abas / edição ---------- */

  const irListagem = () => {
    setMostrar(true)
    if (editando) { setEditando(null); limparFormulario() }
  }

  const irAdicionar = () => setMostrar(false)

  const editarUsuario = (u) => {
    limparFormulario()
    setEditando(u)
    setMostrar(false)
  }

  const cancelarEdicao = () => {
    setEditando(null)
    limparFormulario()
    setMostrar(true)
  }

  const alternarSenhaLinha = (id) =>
    setSenhasVisiveis((s) => ({ ...s, [id]: !s[id] }))


  const enviarCodigo = async () => {

    if (!email.current.value) {
      aviso('Digite o email primeiro', erro)
      return
    }

    setEnviando(true)

    try {
      const resposta = await fetch(`${API}/enviar-codigo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.current.value })
      })

      const resultado = await resposta.json()
      if (!resposta.ok) throw new Error(resultado.erro || 'Não foi possível enviar o código')

      setCodigoEnviado(true)
      aviso('Código enviado para o seu email', sucesso)

    } catch (error) {
      aviso(error.message, erro)
    } finally {
      setEnviando(false)
    }
  }


  // serve para cadastrar E para editar
  const salvarUser = async (e) => {

    e.preventDefault()

    if (senhaC !== confirmar) {
      aviso('As senhas não coincidem', erro)
      return
    }

    if (precisaCodigo && !codigoEnviado) {
      aviso('Peça o código de verificação primeiro', erro)
      return
    }

    setCarregar(true)

    const dados = {
      nome: nome.current.value,
      email: email.current.value,
      morada: morada.current.value,
      role :role
    }

    // ao editar, só envia foto/senha se mudaram
    if (!editando || foto.current.value) dados.foto = foto.current.value
    if (senhaC) dados.senha = senhaC
    if (precisaCodigo) dados.codigo = codigo

    try {

      const resposta = await fetch(
        editando ? `${API}/EditarUser/${editando.id}` : `${API}/InserirCliente`,
        {
          method: editando ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        }
      )

      if (!resposta.ok) {
        const r = await resposta.json().catch(() => ({}))
        throw new Error(r.erro || r.mensagem || 'erro na resposta do servidor')
      }

      aviso(editando ? 'Alterações guardadas' : 'Cliente inserido com sucesso', sucesso)

      setEditando(null)
      limparFormulario()
      setMostrar(true)
      listar()

    } catch (error) {

      aviso(error.message, erro, 4000)

    } finally {

      setCarregar(false)

    }
  }


  /* ---------- pesquisa ---------- */

  const termo = normalizar(busca.trim())
  const filtrados = termo
    ? usuario.filter((u) => normalizar(`${u.id} ${u.nome} ${u.email}`).includes(termo))
    : usuario
    


  return (
    <>
      <form className={style.formulario} onSubmit={salvarUser}>

        <div className={style.menu} role="tablist">

          <button type="button" role="tab" aria-selected={mostar}
            className={mostar ? style.ativo : ''} onClick={irListagem}>
            Usuarios
          </button>

          <button type="button" role="tab" aria-selected={!mostar}
            className={!mostar ? style.ativo : ''} onClick={irAdicionar}>
            {editando ? 'Editar' : 'Adicionar'}
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
                  ? `${filtrados.length} de ${usuario.length} utilizadores`
                  : `${usuario.length} ${usuario.length === 1 ? 'utilizador' : 'utilizadores'}`}
              </span>

            </div>

            <div className={style.tabelaWrap}>
              <table className={style.table}>

                <thead>
                  <tr>
                    <th>ID</th> <th>Nome</th> <th>Email</th> <th>Senha</th> <th>Ações</th>
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
                      <td>
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
                      <td>
                        <div className={style.acoes}>
                          <button type="button" className={`${style.iconBtn} ${style.editar}`}
                            onClick={() => editarUsuario(u)} aria-label={`Editar ${u.nome}`} title="Editar">
                            <Edit size={18} className={style.icon} color='blue' />
                          </button>
                          <button type="button" className={`${style.iconBtn} ${style.apagar}`}
                            aria-label={`Eliminar ${u.nome}`} title="Eliminar">
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
              <h2>{editando ? 'Editar utilizador' : 'Novo utilizador'}</h2>
              <p>
                {editando
                  ? 'Altere só o que precisa. Deixe a senha em branco para manter a atual.'
                  : 'Preencha os dados para criar a conta.'}
              </p>
            </div>

            <div className={style.img}>
              <img src={preview || img} alt="Pré-visualização da foto" />
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
                <label htmlFor="reg-nome">Nome</label>
                <input id="reg-nome" ref={nome} defaultValue={editando?.nome} type="text" autoComplete="name" required />
              </div>

              <div className={style.largo}>
                <label htmlFor="reg-email">Email</label>
                <div className={style.linhaAcao}>
                  <input id="reg-email" ref={email} defaultValue={editando?.email} onChange={aoMudarEmail} type="email" autoComplete="email" required />
                  {precisaCodigo && (
                    <button type="button" className={style.acao} onClick={enviarCodigo} disabled={enviando}>
                      {enviando ? 'Enviando...' : codigoEnviado ? 'Reenviar' : 'Enviar código'}
                    </button>
                  )}
                </div>
              </div>

              {precisaCodigo && codigoEnviado && (
                <div className={style.largo}>
                  <label htmlFor="reg-codigo">Código recebido no email</label>
                  <input id="reg-codigo" type="text" inputMode="numeric" maxLength={6} placeholder="6 dígitos" value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))} required />
                </div>
              )}

              <div>
                <label htmlFor="reg-senha">{editando ? 'Nova senha (opcional)' : 'Senha'}</label>
                <div className={style.senhaBox}>
                  <input id="reg-senha" value={senhaC} onChange={(e) => setsenha(e.target.value)} type={verSenha ? 'text' : 'password'} autoComplete="new-password" required={!editando} />
                  <button type="button" className={style.olho} onClick={() => setVerSenha(v => !v)} aria-label={verSenha ? 'Esconder senhas' : 'Mostrar senhas'}>
                    {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {senhaC && (
                  <div className={style.forca} data-nivel={forca}>
                    <div className={style.forcaBarras}><span /><span /><span /><span /></div>
                    <small>{ROTULOS_FORCA[forca] || 'Muito fraca'}</small>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="reg-confirmar">Confirmar Senha</label>
                <input id="reg-confirmar" type={verSenha ? 'text' : 'password'} value={confirmar} onChange={(e) => setconfirmar(e.target.value)} autoComplete="new-password" aria-invalid={senhasDiferentes} required={!editando || senhaC !== ''} />
                {senhasDiferentes && <span className={style.erroCampo}>As senhas não coincidem</span>}
              </div>

              <div className={style.largo}>
                <label htmlFor="reg-morada">Morada</label>
                <input id="reg-morada" ref={morada} defaultValue={editando?.morada} type="text" autoComplete="street-address" required />
              </div>


              <div className={style.btn}>
                {editando && (
                  <button type="button" className={`${style.button} ${style.secundario}`} onClick={cancelarEdicao} disabled={carregar}>
                    Cancelar
                  </button>
                )}
                <button className={style.button} disabled={carregar}>
                  {carregar ? 'Aguarde por favor...' : editando ? 'Guardar alterações' : 'Criar utilizador'}
                </button>
              </div>

            </div>

          </div>

        )

        }


      </form>
      <Sms mostar={ativar} icon={icon} texto={texto}></Sms>

    </>


  )



}