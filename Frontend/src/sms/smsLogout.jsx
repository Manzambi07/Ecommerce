import { useEffect, useState } from 'react'
import style from './smsLogout.module.css'


export default function SmsLogout({ mostar, icon, texto, input, value, fechar, tipo, duracao = 4000 }) {

    const [visivel, setVisivel] = useState(!!mostar)
    const [saindo, setSaindo] = useState(false)

    // ao esconder, deixa a animação de saída acontecer antes de remover do ecrã
    useEffect(() => {

        if (mostar) {
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

    }, [mostar])

    useEffect(() => {

        if (!mostar || !fechar) return

        const aoTecla = (e) => {
            if (e.key === 'Escape') fechar()
        }

        window.addEventListener('keydown', aoTecla)
        return () => window.removeEventListener('keydown', aoTecla)

    }, [mostar, fechar])


    if (!visivel) return null

    return (
        <>
            <div
                className={`${style.sms} ${tipo ? style[tipo] : ''} ${saindo ? style.saindo : ''}`}
                role="alertdialog"
                aria-live="assertive"
            >

                <div className={style.corpo}>
                    <img src={icon} alt="" />
                    <span>{texto}</span>
                </div>

                <div className={style.acoes}>

                    {fechar && (
                        <button type="button" className={style.cancelar} onClick={fechar}>Cancelar</button>
                    )}

                    <button type="button" className={style.btn} onClick={input}>{value}</button>

                </div>

                <div className={style['sms-progresso']} style={{ '--duracao': `${duracao}ms` }}></div>

            </div>
        </>
    )

}