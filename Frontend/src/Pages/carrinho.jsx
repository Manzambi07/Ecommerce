import style from './carrinho.module.css'
import r from './recibo.module.css'
import { Trash } from 'lucide-react'
import { useEffect } from 'react';
import { useState } from 'react';
import Sms from '../sms/sms';
import erro from '../assets/error_48px.png'
import sucesso from '../assets/ok_48px.png'

const NOME_METODO = {
    express: 'Multicaixa Express',
    iban: 'Transferência (IBAN)'
}

// evita que um nome de produto com < > & estrague o HTML do recibo
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))

export default function Carrinho() {


    const [itens, SetItens] = useState([])
    const [usuario, setUsuario] = useState(null)
    const [quantidades, setQuantidades] = useState({})
    const [metodo, setMetodo] = useState('express')
    const [texto, setTexto] = useState(null)
    const [ativar, setAtivar] = useState(null)
    const [icon, setIcon] = useState(null)
    const [pagamento, setpagamento] = useState('naopago')
    const [recibo, setRecibo] = useState(null) // dados da compra para imprimir


    const calcular = (id, quantidade, idprod) => {
        if (id === null) return

        setQuantidades(prev => ({
            ...prev,
            [id]: { quantidade: Math.max(0, Number(quantidade) || 0), idProduto: idprod }
        }))
    }



    // formata valores: 12500 -> "12 500 kz"
    const kz = (n) => Number(n).toLocaleString('pt-PT', { maximumFractionDigits: 2 }) + ' kz'


    const qtdTotal = Object.values(quantidades).reduce((acc, q) => acc + q.quantidade, 0)

    const precoTotal = itens.reduce((acc, item) => {
        const q = quantidades[item.id]?.quantidade || 0
        return acc + q * item.preco
    }, 0)


    const taxa = 2;

    const subtotal = precoTotal - (precoTotal * taxa / 100);


    useEffect(() => {
        const data = localStorage.getItem('user')
        try {
            if (data) {
                setUsuario(JSON.parse(data))
            }

        }
        catch (error) {

            alert(error.message)
        }
    }, [])



    useEffect(() => {
        if (!usuario) return  // espera o usuário carregar

        const buscar = async () => {
            try {
                const resposta = await fetch(`http://localhost:3000/ListarCart/${usuario.id}`)
                const resultado = await resposta.json()

                if (!resposta.ok) {
                    throw new Error(resultado.mensagem || resultado.erro || 'Erro de servidor')
                }

                SetItens(resultado)

            } catch (error) {
                alert('erro: ' + error.message)
            }
        }

        buscar()
    }, [usuario])

    const eliminar = async (id) => {

        try {

            const resposta = await fetch(`http://localhost:3000/elimiCart/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })

            const resultado = await resposta.json();

            if (!resposta.ok) {

                setTexto(resultado.message || resultado.error || 'Erro de Servidor');
                setAtivar(true); setIcon(erro)
                setTimeout(() => {
                    setAtivar(false)
                }, 3200)
                return

            }


            setTexto('Producto eliminado do carrinho');
            setAtivar(true); setIcon(sucesso)
            setTimeout(() => {
                setAtivar(false)
            }, 1200)
            setTimeout(() => {
                location.reload()
            }, 3200)


        } catch (error) {


            setTexto(error.message || 'Erro verifique o dados');
            setAtivar(true); setIcon(erro)
            setTimeout(() => {
                setAtivar(false)
            }, 3200)


        };
    }


    // ✅ agora também envia idCarrinho (o id da linha do carrinho) para o backend a apagar
    const itensParaEnviar = Object.entries(quantidades)
        .filter(([, v]) => v.quantidade > 0)
        .map(([id, v]) => ({ idCarrinho: id, idProduto: v.idProduto, quantidade: v.quantidade }))


    console.log(itensParaEnviar)

    // só envia quando o utilizador clica em "Confirmar Compra"
    const confirmarCompra = async (e) => {

        e.preventDefault()

        if (itensParaEnviar.length === 0) {

            setTexto('Escolha a quantidade de pelo menos um produto');
            setAtivar(true); setIcon(erro)
            setTimeout(() => setAtivar(false), 3200)
            return

        }

        try {

            const resposta = await fetch('http://localhost:3000/venda', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idCliente: usuario.id,
                    metodoPagamento: metodo,
                    itens: itensParaEnviar
                })
            })

            const resultado = await resposta.json()

            if (!resposta.ok) {

                throw new Error(resultado.mensagem || resultado.erro || resultado.message || 'Erro de Servidor')
            }

            // guarda os dados do recibo que o backend devolveu
            setRecibo({
                idVenda: resultado.idVenda,
                total: resultado.total,
                metodoPagamento: resultado.metodoPagamento || metodo,
                data: resultado.data || new Date().toISOString(),
                itens: resultado.itens || []
            })

            // tira do carrinho (no ecrã) o que acabou de ser comprado
            const idsComprados = itensParaEnviar.map(i => String(i.idCarrinho))
            SetItens(prev => prev.filter(i => !idsComprados.includes(String(i.id))))

            setTexto('Compra confirmada');
            setAtivar(true); setIcon(sucesso)
            setQuantidades({})
            setTimeout(() => setAtivar(false), 3200)
            setpagamento('pago')


        } catch (error) {

            setTexto(error.message || 'Erro verifique o dados');
            setAtivar(true); setIcon(erro)
            setTimeout(() => setAtivar(false), 3200)
        }
    }

    // imprime SÓ o recibo, num documento leve à parte (sem o resto da aplicação)
    const imprimirRecibo = () => {

        if (!recibo) return

        const metodoNome = NOME_METODO[recibo.metodoPagamento] || recibo.metodoPagamento
        const totalPagar = recibo.total - (recibo.total * taxa / 100)

        const linhas = recibo.itens.map((l) => `
            <tr>
                <td>${esc(l.nomeProduto)}</td>
                <td>${esc(l.quantidade)}</td>
                <td>${esc(kz(l.precoUnitario))}</td>
                <td>${esc(kz(l.subtotal))}</td>
            </tr>`).join('')

        const html = `<!doctype html>
<html lang="pt">
<head>
<meta charset="utf-8">
<title>Recibo ${esc(recibo.idVenda)}</title>
<style>
  @page { margin: 15mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Century Gothic', Arial, sans-serif; color: #0e0e0f; margin: 0; }
  .topo { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 3px solid #03408f; padding-bottom: 10px; margin-bottom: 14px; }
  h1 { margin: 0; font-size: 22px; }
  .num { font-weight: 700; color: #03408f; }
  .meta { display: flex; gap: 32px; flex-wrap: wrap; margin-bottom: 18px; }
  .meta span { display: block; font-size: 12px; color: #666; }
  .meta strong { font-size: 14px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
  th { text-align: left; font-size: 13px; padding: 8px 6px; border-bottom: 1px solid #555; }
  td { padding: 8px 6px; font-size: 14px; border-bottom: 1px solid #ddd; }
  th:not(:first-child), td:not(:first-child) { text-align: right; }
  .totais { width: 280px; margin-left: auto; }
  .totais div { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px; }
  .totais .final { border-top: 2px solid #03408f; padding-top: 8px; font-size: 17px; font-weight: 700; }
  .aviso { margin-top: 18px; padding: 10px 12px; border: 1px solid #03408f; border-radius: 8px; color: #03408f; font-size: 13px; font-weight: 600; }
</style>
</head>
<body>
  <div class="topo"><h1>Recibo de Compra</h1><span class="num">N.º ${esc(recibo.idVenda)}</span></div>

  <div class="meta">
    <div><span>Data</span><strong>${esc(new Date(recibo.data).toLocaleString('pt-PT'))}</strong></div>
    ${usuario?.nome ? `<div><span>Cliente</span><strong>${esc(usuario.nome)}</strong></div>` : ''}
    <div><span>Forma de pagamento</span><strong>${esc(metodoNome)}</strong></div>
  </div>

  <table>
    <thead><tr><th>Produto</th><th>Qtd</th><th>Preço</th><th>Subtotal</th></tr></thead>
    <tbody>${linhas}</tbody>
  </table>

  <div class="totais">
    <div><span>Preço</span><span>${esc(kz(recibo.total))}</span></div>
    <div><span>Taxa</span><span>${esc(taxa)}%</span></div>
    <div class="final"><span>Total a pagar</span><span>${esc(kz(totalPagar))}</span></div>
  </div>

  <p class="aviso">Pagamento por efetuar. Apresente este recibo na loja e pague por ${esc(metodoNome)}.</p>
</body>
</html>`

        // iframe invisível só com o recibo; apaga o anterior se existir
        document.getElementById('iframe-recibo')?.remove()

        const iframe = document.createElement('iframe')
        iframe.id = 'iframe-recibo'
        iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0'
        iframe.srcdoc = html

        iframe.onload = () => {
            iframe.contentWindow.focus()
            iframe.contentWindow.onafterprint = () => iframe.remove()
            iframe.contentWindow.print()
        }

        document.body.appendChild(iframe)
    }

    // gera o recibo em PDF e descarrega (não usa a janela de impressão do sistema)
    const baixarPdf = async () => {

        if (!recibo) return

        try {

            // carrega as bibliotecas só quando clicar (não pesa no resto do site)
            const [{ jsPDF }, { default: autoTable }] = await Promise.all([
                import('jspdf'),
                import('jspdf-autotable')
            ])

            // o toLocaleString põe espaços especiais que o PDF não desenha bem
            const limpo = (t) => String(t ?? '').replace(/[\u00a0\u202f]/g, ' ')

            const metodoNome = NOME_METODO[recibo.metodoPagamento] || recibo.metodoPagamento
            const totalPagar = recibo.total - (recibo.total * taxa / 100)
            const azul = [3, 64, 143]

            const doc = new jsPDF({ unit: 'mm', format: 'a4' })

            // topo
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(20)
            doc.setTextColor(14, 14, 15)
            doc.text('Recibo de Compra', 15, 20)

            doc.setFontSize(12)
            doc.setTextColor(...azul)
            doc.text(`N.º ${recibo.idVenda}`, 195, 20, { align: 'right' })

            doc.setDrawColor(...azul)
            doc.setLineWidth(0.8)
            doc.line(15, 25, 195, 25)

            // data, forma de pagamento e cliente
            const campo = (rotulo, valor, x) => {
                doc.setFont('helvetica', 'normal')
                doc.setFontSize(9)
                doc.setTextColor(110, 110, 110)
                doc.text(rotulo, x, 34)
                doc.setFont('helvetica', 'bold')
                doc.setFontSize(11)
                doc.setTextColor(14, 14, 15)
                doc.text(doc.splitTextToSize(limpo(valor), 55)[0], x, 39)
            }

            campo('Data', new Date(recibo.data).toLocaleString('pt-PT'), 15)
            campo('Forma de pagamento', metodoNome, 75)
            if (usuario?.nome) campo('Cliente', usuario.nome, 140)

            // tabela de produtos
            autoTable(doc, {
                startY: 48,
                margin: { left: 15, right: 15 },
                head: [['Produto', 'Qtd', 'Preço', 'Subtotal']],
                body: recibo.itens.map((l) => [
                    limpo(l.nomeProduto),
                    l.quantidade,
                    limpo(kz(l.precoUnitario)),
                    limpo(kz(l.subtotal))
                ]),
                theme: 'striped',
                styles: { fontSize: 10, cellPadding: 2.5 },
                headStyles: { fillColor: azul, textColor: 255 },
                columnStyles: {
                    1: { halign: 'right' },
                    2: { halign: 'right' },
                    3: { halign: 'right' }
                }
            })

            // totais (passa para a página seguinte se não couber)
            let y = doc.lastAutoTable.finalY + 12
            if (y > 250) { doc.addPage(); y = 20 }

            const linha = (rotulo, valor, negrito = false) => {
                doc.setFont('helvetica', negrito ? 'bold' : 'normal')
                doc.setFontSize(negrito ? 13 : 10)
                doc.setTextColor(14, 14, 15)
                doc.text(rotulo, 130, y)
                doc.text(limpo(valor), 195, y, { align: 'right' })
                y += negrito ? 0 : 6
            }

            linha('Preço', kz(recibo.total))
            linha('Taxa', `${taxa}%`)
            doc.setDrawColor(...azul)
            doc.setLineWidth(0.5)
            doc.line(130, y - 2, 195, y - 2)
            y += 4
            linha('Total a pagar', kz(totalPagar), true)

            // aviso
            y += 14
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(10)
            doc.setTextColor(...azul)
            doc.text(
                doc.splitTextToSize(`Pagamento por efetuar. Apresente este recibo na loja e pague por ${metodoNome}.`, 180),
                15, y
            )

            doc.save(`recibo-${recibo.idVenda}.pdf`)

        } catch (error) {

            setTexto('Não foi possível gerar o PDF');
            setAtivar(true); setIcon(erro)
            setTimeout(() => setAtivar(false), 3200)
        }
    }

    const voltarAoCarrinho = () => {
        setRecibo(null)
        setpagamento('naopago')
    }


    return (
        <>
            <form className={style.Carrinho}>

                {pagamento === 'naopago' && (

                    <div className={style.itens}>

                        <div className={style.prod}>

                            <div className={style.cabecalho}>
                                <h1>Meu Carrinho</h1>
                                <span>{itens.length} {itens.length === 1 ? 'item' : 'itens'}</span>
                            </div>

                            {itens.length === 0 && (
                                <div className={style.vazio}>
                                    <span>O seu carrinho está vazio</span>
                                </div>
                            )}

                            {

                                itens.map((dados) => {

                                    const atual = quantidades[dados.id]?.quantidade || 0

                                    return (

                                        <div key={dados.id} className={style.Lista}>

                                            <div className={style.img}>
                                                <img src={dados.img} alt={dados.producto} />
                                            </div>

                                            <div className={style.price}>
                                                <span className={style.nome}>{dados.producto}</span>
                                                <span className={style.desc}>{dados.qtd}</span>
                                                <span className={style.unit}>{kz(dados.preco)}</span>
                                                {atual > 0 && (
                                                    <span className={style.subItem}>Subtotal: {kz(atual * dados.preco)}</span>
                                                )}
                                            </div>

                                            <div className={style.qtd}>

                                                <button type="button" className={style.lixo} aria-label="Remover do carrinho" onClick={() => {

                                                    eliminar(dados.id)

                                                }}>
                                                    <Trash size={17} color='blue'></Trash>
                                                </button>

                                                <div className={style.stepper}>
                                                    <button type="button" aria-label="Diminuir" disabled={atual === 0} onClick={() => calcular(dados.id, atual - 1, dados.idProduto)}>−</button>

                                                    <input type="number" min="0" name="" id="" onChange={(e) => calcular(dados.id, e.target.value, dados.idProduto)} value={quantidades[dados.id]?.quantidade ?? ''} />

                                                    <button type="button" aria-label="Aumentar" onClick={() => calcular(dados.id, atual + 1, dados.idProduto)}>+</button>
                                                </div>

                                            </div>

                                        </div>

                                    )
                                })
                            }


                        </div>


                        <div className={style.totais}>

                            <h1 className={style.resumo}>Resumo</h1>

                            <div>
                                <span>Preço:</span>
                                <span>{kz(precoTotal)}</span>
                            </div>

                            <div>
                                <span>Quantidade:</span>
                                <span>{qtdTotal}</span>
                            </div>

                            <div>
                                <span>Taxa</span>
                                <span>{taxa}%</span>
                            </div>

                            <div className={style.total}>
                                <span>SubTotal</span>
                                <span>{kz(subtotal)}</span>
                            </div>

                            {/* forma de pagamento: só escolhe, paga depois na loja */}
                            <div className={r.metodos}>
                                <span className={r.metodosTitulo}>Forma de pagamento</span>
                                <div className={r.metodosLinha}>
                                    <button
                                        type="button"
                                        className={`${r.metodo} ${metodo === 'express' ? r.metodoAtivo : ''}`}
                                        onClick={() => setMetodo('express')}
                                    >
                                        {NOME_METODO.express}
                                    </button>
                                    <button
                                        type="button"
                                        className={`${r.metodo} ${metodo === 'iban' ? r.metodoAtivo : ''}`}
                                        onClick={() => setMetodo('iban')}
                                    >
                                        {NOME_METODO.iban}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <button className={style.btn} disabled={qtdTotal === 0} onClick={confirmarCompra}>Confirmar Compra</button>
                            </div>

                        </div>



                    </div>

                )}

                {pagamento === 'pago' && recibo && (

                    <div className={r.pagina}>

                        {/* só esta parte sai na impressão */}
                        <div className={r.recibo}>

                            <div className={r.topo}>
                                <h1>Recibo de Compra</h1>
                                <span>N.º {recibo.idVenda}</span>
                            </div>

                            <div className={r.meta}>
                                <div>
                                    <span>Data</span>
                                    <strong style={{color:'black'}}>{new Date(recibo.data).toLocaleString('pt-PT')}</strong>
                                </div>
                                {usuario?.nome && (
                                    <div>
                                        <span>Cliente</span>
                                        <strong style={{color:'black'}}>{usuario.nome}</strong>
                                    </div>
                                )}
                                <div>
                                    <span>Forma de pagamento</span>
                                    <strong style={{color:'black'}} >{NOME_METODO[recibo.metodoPagamento] || recibo.metodoPagamento}</strong>
                                </div>
                            </div>

                            <table className={r.tabela}>
                                <thead>
                                    <tr>
                                        <th style={{color:'black'}}>Produto</th>
                                        <th style={{color:'black'}}>Qtd</th>
                                        <th style={{color:'black'}}>Preço</th>
                                        <th style={{color:'black'}}>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recibo.itens.map((l, i) => (
                                        <tr key={`${l.idProduto}-${i}`}>
                                            <td style={{color:'black'}}>{l.nomeProduto}</td>
                                            <td style={{color:'black'}}>{l.quantidade}</td>
                                            <td style={{color:'black'}}>{kz(l.precoUnitario)}</td>
                                            <td style={{color:'black'}}>{kz(l.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className={r.totais}>
                                <div>
                                    <span>Preço</span>
                                    <span>{kz(recibo.total)}</span>
                                </div>
                                <div>
                                    <span>Taxa</span>
                                    <span>{taxa}%</span>
                                </div>
                                <div className={r.totalFinal}>
                                    <span>Total a pagar</span>
                                    <span>{kz(recibo.total - (recibo.total * taxa / 100))}</span>
                                </div>
                            </div>

                            <p className={r.aviso}>
                                Pagamento por efetuar. Apresente este recibo na loja e pague por {NOME_METODO[recibo.metodoPagamento] || recibo.metodoPagamento}.
                            </p>

                        </div>

                        <div className={r.acoes}>
                            <button type="button" className={style.btn} onClick={baixarPdf}>Baixar PDF</button>
                            <button type="button" className={`${style.btn} ${r.secundario}`} onClick={imprimirRecibo}>Imprimir recibo</button>
                            <button type="button" className={`${style.btn} ${r.secundario}`} onClick={voltarAoCarrinho}>Voltar ao carrinho</button>
                        </div>

                    </div>

                )}



            </form>

            <Sms mostar={ativar} icon={icon} texto={texto} ></Sms>

        </>
    )



}