
import style from '../Pages/Dashboard.module.css'
import { Bell } from 'lucide-react'

export default function PanelCima ({className}) {

    return(
        <>

             
             <div className={style.header + ' ' + (className || '')}>
               <div className={style.titulo}>
                 <h1>Open box</h1>
                 <p>Visão geral do seu negócio</p>
               </div>
             
               <button className={style.notificacao} aria-label="Notificações">
                 <Bell size={20}  color='blue'/>
                 <span className={style.badge}></span>
               </button>
             </div>

        </>
    )


}