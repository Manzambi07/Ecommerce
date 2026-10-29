import { Routes, Route,BrowserRouter } from 'react-router-dom';
import Carrinho from './Pages/carrinho'
import NotAfound from './Pages/notafound'
import Avaliar from './Pages/avaliar'
import MainLayout from './Pages/mainLayout'
import Product from './Pages/product';
import Dash from './Pages/Dashboard/Dash';
{/*rotas do administrador*/}
import Rotas from './Pages/Dashboard/Pages/Rotas';
import Dashboard from './Pages/Dashboard/Pages/Dashboard'
import User from './Pages/Dashboard/Pages/User'
import Clientes from './Pages/Dashboard/Pages/client'
import Categoria from './Pages/Dashboard/Pages/category'
import Relatorio from './Pages/Dashboard/Pages/relatorios'
import Venda from './Pages/Dashboard/Pages/vendas'
import Avaliacoes from './Pages/Dashboard/Pages/avaliacoes'
import Produtos from './Pages/Dashboard/Pages/produtos'

function App() {

  return (

<BrowserRouter>

      <Routes>

        <Route element={<MainLayout/>}>

        <Route path="/" element={<Product />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="*" element={<NotAfound/>} />
        <Route path="/avaliar" element={<Avaliar/>} />
        
        </Route>


       {/*Rotas administrativas*/}
        <Route element={<Rotas/>}>
        <Route path="/Dashboard" element={<Dashboard></Dashboard>} />
        <Route path="/Usuarios" element={<User></User>} />
        <Route path="/Clientes" element={<Clientes></Clientes>} />
        <Route path="/Categorias" element={<Categoria></Categoria>} />
        <Route path="/Productos" element={<Produtos></Produtos>} />
        <Route path="/Vendas" element={<Venda></Venda>} />
        <Route path="/Avaliacoes" element={<Avaliacoes></Avaliacoes>} />
        <Route path="/Relatorios" element={<Relatorio></Relatorio>} />
        <Route path="*" element={<NotAfound/>} />
        </Route>

         <Route path='/Dashboard' element={<Dash />} />
      
      </Routes>

</BrowserRouter>

    );
}

export default App
