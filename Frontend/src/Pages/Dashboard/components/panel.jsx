import { NavLink } from 'react-router-dom'
import style from './panel.module.css'
import img from '../assets/comprador.JPG'
import logo from '../assets/open_box_64px.png'
import { Barcode, ChartArea, CheckCircle, CircleChevronLeft, LayoutDashboard, LogOut, MenuIcon, PieChart, User, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

// ajuste o "to" de cada item para as rotas que tem no seu App
const itens = [
    { nome: 'Dashboard', to: '/Dashboard', Icone: LayoutDashboard },
    { nome: 'Usuarios', to: '/Usuarios', Icone: User },
    { nome: 'Clientes', to: '/Clientes', Icone:Users },
    { nome: 'Categorias', to: '/Categorias', Icone: MenuIcon },
    { nome: 'Productos', to: '/Productos', Icone:Barcode},
    { nome: 'Reservas', to: '/Vendas', Icone: PieChart },
    { nome: 'Avaliações', to: '/Avaliacoes', Icone: CheckCircle },
    { nome: 'Relatorios', to: '/Relatorios', Icone: ChartArea },
]

export default function Panel({className}) {

    const [reduzido, setReduzido] = useState(() => {

        try {
            const guardado = localStorage.getItem('panelReduzido')
            if (guardado !== null) return guardado === '1'
        } catch (error) { /* sem acesso ao localStorage */ }
        return window.innerWidth <= 700

    })

    const [usuario] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user'))
        } catch (error) {
            return null
        }
    })

    // avisa o resto da página da largura atual do painel
    useEffect(() => {

        document.documentElement.style.setProperty('--panel-largura', reduzido ? '70px' : '270px')

        try {
            localStorage.setItem('panelReduzido', reduzido ? '1' : '0')
        } catch (error) { /* sem acesso ao localStorage */ }

        return () => document.documentElement.style.removeProperty('--panel-largura')

    }, [reduzido])


    const sair = () => {

        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/'

    }


    return (
        <>

            <div className={`${style.panel} ${reduzido ? style.panel2 : ''} ${className || ''}`}>
                <button
                    type="button"
                    className={style.btn}
                    onClick={() => setReduzido(r => !r)}
                    aria-label={reduzido ? 'Expandir menu' : 'Reduzir menu'}
                    aria-expanded={!reduzido}
                >
                    <CircleChevronLeft size={24}></CircleChevronLeft>
                </button>

                <div className={style.logo}>
                    <img src={logo} alt="logo" />
                </div>

                <nav className={style.itensLink}>

                    {itens.map(({ nome, to, Icone }) => (

                        <NavLink
                            key={to}
                            to={to}
                            data-tip={nome}
                            className={({ isActive }) => `${style.links} ${isActive ? style.ativo : ''}`}
                        >
                            <Icone size={20} className={style.icone} />
                            <span className={style.link}>{nome}</span>
                        </NavLink>

                    ))}

                </nav>

                <div className={style.logout}>

                    <img src={img} alt="Perfil" />

                    <div className={style.perfil}>
                        <span>{usuario?.nome || ''}</span>
                        {usuario?.role && <small>{usuario.role}</small>}
                    </div>

                    <button type="button" className={style.sair} onClick={sair} aria-label="Sair" data-tip="Sair">
                        <LogOut size={18}></LogOut>
                    </button>

                </div>

            </div>
        </>
    )
}