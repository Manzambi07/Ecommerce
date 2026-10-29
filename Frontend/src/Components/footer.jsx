import style from './footer.module.css'
import open from '../assets/open_box_64px.png'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {


    return (

        <>

            <footer id='rodape' className={style.footer}>


                <div className={style.info}>

                    <div className={style.topo}>

                        <div className={style.cta}>

                            <div className={style.logo}>
                                <img src={open} alt="logo" />
                            </div>

                            <span className={style.rotulo}>Contacto</span>
                            <h2 className={style.titulo}>Vamos conversar sobre o que precisa.</h2>

                            <Link className={style.botao} to="/avaliar">
                                Fale connosco <ArrowRight size={16} />
                            </Link>

                        </div>


                        <div className={style.colunas}>

                            <div className={style.coluna}>
                                <span className={style.colTitulo}>Solution</span>
                                <a href="">Marketing</a>
                                <a href="">Analytics</a>
                                <a href="">Commerce</a>
                                <a href="">Insights</a>
                            </div>

                            <div className={style.coluna}>
                                <span className={style.colTitulo}>Support</span>
                                <a href="">Pricing</a>
                                <a href="">Documentation</a>
                                <a href="">Guides</a>
                                <a href="">API Status</a>
                            </div>

                            <div className={style.coluna}>
                                <span className={style.colTitulo}>Legal</span>
                                <Link to="/rodape">Claim</Link>
                                <Link to="/rodape">Privacy</Link>
                                <Link to="/rodape">Terms</Link>
                                <Link to="/rodape">Partners</Link>
                            </div>

                        </div>

                    </div>


                    <div className={style.base}>

                        <span className={style.copy}>© {new Date().getFullYear()}.NsessaSebastião Todos os direitos reservados.</span>

                        <div className={style.sociais}>
                            <a href="mailto:nsessa07@gmail.com" aria-label="Email"><Mail size={18} /></a>
                            <a href="tel:+244975074442" aria-label="Telefone"><Phone size={18} /></a>
                            <a href="#rodape" aria-label="Localização"><MapPin size={18} /></a>
                        </div>

                    </div>

                </div>

            </footer>

        </>

    )


}