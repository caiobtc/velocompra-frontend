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

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* Login e Fallback (sem Footer) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<LoginPage />} />

        {/* Rotas da Loja com Footer */}
        <Route path="/cadastro" element={<AppLayout><ClienteCadastroPage /></AppLayout>} />
        <Route path="/" element={<AppLayout><LojaHomePage /></AppLayout>} />
        <Route path="/loja" element={<AppLayout><LojaHomePage /></AppLayout>} />
        <Route path="/loja/produtos/:id" element={<AppLayout><LojaProdutoVisualizarPage /></AppLayout>} />
        <Route path="/carrinho" element={<AppLayout><LojaCarrinhoPage /></AppLayout>} />

        {/* Backoffice com Footer */}
        <Route path="/backoffice" element={<PrivateRoute><BackofficePage /></PrivateRoute>} />
        <Route path="/produtos" element={<PrivateRoute><ProdutosPage /></PrivateRoute>} />
        <Route path="/produtos/cadastrar" element={<AdminRoute><ProdutosCadastrarPage /></AdminRoute>} />
        <Route path="/produtos/editar/:id" element={<PrivateRoute><ProdutosEditarPage /></PrivateRoute>} />
        <Route path="/produtos/visualizar/:id" element={<AdminRoute><ProdutosVisualizarPage /></AdminRoute>} />
        <Route path="/usuarios" element={<AdminRoute><UsuariosPage /></AdminRoute>} />
        <Route path="/usuarios/cadastrar" element={<AdminRoute><UsuariosCadastrarPage /></AdminRoute>} />
        <Route path="/usuarios/editar/:id" element={<AdminRoute><UsuariosEditarPage /></AdminRoute>} />


        {/* Rotas do Backoffice */}
        {/* <Route path="/produtos" element={<ProdutosPage />} /> */}

        {/* <Route path="/" element={<LojaHomePage />} />
        <Route path="/produtos/:id" element={<ProdutosVisualizarPage />} />

        <Route path="/" element={<LojaHomePage />} />       */}

        <Route path="*" element={<LoginPage />} />

      </Routes>
    </AuthProvider>
  );
}

export default App;
