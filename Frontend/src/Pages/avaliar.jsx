import comprador from '../assets/comprador.JPG'
import style from './avaliar.module.css'
import { Star, Quote } from 'lucide-react'

export default function Avaliar(){

    const avaliacoes = [
        { nome: 'Nsessa Sebastião', email: 'nessa07@gmail.com', nota: 5, texto: '"Gostei dos productos da loja são de qualidade e recomendo o uso e aproposito é bom que comprem online antes de esgotar disfrutem , boa loja serviços de qualidade"' },
        { nome: 'Nsessa Sebastião', email: 'nessa07@gmail.com', nota: 4, texto: '"Gostei dos productos da loja são de qualidade e recomendo o uso e aproposito é bom que comprem online antes de esgotar disfrutem , boa loja serviços de qualidade"' },
        { nome: 'Nsessa Sebastião', email: 'nessa07@gmail.com', nota: 3, texto: '"Gostei dos productos da loja são de qualidade e recomendo o uso e aproposito é bom que comprem online antes de esgotar disfrutem , boa loja serviços de qualidade"' },
        { nome: 'Nsessa Sebastião', email: 'nessa07@gmail.com', nota: 5, texto: '"Gostei dos productos da loja são de qualidade e recomendo o uso e aproposito é bom que comprem online antes de esgotar disfrutem , boa loja serviços de qualidade"' },
    ]

    return(
        <>
            <div className={style.titulo}>
                <h1> Confira avaliações dos nossos clientes sem filtro nenhum </h1>
                <h1>A sua confiança é a nossa prioridade</h1>
                <button className={style.btn}>Avaliar</button>
            </div>

            <div className={style.div}>
                <div className={style.Avaliar}>

                    {
                        avaliacoes.map((av, index) => (
                            <div
                                className={style.container}
                                key={index}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <Quote className={style.aspas} size={28} />

                                <div className={style.estrelas}>
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <Star
                                            key={n}
                                            size={16}
                                            fill={n <= av.nota ? '#f5b700' : 'none'}
                                            color={n <= av.nota ? '#f5b700' : '#d0d0d0'}
                                        />
                                    ))}
                                </div>

                                <div className={style.sms}>
                                    <span>{av.texto}</span>
                                </div>

                                <div className={style.perfil}>
                                    <div>
                                        <img className={style.img} src={comprador} />
                                    </div>

                                    <div className={style.name}>
                                        <span>{av.nome}</span>
                                        <span style={{ color: 'dimgray' }}>{av.email}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                </div>
            </div>
        </>
    )
}