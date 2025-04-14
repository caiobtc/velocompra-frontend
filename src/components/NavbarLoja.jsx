import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CarrinhoContext } from '../contexts/CarrinhoContext.jsx'; // Certifique-se que está no caminho correto!

const NavbarLoja = () => {
  const navigate = useNavigate();
  const { carrinho } = useContext(CarrinhoContext); // Pegamos o carrinho do contexto

  // Conta a quantidade total de itens no carrinho
  const quantidadeItens = carrinho.reduce((total, item) => total + item.quantidade, 0);

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
            {/* Badge de quantidade */}
            {quantidadeItens > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: '0.7rem' }}
              >
                {quantidadeItens}
              </span>
            )}
          </button>

          {/* Botão de login/criar conta */}
          <Link to="/cadastro" className="btn btn-primary">
            Login / Criar Conta
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavbarLoja;
