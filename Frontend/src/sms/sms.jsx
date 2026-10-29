import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import style from './sms.module.css'


export default function Sms({ mostar, icon, texto, tipo, fechar, duracao = 4000 }) {

    const [visivel, setVisivel] = useState(!!mostar)
    const [saindo, setSaindo] = useState(false)

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


    if (!visivel) return null

    return (
        <>
            <div
                className={`${style.sms} ${tipo ? style[tipo] : ''} ${saindo ? style.saindo : ''}`}
                role="status"
                aria-live="polite"
            >

                {icon && <img src={icon} alt="" />}
                <span>{texto}</span>

                {fechar && (
                    <button type="button" className={style.x} onClick={fechar} aria-label="Fechar">
                        <X size={16}></X>
                    </button>
                )}

                <div className={style['sms-progresso']} style={{ '--duracao': `${duracao}ms` }}></div>

            </div>
        </>
    )

}