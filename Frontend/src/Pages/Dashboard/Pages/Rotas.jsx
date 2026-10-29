import { Outlet } from "react-router-dom";
import style from './Rotas.module.css'
import Panel from '../components/panel'
import PanelCima from "../components/panelCima";

export default function Rotas() {
    return (
        <div className={style.layout}>
            <PanelCima className={style.layout1}></PanelCima>
            <Panel  className={style.layout2}/> 
            <div className={style.rotas}>
                <Outlet />
            </div>
        </div>
    )
}