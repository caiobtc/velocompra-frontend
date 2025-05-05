import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import NavbarLoja from '../components/NavbarLoja';
import AlertUtils from '../utils/alerts';

const ClientePedidosPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      AlertUtils.aviso('Você precisa estar logado para visualizar os pedidos.');
      navigate('/cliente/login');
      return;
    }

    const carregarPedidos = async () => {
      try {
        const response = await api.get('/pedidos/meus-pedidos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPedidos(response.data);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        AlertUtils.erro('Erro ao carregar seus pedidos.');
      }
    };

    carregarPedidos();
  }, [navigate]);

  return (
    <>
      <NavbarLoja />
      <div className="container py-5">
        <h2 className="fw-bold text-center mb-4">📦 Meus Pedidos</h2>

        {pedidos.length === 0 ? (
          <p className="text-muted text-center">Você ainda não fez nenhum pedido.</p>
        ) : (
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
                {pedidos.map((pedido) => (
                  <tr key={pedido.numeroPedido}>
                    <td>{pedido.numeroPedido}</td>
                    <td>{new Date(pedido.dataCriacao).toLocaleDateString('pt-BR')}</td>
                    <td>{parseFloat(pedido.valorTotal).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}</td>
                    <td>{pedido.status}</td>
                    <td>
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

export default ClientePedidosPage;
