// src/components/LoginDropdown.jsx

import { Link, useNavigate } from 'react-router-dom';
import './LoginDropdown.css'; // Importe o CSS que acabamos de criar

const LoginDropdown = () => {
  const navigate = useNavigate();

  return (
    // O contêiner que vai 'ouvir' o evento de hover
    <div className="dropdown-container">
      {/* Gatilho que o usuário vê (ícone + texto) */}
      <button className="login-dropdown-trigger btn btn-link text-decoration-none p-0">
        <i className="bi bi-person-circle fs-3 me-2 text-dark"></i>
        <div className="d-flex flex-column align-items-start"> {/* lh-1 para diminuir a altura da linha */}
          <span className="fw-bold text-primary">BEM-VINDO!</span>
          <span className="small text-muted">Entre ou cadastre-se</span>
        </div>
      </button>

      {/* O menu que aparece no hover */}
      <div
        className="dropdown-menu dropdown-menu-end text-center p-3"
        style={{ minWidth: '180px' }} // Ajuste a largura conforme necessário
      >
        <button
          className="btn btn-dark w-100 mb-2"
          onClick={() => navigate('/cliente/login')} // Use a rota correta de login
        >
          ENTRAR
        </button>
        <div className="text-muted">Ainda não tem conta?</div>
        <Link
          to="/cadastro" // Use a rota correta de cadastro
          className="text-danger fw-bold text-decoration-none"
        >
          CADASTRE-SE
        </Link>
      </div>
    </div>
  );
};

export default LoginDropdown;