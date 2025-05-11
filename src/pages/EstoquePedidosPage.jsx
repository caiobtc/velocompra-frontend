import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AlertUtils from '../utils/alerts';
import BackofficeLayout from '../components/BackofficeLayout.jsx';

const EstoquePedidosPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  const statusOptions = [
    'AGUARDANDO_PAGAMENTO',
    'PAGAMENTO_REJEITADO',
    'PAGAMENTO_COM_SUCESSO',
    'AGUARDANDO_RETIRADA',
    'EM_TRANSITO',
    'ENTREGUE'
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      AlertUtils.aviso('Você precisa estar logado como estoquista para visualizar os pedidos.');
      navigate('/admin/login');
      return;
    }

    const carregarPedidos = async () => {
      try {
        const response = await api.get('/admin/pedidos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPedidos(response.data);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        AlertUtils.erro('Erro ao carregar a lista de pedidos.');
      }
    };

    carregarPedidos();
  }, [navigate]);

  const handleStatusChange = (numeroPedido, novoStatus) => {
    setPedidos(prev =>
      prev.map(p =>
        p.numeroPedido === numeroPedido ? { ...p, status: novoStatus } : p
      )
    );
  };

  const salvarStatus = async (numeroPedido, status) => {
    try {
      await api.patch(`/admin/pedidos/${numeroPedido}/status`, {
        novoStatusPedido: status
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
        <h2 className="fw-bold text-center mb-4">📦 Pedidos - Estoque</h2>

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
                      <select
                        className="form-select"
                        value={pedido.status}
                        onChange={(e) => handleStatusChange(pedido.numeroPedido, e.target.value)}
                      >
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

export default EstoquePedidosPage;
