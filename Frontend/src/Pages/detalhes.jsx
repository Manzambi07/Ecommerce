import { X, Star } from 'lucide-react'
import style from './detalhes.module.css'

export default function Detalhes({ open, close, itens }) {

    if (!open) return null

    const nota = itens.nota || 3 // usa itens.nota se existir, senão mostra 3 como padrão

    return (
        <>
            <div key={itens.id} className={style.Container}>

                <div className={style.fechar}>
                    <span className={style.categoria}>{itens.categoria}</span>
                    <X className={style.iconeFechar} onClick={close} />
                </div>

                <div className={style.detalhes}>

                    <div className={style.img}>
                        <img src={itens.foto} />
                    </div>

                    <div className={style.textos}>

                        <div className={style.info}>

                            <span className={style.nomeProduto}>{itens.producto}</span>
                            <span className={style.preco}>Preço: {itens.preco} kz</span>
                            <span className={style.qtdDisponivel}>Quantidade disponível: {itens.qtd}</span>

                            <div className={style.estrelas}>
                                {[1, 2, 3, 4, 5].map(n => (
                                    <Star
                                        key={n}
                                        size={16}
                                        fill={n <= nota ? '#f5b700' : 'none'}
                                        color={n <= nota ? '#f5b700' : '#d0d0d0'}
                                    />
                                ))}
                            </div>

                            <span className={style.labelDescricao}>Descrição:</span>
                            <p className={style.descricao}>{itens.descricao}</p>

                        </div>

                        <div className={style.btn}>
                            <button>Adicionar ao carrinho</button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}