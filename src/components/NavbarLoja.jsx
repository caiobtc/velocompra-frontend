import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { CarrinhoContext } from '../contexts/CarrinhoContext.jsx';
import Swal from 'sweetalert2';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const NavbarLoja = () => {
  const navigate = useNavigate();
  const { carrinho } = useContext(CarrinhoContext);
  const [clienteLogado, setClienteLogado] = useState(null);

  const quantidadeItens = carrinho.reduce((total, item) => total + item.quantidade, 0);

  useEffect(() => {
    const nome = localStorage.getItem('nome');
    const grupo = localStorage.getItem('grupo');
    if (grupo === 'CLIENTE') {
      setClienteLogado(nome);
    }

    // Inicializa o dropdown do Bootstrap
    const dropdownTriggerList = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    dropdownTriggerList.forEach((dropdownToggleEl) => {
      new window.bootstrap.Dropdown(dropdownToggleEl);
    });
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Deseja sair?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, sair'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('nome');
        localStorage.removeItem('grupo');
        localStorage.removeItem('carrinho');
        setClienteLogado(null);
        navigate('/');
        Swal.fire('Deslogado!', 'Sua sessão foi encerrada.', 'success');
      }
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          <i className="fas fa-bolt"></i> Velocompra
        </Link>

        <div className="d-flex align-items-center">
          {/* Carrinho */}
          <button
            className="btn btn-outline-primary position-relative me-3"
            onClick={() => navigate('/carrinho')}
          >
            <i className="fas fa-shopping-cart"></i>
            {quantidadeItens > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: '0.7rem' }}
              >
                {quantidadeItens}
              </span>
            )}
          </button>

          {/* Cliente logado */}
          {clienteLogado ? (
            <div className="dropdown">
              <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Olá, {clienteLogado.split(' ')[0]}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" onClick={() => navigate('/cliente/editar')}>Editar Dados</button></li>
                <li><button className="dropdown-item" onClick={() => navigate('/cliente/enderecos')}>Meus Endereços</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger" onClick={handleLogout}>Sair</button></li>
              </ul>
            </div>
          ) : (
            <Link to="/cadastro" className="btn btn-primary">
              Login / Criar Conta
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarLoja;
