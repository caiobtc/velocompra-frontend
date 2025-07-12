// Importa hooks do React: useEffect para efeitos colaterais e useState para controle de estado
import { useEffect, useState } from 'react';
// Importa hook de navegação entre rotas
import { useNavigate } from 'react-router-dom';
// Importa cliente de requisições HTTP configurado para a API
import api from '../services/api';
// Importa componente de navegação superior da loja
import NavbarLoja from '../components/NavbarLoja';
// Importa utilitário para exibir alertas visuais
import AlertUtils from '../utils/alerts';

// Componente funcional que renderiza a página de pedidos do cliente
const ClientePedidosPage = () => {
  // Estado para armazenar os pedidos do cliente
  const [pedidos, setPedidos] = useState([]);

  // Hook de navegação (redirecionamento)
  const navigate = useNavigate();

  // Efeito que roda ao carregar a página
  useEffect(() => {
    // Busca token salvo no localStorage
    const token = localStorage.getItem('token');

    // Se não estiver autenticado, exibe aviso e redireciona para login
    if (!token) {
      AlertUtils.aviso('Você precisa estar logado para visualizar os pedidos.');
      navigate('/cliente/login');
      return; // Interrompe o efeito
    }

    // Função assíncrona para buscar os pedidos do cliente na API
    const carregarPedidos = async () => {
      try {
        // Requisição GET para rota de pedidos do cliente autenticado
        const response = await api.get('/pedidos/meus-pedidos', {
          headers: {
            Authorization: `Bearer ${token}`, // Autorização via token JWT
          },
        });

        // Atualiza o estado com os pedidos recebidos
        setPedidos(response.data);
      } catch (error) {
        // Exibe erro no console e alerta visual
        console.error('Erro ao carregar pedidos:', error);
        AlertUtils.erro('Erro ao carregar seus pedidos.');
      }
    };

    // Executa a função de carregamento de pedidos
    carregarPedidos();
  }, [navigate]); // O efeito depende da função navigate

  // Retorno JSX da página
  return (
    <>
      {/* Componente de navegação superior da loja */}
      <NavbarLoja />

      <div className="container py-5">
        <h2 className="fw-bold text-center mb-4">📦 Meus Pedidos</h2>

        {/* Verifica se há pedidos */}
        {pedidos.length === 0 ? (
          // Caso não haja nenhum pedido, exibe mensagem
          <p className="text-muted text-center">Você ainda não fez nenhum pedido.</p>
        ) : (
          // Caso existam pedidos, renderiza tabela com os dados
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Data</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {/* Mapeia a lista de pedidos e cria uma linha da tabela para cada um */}
                {pedidos.map((pedido) => (
                  <tr key={pedido.numeroPedido}>
                    <td>{pedido.numeroPedido}</td>
                    {/* Formata a data de criação para o padrão brasileiro */}
                    <td>{new Date(pedido.dataCriacao).toLocaleDateString('pt-BR')}</td>
                    {/* Formata o valor total para real (R$) */}
                    <td>{parseFloat(pedido.valorTotal).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}</td>
                    <td>{pedido.status}</td>
                    <td>
                      {/* Botão que redireciona para os detalhes do pedido */}
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => navigate(`/pedidos/${pedido.numeroPedido}`)}
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

// Exporta o componente para ser usado nas rotas
export default ClientePedidosPage;
