// Importa hooks e componentes necessários do React e bibliotecas externas
import { Link, useNavigate } from 'react-router-dom'; // Link cria navegação declarativa e useNavigate permite redirecionamento programático
import { useContext, useEffect, useState } from 'react'; // Hooks para estado, efeito colateral e contexto
import { CarrinhoContext } from '../contexts/CarrinhoContext.jsx'; // Importa o contexto do carrinho
import Swal from 'sweetalert2'; // Biblioteca para exibir alertas personalizados
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importa JavaScript do Bootstrap (dropdowns, modais, etc.)
import LoginDropdown from './LoginDropdown';

// Componente da barra de navegação da loja
const NavbarLoja = () => {
  const navigate = useNavigate(); // Hook para redirecionar rotas
  const { carrinho } = useContext(CarrinhoContext); // Acessa o estado global do carrinho
  const [clienteLogado, setClienteLogado] = useState(null); // Estado local que armazena o nome do cliente logado (se houver)

  // Calcula a quantidade total de itens no carrinho
  const quantidadeItens = carrinho.reduce((total, item) => total + item.quantidade, 0);

  // useEffect executa uma vez ao montar o componente
  useEffect(() => {
    const nome = localStorage.getItem('nome'); // Recupera o nome do cliente do localStorage
    const grupo = localStorage.getItem('grupo'); // Recupera o grupo (CLIENTE, ADMIN, etc.)

    // Se o grupo for CLIENTE, armazena o nome no estado
    if (grupo === 'CLIENTE') {
      setClienteLogado(nome);
    }

    // Inicializa os dropdowns do Bootstrap manualmente
    const dropdownTriggerList = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    dropdownTriggerList.forEach((dropdownToggleEl) => {
      new window.bootstrap.Dropdown(dropdownToggleEl);
    });
  }, []);

  // Função chamada ao clicar no botão "Sair"
  const handleLogout = () => {
    // Exibe um alerta de confirmação
    Swal.fire({
      title: 'Deseja sair?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, sair'
    }).then((result) => {
      // Se o usuário confirmou que deseja sair
      if (result.isConfirmed) {
        // Remove dados do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('nome');
        localStorage.removeItem('grupo');
        localStorage.removeItem('carrinho');

        setClienteLogado(null); // Limpa o estado local
        navigate('/'); // Redireciona para a página inicial

        // Exibe mensagem de sucesso
        Swal.fire('Deslogado!', 'Sua sessão foi encerrada.', 'success'); // Corrigido 'successo' para 'success'
      }
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <div className="container-fluid">
        {/* Logotipo da loja com link para a home */}
        <Link className="navbar-brand fw-bold text-primary" to="/">
          <i className="fas fa-bolt"></i> Velocompra
        </Link>

        {/* Seção à direita da navbar */}
        <div className="d-flex align-items-center">

          {/* NOVO POSICIONAMENTO: Login/Dropdown antes do carrinho */}
          {clienteLogado ? (
            <div className="dropdown me-3"> {/* Adicionado me-3 para espaçamento com o carrinho */}
              <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Olá, {clienteLogado.split(' ')[0]} {/* Exibe apenas o primeiro nome */}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" onClick={() => navigate('/cliente/editar')}>Meus Dados</button></li>
                <li><button className="dropdown-item" onClick={() => navigate('/meus-pedidos')}>Meus Pedidos</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger" onClick={handleLogout}>Sair</button></li>
              </ul>
            </div>
          ) : (
            <div className="me-3"> {/* Adicionado me-3 para espaçamento com o carrinho */}
                <LoginDropdown />
            </div>
          )}

          {/* Botão do carrinho de compras com contador de itens */}
          <button
            className="btn btn-outline-primary position-relative" // Removido me-3 daqui, pois o login agora tem
            onClick={() => navigate('/carrinho')} // Redireciona para a página do carrinho
          >
            <i className="fas fa-shopping-cart"></i>
            {/* Exibe badge se houver itens no carrinho */}
            {quantidadeItens > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: '0.7rem' }}
              >
                {quantidadeItens}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

// Exporta o componente para ser usado em outras partes do projeto
export default NavbarLoja;