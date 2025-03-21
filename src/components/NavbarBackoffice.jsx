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
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <span className="navbar-brand fw-bold">Velocompra Backoffice</span>

      <div className="ms-auto d-flex align-items-center gap-3">
        <span className="text-white">
          {usuario?.nome} ({usuario?.grupo})
        </span>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right"></i> Sair
        </button>
      </div>
    </nav>
  );
};

export default NavbarBackoffice;
