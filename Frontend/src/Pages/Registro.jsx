import style from './Registro.module.css'
import { X, Eye, EyeOff } from 'lucide-react'
import img from '../assets/male_user_24px.png'
import erro from '../assets/error_48px.png'
import sucesso from '../assets/ok_48px.png'
import { useEffect, useRef, useState } from 'react'
import Sms from '../sms/sms'




const EXIGIR_CODIGO = true

export default function Registro({ ativo, fechar }) {

    const foto = useRef(null)
    const nome = useRef(null)
    const email = useRef(null)
    const senha = useRef(null)
    const morada = useRef(null)

    const [carregar, setCarregar] = useState(false)
    const [carregando, setCarregando] = useState(false)
    const [texto, setTexto] = useState(null)
    const [ativar, setAtivar] = useState(null)
    const [icon, setIcon] = useState(null)

    const [senhaC, setsenha] = useState('')
    const [confirmar, setconfirmar] = useState('')
    const [verSenha, setVerSenha] = useState(false)

    const [preview, setPreview] = useState(null)

    const [codigo, setCodigo] = useState('')
    const [codigoEnviado, setCodigoEnviado] = useState(false)
    const [enviando, setEnviando] = useState(false)

    const senhasDiferentes = confirmar !== '' && senhaC !== confirmar


    // tecla Esc fecha o registo
    useEffect(() => {

        if (!ativo) return

        const aoTecla = (e) => {
            if (e.key === 'Escape') fechar()
        }

        window.addEventListener('keydown', aoTecla)
        return () => window.removeEventListener('keydown', aoTecla)

    }, [ativo, fechar])


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


    const enviarCodigo = async () => {

        if (!email.current.value) {
            setTexto('Digite o email primeiro'); setAtivar(true); setIcon(erro)
            setTimeout(() => setAtivar(false), 3200)
            return
        }

        setEnviando(true)

        try {
            const resposta = await fetch("http://localhost:3000/enviar-codigo", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.current.value })
            })

            const resultado = await resposta.json()
            if (!resposta.ok) throw new Error(resultado.erro || 'Não foi possível enviar o código')

            setCodigoEnviado(true)
            setTexto('Código enviado para o seu email'); setAtivar(true); setIcon(sucesso)

        } catch (error) {
            setTexto(error.message); setAtivar(true); setIcon(erro)
        } finally {
            setEnviando(false)
            setTimeout(() => setAtivar(false), 3200)
        }
    }


    const cadastroUser = async (e) => {

        e.preventDefault();

        if (senhaC !== confirmar) {

            setTexto('senhas confirmada diferente da original'); setAtivar(true); setIcon(erro)
            setTimeout(() => {
                setAtivar(false)
            }, 3200)
            return;
        }

        if (EXIGIR_CODIGO && !codigoEnviado) {

            setTexto('Peça o código de verificação primeiro'); setAtivar(true); setIcon(erro)
            setTimeout(() => {
                setAtivar(false)
            }, 3200)
            return;
        }

        setCarregar(true)
        setCarregando(true)


        const dados = {

            foto: foto.current.value,
            nome: nome.current.value,
            email: email.current.value,
            senha: senha.current.value,
            morada: morada.current.value

        }

        if (EXIGIR_CODIGO) dados.codigo = codigo

        try {

            const resposta = await fetch("http://localhost:3000/InserirCliente", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)

            })

            if (!resposta.ok) {

                const r = await resposta.json().catch(() => ({}))
                throw new Error(r.erro || r.mensagem || 'erro na resposta do servidor')

            }

            setTexto('Cliente inserido com sucesso'); setAtivar(true); setIcon(sucesso)
            setTimeout(() => location.reload(), 4000)

        } catch (error) {

            setTexto(error.message); setAtivar(true); setIcon(erro)
            setTimeout(() => {
                setAtivar(false)
            }, 4000)


        } finally {

            setCarregar(false)
            setCarregando(false)

        }



    }

   


    if (!ativo) return null

    return (
        <>

            <div className={style.fundo}>

                <form className={style.container} onSubmit={cadastroUser}>

                    <div className={style.fechar}>
                        <span className={style.tituloBarra}>Criar conta</span>
                        <button type="button" className={style.x} onClick={fechar} aria-label="Fechar">
                            <X size={20} color="white"></X>
                        </button>
                    </div>

                    <div className={style.progressBarContainer}>
                        {carregando && <div className={style.progressBar}></div>}
                    </div>


                    <div className={style.img}>
                        <img src={preview || img} alt="Pré-visualização da foto" />
                        <div>
                            <span className={style.rotuloFoto}>Foto</span>
                            <label htmlFor="registro-foto" className={style.escolher}>Escolher imagem</label>
                            <input ref={foto} onChange={escolherFoto} id="registro-foto" type="file" accept="image/*" hidden />
                        </div>
                    </div>

                    <div className={style.inputs}>

                        <div className={style.largo}>
                            <label htmlFor="reg-nome">Nome</label>
                            <input id="reg-nome" ref={nome} type="text" autoComplete="name" required />
                        </div>

                        <div className={style.largo}>
                            <label htmlFor="reg-email">Email</label>
                            <div className={style.linhaAcao}>
                                <input id="reg-email" ref={email} onChange={aoMudarEmail} type="email" autoComplete="email" required />
                                {EXIGIR_CODIGO && (
                                    <button type="button" className={style.acao} onClick={enviarCodigo} disabled={enviando}>
                                        {enviando ? 'Enviando...' : codigoEnviado ? 'Reenviar' : 'Enviar código'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {EXIGIR_CODIGO && codigoEnviado && (
                            <div className={style.largo}>
                                <label htmlFor="reg-codigo">Código recebido no email</label>
                                <input id="reg-codigo" type="text" inputMode="numeric" maxLength={6} placeholder="6 dígitos" value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))} required />
                            </div>
                        )}

                        <div>
                            <label htmlFor="reg-senha">Senha</label>
                            <div className={style.senhaBox}>
                                <input id="reg-senha" ref={senha} value={senhaC} onChange={(e) => setsenha(e.target.value)} type={verSenha ? 'text' : 'password'} autoComplete="new-password" required />
                                <button type="button" className={style.olho} onClick={() => setVerSenha(v => !v)} aria-label={verSenha ? 'Esconder senhas' : 'Mostrar senhas'}>
                                    {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="reg-confirmar">Confirmar Senha</label>
                            <input id="reg-confirmar" type={verSenha ? 'text' : 'password'} value={confirmar} onChange={(e) => setconfirmar(e.target.value)} autoComplete="new-password" required />
                            {senhasDiferentes && <span className={style.erroCampo}>As senhas não coincidem</span>}
                        </div>

                        <div className={style.largo}>
                            <label htmlFor="reg-morada">Morada</label>
                            <input id="reg-morada" ref={morada} type="text" autoComplete="street-address" required />
                        </div>


                        <div className={style.btn}>
                            <button className={style.button} disabled={carregar}>{carregar ? 'Aguarde por favor...' : 'Enviar'}

                            </button>
                        </div>

                    </div>

                </form>

                <Sms mostar={ativar} icon={icon} texto={texto}></Sms>

            </div>

        </>
    )


}