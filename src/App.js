import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPages.jsx';
import BackofficePage from './pages/BackofficeHome.jsx';
import UsuariosPage from './pages/UsuariosPage.jsx';
import ProdutosPage from './pages/ProdutosPage.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import UsuariosCadastrarPage from './pages/UsuariosCadastrarPage.jsx';
import UsuariosEditarPage from './pages/UsuariosEditarPage.jsx';
import ProdutosEditarPage from './pages/ProdutosEditarPage.jsx';
import ProdutosCadastrarPage from './pages/ProdutosCadastrarPage.jsx';
import ProdutosVisualizarPage from './pages/ProdutosVisualizarPage.jsx';
import LojaHomePage from './pages/LojaHomePage.jsx';
import LojaProdutoVisualizarPage from './pages/LojaProdutoVisualizarPage.jsx';
import LojaCarrinhoPage from './pages/LojaCarrinhoPage.jsx';
import AppLayout from './components/AppLayout.jsx';
import ClienteCadastroPage from './pages/ClienteCadastroPage.jsx';
import ClienteLoginPage from './pages/ClienteLoginPage.jsx';
import ClienteEditarPage from './pages/ClienteEditarPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx'
import ClientePagamentoPage from './pages/ClientePagamentoPage.jsx';
import ClienteResumoPedidoPage from './pages/ClienteResumoPedidoPage.jsx';
import ClienteFinalizarCompraPage from './pages/ClienteFinalizarCompraPage.jsx';
import ClientePedidosPage from './pages/ClientePedidosPage.jsx';
import ClientePedidoDetalhesPage from './pages/ClientePedidoDetalhesPage.jsx';
import EstoquePedidosPage from './pages/EstoquePedidosPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* Login Backoffice separado */}
        <Route path="/login-back" element={<LoginPage />} />

        {/* Rotas da Loja com Footer */}
        <Route path="/" element={<AppLayout><LojaHomePage /></AppLayout>} />
        <Route path="/loja" element={<AppLayout><LojaHomePage /></AppLayout>} />
        <Route path="/loja/produtos/:id" element={<AppLayout><LojaProdutoVisualizarPage /></AppLayout>} />
        <Route path="/carrinho" element={<AppLayout><LojaCarrinhoPage /></AppLayout>} />
        <Route path="/cadastro" element={<AppLayout><ClienteCadastroPage /></AppLayout>} />
        <Route path="/checkout" element={<AppLayout><CheckoutPage /> </AppLayout>} />
        <Route path="/pagamento" element={<AppLayout><ClientePagamentoPage /> </AppLayout>} />
        <Route path="/resumo-pedido" element={<AppLayout><ClienteResumoPedidoPage /> </AppLayout>} />
        <Route path="/finalizar-compra" element={<AppLayout><ClienteFinalizarCompraPage /> </AppLayout>} />
        <Route path="/meus-pedidos" element={<AppLayout><ClientePedidosPage /></AppLayout>} />
        <Route path="/pedidos/:numeroPedido" element={<AppLayout><ClientePedidoDetalhesPage /></AppLayout>} />


        {/* Rotas Cliente */}
        <Route path="/cliente/login" element={<AppLayout><ClienteLoginPage /></AppLayout>} />
        <Route path="/cliente/editar" element={<AppLayout><ClienteEditarPage /></AppLayout>} />

        {/* Backoffice */}
        <Route path="/backoffice" element={<PrivateRoute><BackofficePage /></PrivateRoute>} />
        <Route path="/produtos" element={<PrivateRoute><ProdutosPage /></PrivateRoute>} />
        <Route path="/produtos/cadastrar" element={<AdminRoute><ProdutosCadastrarPage /></AdminRoute>} />
        <Route path="/produtos/editar/:id" element={<PrivateRoute><ProdutosEditarPage /></PrivateRoute>} />
        <Route path="/produtos/visualizar/:id" element={<AdminRoute><ProdutosVisualizarPage /></AdminRoute>} />
        <Route path="/usuarios" element={<AdminRoute><UsuariosPage /></AdminRoute>} />
        <Route path="/usuarios/cadastrar" element={<AdminRoute><UsuariosCadastrarPage /></AdminRoute>} />
        <Route path="/usuarios/editar/:id" element={<AdminRoute><UsuariosEditarPage /></AdminRoute>} />
        <Route path="/backoffice/pedidos" element={<PrivateRoute><EstoquePedidosPage /></PrivateRoute>}/>

        {/* Rota fallback para a loja */}
        <Route path="*" element={<AppLayout><LojaHomePage /></AppLayout>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
