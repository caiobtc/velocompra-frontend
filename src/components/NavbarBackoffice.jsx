import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const NavbarBackoffice = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 py-2 shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        {/* Logo */}
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-lightning-charge-fill text-warning fs-4"></i>
          <span className="navbar-brand fw-bold fs-5 m-0">Velocompra Backoffice</span>
        </div>

        {/* Navegação com destaque vibrante */}
        <ul className="navbar-nav d-flex flex-row gap-4 mx-4">
          <li className="nav-item">
            <a className="nav-link fw-bold text-white position-relative nav-link-vibrant" href="/backoffice">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link fw-bold text-white position-relative nav-link-vibrant" href="/produtos">
              Produtos
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link fw-bold text-white position-relative nav-link-vibrant" href="/usuarios">
              Usuários
            </a>
          </li>
        </ul>

        {/* Usuário + botão sair */}
        <div className="d-flex align-items-center gap-3">
          {usuario && (
            <div className="d-flex align-items-center gap-2 text-white fw-semibold">
              <i className="bi bi-person-circle fs-5"></i>
              <span>{usuario.nome}</span>
              <span className="badge bg-light text-dark">{usuario.grupo}</span>
            </div>
          )}
          <button
            className="btn btn-danger btn-sm d-flex align-items-center gap-1"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i> Sair
          </button>
        </div>
      </div>

      {/* Estilos customizados para destaque */}
      <style>{`
        .nav-link-vibrant::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0%;
          height: 3px;
          background-color: #00ffc8;
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .nav-link-vibrant:hover::after {
          width: 100%;
        }

        .nav-link-vibrant:hover {
          color: #00ffc8 !important;
          text-shadow: 0 0 1px #00ffc8;
        }
      `}</style>
    </nav>
  );
};

export default NavbarBackoffice;
