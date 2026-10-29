
import style from './not.module.css'

export default function NotAfound(){


    return(

         <div className={style.principal}>

          <div>
          <span style={{color:'blue',fontSize:"20px"}}>404</span>
          <h1 style={{fontSize:"70px"}}>Page not found</h1>
          <span style={{color:"dimgray"}}>Sinto muito,tente novamente pagina nao encotrada</span>
          </div>

         </div>
        
    )


}