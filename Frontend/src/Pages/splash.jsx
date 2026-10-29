import { useEffect, useState } from 'react'
import box from '../assets/open_box_64px.png'
import style from './splash.module.css'


export default function Splash({ abrir }) {

    const [visivel, setVisivel] = useState(!!abrir)
    const [saindo, setSaindo] = useState(false)

    // ao fechar, deixa o desaparecer suave acontecer antes de remover do ecrã
    useEffect(() => {

        if (abrir) {
            setVisivel(true)
            setSaindo(false)
            return
        }

        setSaindo(true)
        const t = setTimeout(() => {
            setVisivel(false)
            setSaindo(false)
        }, 400)

        return () => clearTimeout(t)

    }, [abrir])


    if (!visivel) return null

    return (

        <>

            <div className={`${style.tela} ${saindo ? style.saindo : ''}`} role="status" aria-live="polite">

                <img src={box} className={style.box} alt="" />
                <h1> Carregando  productos... </h1>
                <div className={style.barra}></div>

            </div>
        </>
    )

}