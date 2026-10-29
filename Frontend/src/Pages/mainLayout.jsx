
import Footer from "../Components/footer";
import Header from "../Components/header";
import { Outlet } from "react-router-dom";
import style from '../App.module.css'
import Splash from './splash';
import { useState,useEffect } from "react";

export default function MainLayout(){

    const[local,setLocal]=useState(true)
    
 const timer= setTimeout(() => {
                setLocal(false)
    }, 2000);
    
   if(!local){

     return(
      
        <>

        <Header />
        <main className={style.principal}>
        <Outlet />
        </main>
        <Footer />

        </>
     )

   }  
    
    return (
        <>
        <Splash abrir={local}></Splash>
        </>
    )
}

