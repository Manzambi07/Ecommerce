
import style from './header.module.css'
import open from '../assets/open_box_64px.png'
import Login from '../Pages/Login'
import Registro from '../Pages/Registro';
import { Search, Home, Info, MessageCircle, ShoppingCart, Menu, LogInIcon, User2, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import erro from '../assets/error_48px.png'
import Smslogout from '../sms/smsLogout'

function Header() {

  const [ModalOpen, setModalOpen] = useState(false)
  const [RegiOpen, setRegistro] = useState(false)
  const [texto, setTexto] = useState(null)
  const [ativar, setAtivar] = useState(null)
  const [icon, setIcon] = useState(null)
  const [txtbtn, setbtn] = useState(null)
  const [usuario, setUsuario] = useState(null)


  useEffect(() => {
    try {
      const dados = localStorage.getItem('user')
      if (dados) {

        setUsuario(JSON.parse(dados))

      }
    } catch (error) {
      console.log('erro de token ' + error.message)
    }
  }, [])



  try {

    const navigate = useNavigate()
    usuario.role === 'Admin' ? navigate('/Dashboard') :  null

  } catch (error) {

    console.log(error.message)

  }


  const logout = () => {

    localStorage.removeItem('token')
    localStorage.removeItem('user')
    location.reload();

  }

  const [itens, setItens] = useState([])
  const numero = itens.length


  useEffect(() => {
    if (!usuario) return  // espera o usuário carregar

    const buscar = async () => {
      try {
        const resposta = await fetch(`http://localhost:3000/ListarCart/${usuario.id}`)
        const resultado = await resposta.json()

        if (!resposta.ok) {
          throw new Error(resultado.mensagem || resultado.erro || 'Erro de servidor')
        }

        setItens(resultado)


      } catch (error) {
        alert('erro: ' + error.message)
      }
    }

    buscar()
  }, [usuario])
 

  const [menuAberto, setMenuAberto] = useState(false)
  const abrirMenu = () => setMenuAberto(prev => !prev)
  const fecharMenu = () => {
    const dentroDoIntervalo = window.matchMedia('(min-width: 300px) and (max-width: 700px)').matches
    if (dentroDoIntervalo) {
      setMenuAberto(false)
    }
  }

  
  return (
    <>
      <header>

<div className={`${style.fundo} ${menuAberto ? style.aberto : ''}`} onClick={() => setMenuAberto(false)}></div>
        <div className={style.logo}>
          <img src={open} />
        </div>

        <div className={`${style.Princ} ${menuAberto ? style.aberto : ''}`}>


          <nav className={style.nav}>
            <li > <NavLink className={style.links} to="/" end onClick={fecharMenu}> <Home className={style.icons} size={18} style={{ paddingRight: '4px' }} /> Pagina</NavLink></li>
            <li >  <a className={style.links} style={{ cursor: 'pointer' }} href='#rodape' onClick={fecharMenu}><Info className={style.icons} size={18} style={{ paddingRight: '4px' }} /> Rodape</a></li>
            <li > <NavLink className={style.links} to="/avaliar" onClick={fecharMenu}  >  <MessageCircle className={style.icons} size={18} style={{ paddingRight: '4px' }} /> Avaliações</NavLink></li>
          </nav>

          <div className={style.outros}>

            {usuario ? (

              <span onClick={() => {
                setAtivar(true); setTexto(' sair ?'); setIcon(erro);
                setbtn('Sair')

                setTimeout(() => {
                  setAtivar(false);

                }, 4000);
                fecharMenu()

              }} className={style.user}>
                <p style={{ color: 'white', cursor: 'pointer' }} ><LogOut size={18}></LogOut>sair</p>
              </span>


            ) : (
              <>
                <li>
                  <a className={style.links} style={{ cursor: "pointer" }} onClick={() => {
                    setModalOpen(true)
                    setRegistro(false)
                    fecharMenu()
                  }}><LogInIcon className={style.icons} size={18}></LogInIcon> Login</a>
                </li>

                <div className={style.eliminar}></div>

                <li>
                  <a style={{ cursor: 'pointer' }} className={style.links} onClick={() => {
                    setRegistro(true)
                    setModalOpen(false)
                    fecharMenu()
                  }}> <User2 className={style.icons} size={18}></User2> Criar Conta</a>
                </li>
              </>
            )}


          </div>



        </div>

        <aside>
          <Search></Search>
          <NavLink to="/carrinho">  <ShoppingCart size={22}> </ShoppingCart>  </NavLink>
          <span className={style.number}>{numero}</span>
          <Menu onClick={abrirMenu} className={style.menu}></Menu>
        </aside>



      </header>

      <Login isOpen={ModalOpen} onClose={() => {
        setModalOpen(false)
      }}></Login>


      <Registro ativo={RegiOpen} fechar={() => {
        setRegistro(false)
      }}> </Registro>

      <Smslogout mostar={ativar} icon={icon} texto={texto} input={logout} value={txtbtn}></Smslogout>

    </>

  )

}

export default Header