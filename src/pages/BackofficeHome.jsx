// Importa o hook useContext para acessar o contexto de autenticação
import { useContext } from 'react';
// Importa o hook useNavigate para redirecionar o usuário entre rotas
import { useNavigate } from 'react-router-dom';
// Importa o contexto de autenticação, onde está armazenado o usuário logado e a função de logout
import { AuthContext } from '../contexts/AuthContext.jsx';
// Importa os ícones da biblioteca Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css';

// Declara o componente funcional BackofficePage
const BackofficePage = () => {
  // Usa o contexto de autenticação para obter o usuário logado e a função de logout
  const { usuario, logout } = useContext(AuthContext);
  // Cria a função de navegação para redirecionar entre páginas
  const navigate = useNavigate();

  // Função que trata o logout do usuário
  const handleLogout = () => {
    //logout(); // Chama a função de logout do contexto
    navigate('/login-back'); // Redireciona o usuário para a página de login do backoffice
  };

  // Redireciona para a página de gerenciamento de produtos
  const handleGerenciarProdutos = () => {
    navigate('/produtos');
  };

  // Redireciona para a página de gerenciamento de usuários
  const handleGerenciarUsuarios = () => {
    navigate('/usuarios');
  };

  // Redireciona para a página de gerenciamento de pedidos no backoffice
  const handleGerenciarPedidos = () => {
    navigate('/backoffice/pedidos');
  };

  // Retorna o conteúdo da interface JSX da página do backoffice
  return (
    // Div externa com estilização do Bootstrap que centraliza o conteúdo na tela
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      {/* Card central com sombra e espaçamento */}
      <div className="card shadow-lg border-0 p-5" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px' }}>
        
        {/* Cabeçalho do card com título e descrição */}
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-1">
            Bem-vindo ao <span className="text-primary">Backoffice</span>
          </h2>
          <p className="text-muted">Gerencie os recursos da sua loja</p>
        </div>

        {/* Exibe o grupo do usuário logado */}
        <div className="mb-4 text-center">
          <h5 className="text-secondary">Grupo:</h5>
          {/* Se o usuário estiver definido, exibe o grupo; caso contrário, mostra "---" */}
          <h4 className="fw-semibold">{usuario?.grupo || '---'}</h4>
        </div>

        {/* Botões de gerenciamento com espaçamento vertical entre eles */}
        <div className="d-grid gap-3">
          {/* Botão visível para todos: redireciona para a página de produtos */}
          <button
            className="btn btn-success btn-lg d-flex justify-content-center align-items-center gap-2"
            onClick={handleGerenciarProdutos}
          >
            <i className="bi bi-box-seam"></i> Gerenciar Produtos
          </button>

          {/* IF: se o grupo do usuário for 'ESTOQUISTA', exibe botão para gerenciar pedidos */}
          {usuario?.grupo === 'ESTOQUISTA' && (
            <button
              className="btn btn-warning btn-lg d-flex justify-content-center align-items-center gap-2"
              onClick={handleGerenciarPedidos}
            >
              <i className="bi bi-truck"></i> Gerenciar Pedidos
            </button>
          )}

          {/* IF: se o grupo do usuário for 'ADMINISTRADOR', exibe botão para gerenciar usuários */}
          {usuario?.grupo === 'ADMINISTRADOR' && (
            <button
              className="btn btn-primary btn-lg d-flex justify-content-center align-items-center gap-2"
              onClick={handleGerenciarUsuarios}
            >
              <i className="bi bi-people"></i> Gerenciar Usuários
            </button>
          )}

          {/* Botão visível para todos: realiza logout e redireciona */}
          <button
            className="btn btn-outline-danger btn-lg d-flex justify-content-center align-items-center gap-2"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i> Sair
          </button>
        </div>
      </div>
    </div>
  );
};

// Exporta o componente para ser usado em outras partes da aplicação
export default BackofficePage;
