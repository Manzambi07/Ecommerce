import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LabelList, CartesianGrid,
  PieChart, Pie, Cell, Label, Legend
} from 'recharts'
import style from './GraficoVendas.module.css'

// dados de exemplo (depois vamos buscar ao backend)
const dados = [
  { mes: 'Jan', total: 120000 },
  { mes: 'Fev', total: 98000 },
  { mes: 'Mar', total: 150000 },
  { mes: 'Abr', total: 135000 },
  { mes: 'Mai', total: 170000 },
  { mes: 'Jun', total: 160000 },
  { mes: 'Jul', total: 190000 },
  { mes: 'Ago', total: 175000 },
  { mes: 'Set', total: 210000 },
  { mes: 'Out', total: 230000 },
  { mes: 'Nov', total: 250000 },
  { mes: 'Dez', total: 300000 },
]

// 120000 -> "120k" (para caber em cima da barra)
const abreviar = (v) => (v >= 1000 ? `${v / 1000}k` : v)

// 120000 -> "120.000 kz" (para o tooltip)
const formatarKz = (v) => `${v.toLocaleString('pt-AO')} kz`


// acessos ao site por mês, separados por sexo (dados de exemplo)
const dadosAcessos = [
  { mes: 'Jan', homens: 400, mulheres: 300 },
  { mes: 'Fev', homens: 300, mulheres: 300 },
  { mes: 'Mar', homens: 500, mulheres: 400 },
  { mes: 'Abr', homens: 500, mulheres: 400 },
  { mes: 'Mai', homens: 600, mulheres: 500 },
  { mes: 'Jun', homens: 600, mulheres: 600 },
  { mes: 'Jul', homens: 700, mulheres: 600 },
  { mes: 'Ago', homens: 700, mulheres: 700 },
  { mes: 'Set', homens: 800, mulheres: 700 },
  { mes: 'Out', homens: 900, mulheres: 800 },
  { mes: 'Nov', homens: 900, mulheres: 900 },
  { mes: 'Dez', homens: 1100, mulheres: 1000 },
]

// soma o ano inteiro: reduce vai acumulando o valor de cada mês
const totalHomens = dadosAcessos.reduce((soma, d) => soma + d.homens, 0)
const totalMulheres = dadosAcessos.reduce((soma, d) => soma + d.mulheres, 0)
const totalAcessos = totalHomens + totalMulheres

// a pizza precisa de uma lista de "fatias": nome + valor
const acessoSexo = [
  { nome: 'Homens', valor: totalHomens },
  { nome: 'Mulheres', valor: totalMulheres },
]

// cores de cada fatia (na mesma ordem de acessoSexo)
const coresAcesso = ['#1098ad', '#d6336c']
const coresHomens = ['#1098ad', '#eef0f4']   // só os homens coloridos
const coresMulheres = ['#eef0f4', '#d6336c'] // só as mulheres coloridas

// 8000 -> "53%" (parte dos acessos no total)
const pct = (v) => `${Math.round((v / totalAcessos) * 100)}%`

// 1200 -> "1.200 acessos" (para o tooltip)
const formatarAcessos = (v) => `${v.toLocaleString('pt-AO')} acessos`


// gráfico de rosca reutilizável: muda só os dados, as cores e o texto do centro
function Rosca({ dados, cores, centro, legenda = false }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip formatter={(v, nome) => [formatarAcessos(v), nome]} />

        {/* innerRadius abre o buraco do meio (é isso que faz a "rosca") */}
        {/* startAngle/endAngle fazem a primeira fatia começar no topo */}
        <Pie
          data={dados}
          dataKey="valor"
          nameKey="nome"
          innerRadius="65%"
          outerRadius="90%"
          startAngle={90}
          endAngle={-270}
          paddingAngle={2}
          stroke="none"
        >
          {/* Cell pinta cada fatia */}
          {dados.map((d, i) => <Cell key={d.nome} fill={cores[i]} />)}

          {/* texto no centro do buraco */}
          <Label value={centro} position="center" fontSize={28} fontWeight={700} fill="#1f2937" />
        </Pie>

        {legenda && <Legend verticalAlign="bottom" iconType="circle" />}
      </PieChart>
    </ResponsiveContainer>
  )
}


export default function GraficoVendas() {
  return (
    <>
      {/* 1) Faturação mensal (o teu gráfico original, sem alterações) */}
      <div className={style.caixa}>
        <h2>Faturação mensal</h2>
        <p>Total faturado em cada mês do ano</p>

<div className={style.grafico} style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%"> {/* panel respponsivo onde entra todo o grafico*/}

        <BarChart data={dados} margin={{ top: 24, right: 10, left: 0, bottom: 0 }} barCategoryGap="17%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} />{/* eixo X ele lê o campo "mes" */}
              <YAxis axisLine={false} tickLine={false} tickFormatter={abreviar} />
              <Tooltip formatter={(v) => [formatarKz(v), 'Faturação']} />{/* tras a caixa ao trazer o rato  caixa ao passar o rato */}
         <Bar dataKey="total" fill="#3b5bdb" radius={[6, 6, 0, 0]} barSize={40}>
                  <LabelList dataKey="total" position="top" formatter={abreviar} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>



      </div>

<div className={style.pizza} style={{ display: 'flex', gap: 16, marginTop: 16 }}>

  <div className={style.caixa} style={{ flex: 1, minWidth: 0 }}>
    <h2>Acessos ao site</h2>
    <p>Total de visitantes no ano, divididos por sexo</p>
    <div className={style.grafico} style={{ height: 180 }}>
      <Rosca dados={acessoSexo} cores={coresAcesso} centro={abreviar(totalAcessos)} legenda />
    </div>
  </div>

  <div className={style.caixa} style={{ flex: 1, minWidth: 0 }}>
    <h2>Acessos de homens</h2>
    <p>Parte dos acessos feita por homens</p>
    <div className={style.grafico} style={{ height: 180 }}>
      <Rosca dados={acessoSexo} cores={coresHomens} centro={pct(totalHomens)} />
    </div>
  </div>

  <div className={style.caixa} style={{ flex: 1, minWidth: 0 }}>
    <h2>Acessos de mulheres</h2>
    <p>Parte dos acessos feita por mulheres</p>
    <div className={style.grafico} style={{ height: 180 }}>
      <Rosca dados={acessoSexo} cores={coresMulheres} centro={pct(totalMulheres)} />
    </div>
  </div>

</div>
    </>
  )
}