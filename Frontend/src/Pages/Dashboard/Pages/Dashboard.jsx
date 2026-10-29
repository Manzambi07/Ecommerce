import style from './Dashboard.module.css'
import { Bell, DollarSign, Tags, Users, Package } from 'lucide-react'
import GraficoVendas from './GraficoVendas'
import { useEffect, useState } from 'react'
import Sms from '../../../sms/sms'
import erro from '../../../assets/error_48px.png'
export default function Dashborad() {


  const [categ, setcateg] = useState([])
  const [texto, setTexto] = useState(null)
  const [ativar, setAtivar] = useState(null)
  const [icon, setIcon] = useState(null)



  const categorias = async () => {
    try {
      const resposta = await fetch('http://localhost:3000/ListarCategory')
      const resultado = await resposta.json()
      setcateg(resultado)
    } catch (error) {
      setTexto(error.message); setIcon(erro); setAtivar(true)
      setTimeout(() => setAtivar(false), 1300)
    }
  }
  useEffect(() => { categorias() }, [])


  const[cliente,setclient] = useState([])



  const clientes = async () => {
    try {
      const resposta = await fetch('http://localhost:3000/listarClient')
      const resultado = await resposta.json()
      setclient(resultado)
    } catch (error) {
      setTexto(error.message); setIcon(erro); setAtivar(true)
      setTimeout(() => setAtivar(false), 1300)
    }
  }
  useEffect(() => { clientes() }, [])


  const[prod,setProd] = useState([])

    const produtos = async () => {
    try {
      const resposta = await fetch('http://localhost:3000/ListarProductos')
      const resultado = await resposta.json()
      setProd(resultado)
    } catch (error) {
      setTexto(error.message); setIcon(erro); setAtivar(true)
      setTimeout(() => setAtivar(false), 1300)
    }
  }
  useEffect(() => { produtos() }, [])




  
  const itens = [
    { icon: <DollarSign size={22} color='#3b5bdb' />, descricao: 'Vendas', total: '20.000kz' },
    { icon: <Tags size={22} color='#3b5bdb' />, descricao: 'Categorias', total:categ.length },
    { icon: <Users size={22} color='#3b5bdb' />, descricao: 'Clientes', total: cliente.length },
    { icon: <Package size={22} color='#3b5bdb' />, descricao: 'Produtos', total:prod.length }
  ]
  return (
    <>
      <div className={style.container}>


        <div className={style.Cards}>
          {itens.map(({ icon, descricao, total }) => (
            <div key={descricao} className={style.card}>
              <div className={style.icon} style={{ gridArea: 'i' }}>{icon}</div>
              <div style={{ gridArea: 'd' }}><span>{descricao}</span></div>
              <div style={{ gridArea: 't' }}><span>{total}</span></div>
            </div>
          ))}
        </div>

        <div className={style.Graficos}>

          <GraficoVendas></GraficoVendas>

        </div>
        <div className={style.acesso}></div>


      </div>

      <Sms mostar={ativar} icon={icon} texto={texto}></Sms>

    </>
  )
}