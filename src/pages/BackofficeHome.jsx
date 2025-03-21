import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import 'bootstrap-icons/font/bootstrap-icons.css';

const BackofficePage = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGerenciarProdutos = () => {
    navigate('/produtos');
  };

  const handleGerenciarUsuarios = () => {
    navigate('/usuarios');
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg border-0 p-5" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-1">Bem-vindo ao <span className="text-primary">Backoffice</span></h2>
          <p className="text-muted">Gerencie os recursos da sua loja</p>
        </div>

        <div className="mb-4 text-center">
          <h5 className="text-secondary">Grupo:</h5>
          <h4 className="fw-semibold">{usuario?.grupo || '---'}</h4>
        </div>

        <div className="d-grid gap-3">
          <button
            className="btn btn-success btn-lg d-flex justify-content-center align-items-center gap-2"
            onClick={handleGerenciarProdutos}
          >
            <i className="bi bi-box-seam"></i> Gerenciar Produtos
          </button>

          {/* Apenas para ADMINISTRADOR aparece este botão */}
          {usuario?.grupo === 'ADMINISTRADOR' && (
            <button
              className="btn btn-primary btn-lg d-flex justify-content-center align-items-center gap-2"
              onClick={handleGerenciarUsuarios}
            >
              <i className="bi bi-people"></i> Gerenciar Usuários
            </button>
          )}

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

export default BackofficePage;
