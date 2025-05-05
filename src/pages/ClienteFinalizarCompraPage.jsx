import { useState, useContext, useEffect } from 'react';
import { CarrinhoContext } from '../contexts/CarrinhoContext.jsx';
import NavbarLoja from '../components/NavbarLoja.jsx';
import { useNavigate } from 'react-router-dom';
import AlertUtils from '../utils/alerts.js';
import api from '../services/api.js';

const ClienteFinalizarCompraPage = () => {
  const { carrinho } = useContext(CarrinhoContext);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  const [pedido, setPedido] = useState(null);
  const navigate = useNavigate();

  const calcularSubtotal = () => {
    return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal();
  };

  const handleFinalizarCompra = async () => {
    const token = localStorage.getItem('token');
    const formaPagamento = 'cartao'; // Aqui você deve pegar a forma de pagamento selecionada

    if (!token || !formaPagamento) {
      AlertUtils.aviso('Selecione uma forma de pagamento.');
      return;
    }

    const pedidoData = {
      produtos: carrinho,
      valorTotal: calcularTotal(),
      formaPagamento,
      status: 'Aguardando pagamento',
      clienteId: localStorage.getItem('clienteId'), // Armazene o ID do cliente
      enderecoEntrega: 'Endereço de entrega do cliente', // Aqui você deve pegar o endereço do cliente
    };

    try {
      const response = await api.post('/pedido/criar', pedidoData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { numeroPedido, valorTotal } = response.data;

      setPedido({
        numero: numeroPedido,
        valor: valorTotal,
        status: 'Aguardando pagamento',
      });

      setPedidoConfirmado(true);
    } catch (error) {
      AlertUtils.erro('Erro ao finalizar a compra. Tente novamente.');
    }
  };

  return (
    <>
      <NavbarLoja />
      <div className="container py-5">
        <h2 className="fw-bold mb-4 text-center">🛒 Concluir Compra</h2>

        {pedidoConfirmado ? (
          <div className="alert alert-success text-center" role="alert">
            <h4 className="alert-heading">Pedido Confirmado!</h4>
            <p>
              Seu pedido número <strong>{pedido.numero}</strong> foi criado com sucesso. O valor total foi de{' '}
              <strong>{pedido.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>.
            </p>
            <p>Status: <strong>{pedido.status}</strong></p>
            <button
              className="btn btn-success"
              onClick={() => navigate('/meus-pedidos')}
            >
              Ver Meus Pedidos
            </button>
          </div>
        ) : (
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="fw-bold">
              Total: {calcularTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h4>

            <button
              className="btn btn-success"
              onClick={handleFinalizarCompra}
            >
              Concluir Compra
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ClienteFinalizarCompraPage;
