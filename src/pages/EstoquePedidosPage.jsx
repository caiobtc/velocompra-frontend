import { useEffect, useState } from 'react'; // Importa hooks para efeitos colaterais e controle de estado
import { useNavigate } from 'react-router-dom'; // Hook para navegação programática
import api from '../services/api'; // Importa instância Axios para comunicação com backend
import AlertUtils from '../utils/alerts'; // Utilitário para exibir alertas visuais
import BackofficeLayout from '../components/BackofficeLayout.jsx'; // Layout padrão do painel de backoffice

const EstoquePedidosPage = () => {
  const [pedidos, setPedidos] = useState([]); // Estado para armazenar os pedidos recebidos da API
  const navigate = useNavigate(); // Hook que permite redirecionar o usuário via código

  // Lista de status possíveis para um pedido
  const statusOptions = [
    'AGUARDANDO_PAGAMENTO',
    'PAGAMENTO_REJEITADO',
    'PAGAMENTO_COM_SUCESSO',
    'AGUARDANDO_RETIRADA',
    'EM_TRANSITO',
    'ENTREGUE'
  ];

  // Hook executado ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem('token'); // Recupera o token JWT salvo no navegador
    if (!token) {
      AlertUtils.aviso('Você precisa estar logado como estoquista para visualizar os pedidos.');
      navigate('/admin/login'); // Redireciona para a tela de login caso não tenha token
      return;
    }

    // Função para buscar os pedidos do backend
    const carregarPedidos = async () => {
      try {
        const response = await api.get('/admin/pedidos', {
          headers: { Authorization: `Bearer ${token}` }, // Envia o token no cabeçalho da requisição
        });
        setPedidos(response.data); // Armazena os pedidos no estado
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        AlertUtils.erro('Erro ao carregar a lista de pedidos.');
      }
    };

    carregarPedidos(); // Executa a função de carregamento
  }, [navigate]); // Executa novamente apenas se a função navigate mudar

  // Atualiza o status localmente antes de salvar no backend
  const handleStatusChange = (numeroPedido, novoStatus) => {
    setPedidos(prev =>
      prev.map(p =>
        p.numeroPedido === numeroPedido ? { ...p, status: novoStatus } : p
      )
    );
  };

  // Envia o novo status para o backend via PATCH
  const salvarStatus = async (numeroPedido, status) => {
    try {
      await api.patch(`/admin/pedidos/${numeroPedido}/status`, {
        novoStatusPedido: status // Corpo da requisição
      });
      AlertUtils.sucesso('Status atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      AlertUtils.erro('Erro ao atualizar status do pedido.');
    }
  };

  return (
    <BackofficeLayout>
      <div className="container py-5">
        <h2 className="fw-bold text-center mb-4">\ud83d\udce6 Pedidos - Estoque</h2>

        {/* Verifica se há pedidos retornados */}
        {pedidos.length === 0 ? (
          <p className="text-muted text-center">Nenhum pedido encontrado.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Data</th>
                  <th>Número</th>
                  <th>Valor Total</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {/* Mapeia cada pedido para exibir na tabela */}
                {pedidos.map((pedido) => (
                  <tr key={pedido.numeroPedido}>
                    <td>{new Date(pedido.dataCriacao).toLocaleDateString('pt-BR')}</td>
                    <td>{pedido.numeroPedido}</td>
                    <td>
                      {parseFloat(pedido.valorTotal).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </td>
                    <td>
                      {/* Seletor de status do pedido */}
                      <select
                        className="form-select"
                        value={pedido.status}
                        onChange={(e) => handleStatusChange(pedido.numeroPedido, e.target.value)}
                      >
                        {/* Opções de status */}
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.replaceAll('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => salvarStatus(pedido.numeroPedido, pedido.status)}
                      >
                        Salvar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </BackofficeLayout>
  );
};

export default EstoquePedidosPage; // Exporta o componente para uso nas rotas
