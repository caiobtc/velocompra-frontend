// Importa os hooks e dependências necessárias
import { useEffect, useState } from 'react'; // Hooks do React para estado e efeito colateral
import { useNavigate, useParams } from 'react-router-dom'; // Navegação e leitura de parâmetros da URL
import NavbarLoja from '../components/NavbarLoja'; // Navbar da loja
import api from '../services/api'; // Cliente axios para chamadas à API
import AlertUtils from '../utils/alerts'; // Utilitário para exibir mensagens ao usuário

// Componente principal
const ClientePedidoDetalhesPage = () => {
  const { numeroPedido } = useParams(); // Extrai o número do pedido da URL
  const navigate = useNavigate(); // Hook para redirecionamento de páginas

  const [pedido, setPedido] = useState(null); // Estado para armazenar os dados do pedido

  // Executa ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem('token'); // Busca o token salvo localmente
    if (!token) {
      AlertUtils.aviso('Você precisa estar logado para visualizar os pedidos.'); // Alerta se não estiver logado
      navigate('/cliente/login'); // Redireciona para a tela de login
      return;
    }

    // Função que carrega os dados do pedido via API
    const carregarDetalhes = async () => {
      try {
        const response = await api.get(`/pedidos/${numeroPedido}`, {
          headers: { Authorization: `Bearer ${token}` } // Envia o token no header
        });
        setPedido(response.data); // Atualiza o estado com o pedido
      } catch (error) {
        console.error('Erro ao carregar detalhes do pedido:', error); // Loga o erro
        AlertUtils.erro('Erro ao carregar os detalhes do pedido.'); // Alerta o usuário
      }
    };

    carregarDetalhes(); // Executa a função
  }, [numeroPedido, navigate]); // Executa novamente se mudar o número do pedido ou a função navigate

  // Enquanto os dados não são carregados, não renderiza nada
  if (!pedido) return null;

  return (
    <>
      <NavbarLoja /> {/* Navbar da loja */}
      <div className="container py-5">
        <h2 className="fw-bold mb-4 text-center">📄 Detalhes do Pedido</h2>

        <div className="card p-4 shadow-sm mb-4"> {/* Card com os dados do pedido */}
          <h5 className="fw-bold">Número do Pedido: {pedido.numeroPedido}</h5>
          <p><strong>Data:</strong> {new Date(pedido.dataCriacao).toLocaleDateString('pt-BR')}</p>
          <p><strong>Status:</strong> {pedido.status}</p>

          <h6 className="fw-bold mt-4">Produtos:</h6>
          <ul className="list-group mb-3">
            {pedido.itens.map((item, index) => (
              <li
                key={index}
                className="list-group-item d-flex align-items-center gap-3"
              >
                <img
                  src={`http://localhost:8080/uploads/${item.imagemProduto}`}
                  alt={item.nomeProduto}
                  style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '6px' }}
                />

                <div className="flex-grow-1">
                  <p className="mb-1 fw-bold">{item.nomeProduto}</p>
                  <p className="mb-0">
                    Qtd: {item.quantidade} x {parseFloat(item.precoUnitario).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </p>
                </div>

                <span className="fw-bold text-nowrap">
                  {(item.quantidade * item.precoUnitario).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </li>
            ))}
          </ul>

          <div className="mb-3">
            <p><strong>Frete:</strong> {parseFloat(pedido.valorFrete).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <h5 className="fw-bold">Total: {parseFloat(pedido.valorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h5>
          </div>

          <h6 className="fw-bold">Endereço de Entrega:</h6>
          <p>
            {pedido.enderecoEntrega.logradouro}, {pedido.enderecoEntrega.numero} - {pedido.enderecoEntrega.bairro},<br />
            {pedido.enderecoEntrega.cidade}/{pedido.enderecoEntrega.uf} - CEP: {pedido.enderecoEntrega.cep}
          </p>

          <p><strong>Forma de Pagamento:</strong> {pedido.formaPagamento === 'cartao' ? 'Cartão de Crédito' : 'Boleto Bancário'}</p>
        </div>
      </div>
    </>
  );
};

export default ClientePedidoDetalhesPage; // Exporta o componente
