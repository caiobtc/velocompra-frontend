import { useState, useEffect, useContext } from 'react';
import { CarrinhoContext } from '../contexts/CarrinhoContext.jsx';
import NavbarLoja from '../components/NavbarLoja.jsx';
import { useNavigate } from 'react-router-dom';
import AlertUtils from '../utils/alerts.js';
import api from '../services/api.js';

const ClienteResumoPedidoPage = () => {
  const { carrinho } = useContext(CarrinhoContext);
  const navigate = useNavigate();

  const [freteSelecionado, setFreteSelecionado] = useState('');
  const [valorFrete, setValorFrete] = useState(0);
  const [totalGeral, setTotalGeral] = useState(0);
  const [enderecoEntrega, setEnderecoEntrega] = useState(null);
  const [formaPagamento, setFormaPagamento] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      AlertUtils.aviso('Você precisa estar logado para ver o resumo do pedido.');
      navigate('/cliente/login');
      return;
    }

    // Recuperar dados salvos do checkout
    const freteSalvo = JSON.parse(localStorage.getItem('freteSelecionado'));
    const enderecoSalvo = JSON.parse(localStorage.getItem('enderecoEntrega'));
    const pagamentoSalvo = localStorage.getItem('formaPagamento');

    if (freteSalvo) {
      setFreteSelecionado(freteSalvo.tipo);
      setValorFrete(freteSalvo.valor);
    }

    if (enderecoSalvo) {
      setEnderecoEntrega(enderecoSalvo);
    }

    if (pagamentoSalvo) {
      setFormaPagamento(pagamentoSalvo);
    }

    // Calcular total geral
    const subtotal = calcularSubtotal();
    const frete = freteSalvo?.valor || 0;
    setTotalGeral(subtotal + frete);

  }, [navigate]);

  const calcularSubtotal = () => {
    return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
  };

  const handleVoltar = () => {
    navigate('/checkout');
  };

  const handleConcluirCompra = async () => {
    if (!enderecoEntrega) {
      AlertUtils.aviso('Selecione um endereço de entrega.');
      return;
    }
  
    const token = localStorage.getItem('token');
    const freteSalvo = JSON.parse(localStorage.getItem('freteSelecionado'));
    const formaPagamentoSalva = localStorage.getItem('formaPagamento');
  
    const pedidoDTO = {
      enderecoEntregaId: enderecoEntrega.id,
      formaPagamento: formaPagamentoSalva,
      frete: freteSalvo?.valor || 0,
      produtos: carrinho.map(item => ({
        produtoId: item.id,
        quantidade: item.quantidade,
        precoUnitario: item.preco
      }))
    };
  
    try {
      const response = await api.post('/pedidos', pedidoDTO, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const pedido = response.data;
  
      AlertUtils.sucesso(
        `Pedido #${pedido.numeroPedido} criado com sucesso!\nValor total: ${pedido.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
      );

      // Limpa o carrinho e localStorage se quiser
      localStorage.removeItem('freteSelecionado');
      localStorage.removeItem('enderecoEntrega');
      localStorage.removeItem('formaPagamento');
  
      navigate('/meus-pedidos'); // ou /meus-pedidos
  
    } catch (error) {
      console.error('Erro ao finalizar pedido', error);
      AlertUtils.erro('Erro ao finalizar a compra. Tente novamente.');
    }
  };  

  return (
    <>
      <NavbarLoja />
      <div className="container py-5">
        <h2 className="fw-bold mb-4 text-center">🛒 Resumo do Pedido</h2>

        <div className="card p-4 shadow-sm mb-4">
          <h5 className="fw-bold mb-3">Resumo do Pedido</h5>

          <ul className="list-group">
            {carrinho.map((item) => (
              <li key={item.id} className="list-group-item d-flex align-items-center gap-3">
                <img
                  src={`http://localhost:8080/uploads/${item.imagemPadrao || item.imagens?.[0]}`}
                  alt={item.nome}
                  className="img-thumbnail"
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                />
                <div>
                  <strong>{item.nome}</strong><br />
                  {item.quantidade} x {parseFloat(item.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} = {parseFloat(item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-between mt-3">
            <h6 className="fw-bold">Subtotal:</h6>
            <span>{calcularSubtotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>

          <div className="d-flex justify-content-between mt-2">
            <h6 className="fw-bold">Frete:</h6>
            <span>{valorFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>

          <div className="mt-4">
            <h6 className="fw-bold">Endereço de Entrega:</h6>
            {enderecoEntrega ? (
              <div>
                <p>{enderecoEntrega.logradouro}, {enderecoEntrega.numero}</p>
                <p>{enderecoEntrega.bairro}, {enderecoEntrega.cidade}/{enderecoEntrega.uf}</p>
                <p>CEP: {enderecoEntrega.cep}</p>
              </div>
            ) : (
              <p className="text-muted">Endereço não selecionado</p>
            )}
          </div>

          <div className="mt-3">
            <h6 className="fw-bold">Forma de Pagamento:</h6>
            <p>{formaPagamento === 'cartao' ? 'Cartão de Crédito' : 'Boleto Bancário'}</p>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4 className="fw-bold">Total:</h4>
            <span>{totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-outline-primary" onClick={handleVoltar}>
              <i className="bi bi-arrow-left-circle me-2"></i> Voltar à Escolha de Pagamento
            </button>
            <button
              className="btn btn-success"
              onClick={handleConcluirCompra}
              disabled={!enderecoEntrega}
            >
              <i className="bi bi-check-circle me-2"></i> Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClienteResumoPedidoPage;
