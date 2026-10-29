import style from './Login.module.css'
import { X, Eye, EyeOff } from 'lucide-react'
import open from '../assets/open_box_64px.png'
import erro from '../assets/error_48px.png'
import sucesso from '../assets/ok_48px.png'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sms from '../sms/sms'

export default function Login({ isOpen, onClose }) {

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [verSenha, setVerSenha] = useState(false)
    const [carregar, setCaregando] = useState(false)

    const navigate = useNavigate();

    const [texto, setTexto] = useState(null)
    const [ativar, setAtivar] = useState(null)
    const [icon, setIcon] = useState(null)


    // tecla Esc fecha o login
    useEffect(() => {

        if (!isOpen) return

        const aoTecla = (e) => {
            if (e.key === 'Escape') onClose()
        }

        window.addEventListener('keydown', aoTecla)
        return () => window.removeEventListener('keydown', aoTecla)

    }, [isOpen, onClose])


    const login = async (e) => {

        e.preventDefault()
        setCaregando(true)
        try {
            const resposta = await fetch('http://localhost:3000/api/login', {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            })

            const data = await resposta.json();

            if (!resposta.ok) {

                setTexto(data.message || 'Credencias incorretos por favor verifique a senha ou Email'); setAtivar(true); setIcon(erro)
                setTimeout(() => {
                    setAtivar(false)
                }, 4000)
                return;

            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.usuario))

            if (data.usuario.role === 'Admin') {

                onClose()
                navigate('/Dashboard')
                setTexto('Login com sucesso Administrador'); setAtivar(true); setIcon(sucesso)

            } else {

                navigate('/')
                setTexto('Login com sucesso'); setAtivar(true); setIcon(sucesso)

                setTimeout(() => {
                    window.location.reload();
                }, 2000);

            }

        } catch (error) {

            setTexto(error.message || 'Nao foi possivel conectar ao serviodr'); setAtivar(true); setIcon(erro)

            setTimeout(() => {
                setAtivar(false)
            }, 4000)

        } finally {

            setCaregando(false)

        }

    }



    if (!isOpen) return null;

    return (

        <>

            {/* clicar fora do cartão fecha o login */}
            <div className={style.fundo} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>

                <form className={style.login} onSubmit={login}>

                    <div className={style.topo}>
                        <button type="button" className={style.fechar} onClick={onClose} aria-label="Fechar">
                            <X size={20} color='blue'></X>
                        </button>
                    </div>

                    <div className={style.Titulo}>
                        <img src={open} alt="logo" />
                    </div>

                    <h2 className={style.titulo2}>Entrar na sua conta</h2>

                    <div className={style.Credencias}>

                        <div className={style.campo}>
                            <label htmlFor="login-email">Email</label>
                            <input id="login-email" className={style.input} value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Digite o email' autoComplete="email" autoFocus required />
                        </div>

                        <div className={style.campo}>
                            <label htmlFor="login-senha">Senha</label>
                            <div className={style.senhaBox}>
                                <input id="login-senha" className={style.input} value={senha} type={verSenha ? 'text' : 'password'} onChange={(e) => setSenha(e.target.value)} placeholder='Digite a senha' autoComplete="current-password" required />
                                <button type="button" className={style.olho} onClick={() => setVerSenha(v => !v)} aria-label={verSenha ? 'Esconder senha' : 'Mostrar senha'}>
                                    {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className={style.submter}>
                        <button type="submit" disabled={carregar}>
                            {carregar ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>

                    <div className={style.recuperar}>
                        <button type="button" onClick={onClose}>Recuperar Senha</button>
                    </div>

                </form>

                <Sms mostar={ativar} icon={icon} texto={texto}></Sms>

            </div>

        </>



    )



}