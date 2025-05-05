import { useState, useEffect, useContext } from 'react';
import { CarrinhoContext } from '../contexts/CarrinhoContext.jsx';
import NavbarLoja from '../components/NavbarLoja.jsx';
import { useNavigate } from 'react-router-dom';
import AlertUtils from '../utils/alerts.js';
import api from '../services/api.js';

const CheckoutPage = () => {
  const { carrinho } = useContext(CarrinhoContext);
  const navigate = useNavigate();

  const [freteSelecionado, setFreteSelecionado] = useState(null);
  const [valorFrete, setValorFrete] = useState(0);
  const [enderecosEntrega, setEnderecosEntrega] = useState([]);
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [pagamento, setPagamento] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      AlertUtils.aviso('Você precisa estar logado para fazer o checkout.');
      navigate('/cliente/login');
      return;
    }

    const loadEnderecos = async () => {
      try {
        const response = await api.get('/checkout', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setEnderecosEntrega(response.data);
      } catch (error) {
        AlertUtils.erro('Erro ao carregar os endereços.');
      }
    };

    loadEnderecos();
  }, [navigate]);

  const calcularSubtotal = () => {
    return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal() + valorFrete;
  };

  const handleSelecionarFrete = (tipoFrete) => {
    let valor = 0;
    switch (tipoFrete) {
      case 'gratis': valor = 0; break;
      case 'pac': valor = 10; break;
      case 'sedex': valor = 20; break;
      default: valor = 0;
    }

    setFreteSelecionado(tipoFrete);
    setValorFrete(valor);

    localStorage.setItem('freteSelecionado', JSON.stringify({
      tipo: tipoFrete,
      valor: valor
    }));
  };

  const handleConfirmarEndereco = () => {
    if (!enderecoEntrega) {
      AlertUtils.aviso('Selecione um endereço de entrega.');
      return;
    }

    const endereco = enderecosEntrega.find(e => e.id === parseInt(enderecoEntrega));
    if (endereco) {
      localStorage.setItem('enderecoEntrega', JSON.stringify(endereco));
      AlertUtils.sucesso('Endereço confirmado!');
    }
  };

  const handlePagamentoChange = (e) => {
    const valor = e.target.value;
    setPagamento(valor);
    localStorage.setItem('formaPagamento', valor);
  };

  const finalizarCompra = () => {
    if (!freteSelecionado || !pagamento || !enderecoEntrega) {
      AlertUtils.aviso('Preencha todos os campos antes de continuar.');
      return;
    }

    // Confirma endereço ao finalizar (redundância de segurança)
    handleConfirmarEndereco();

    //AlertUtils.sucesso('Compra finalizada! Redirecionando para pagamento...');
    navigate('/pagamento');
  };

  return (
    <>
      <NavbarLoja />
      <div className="container py-5">
        <h2 className="fw-bold mb-4 text-center">🛒 Confirme seu Pedido</h2>

        {carrinho.length === 0 ? (
          <div className="text-center text-muted py-5">
            <h4>Seu carrinho está vazio.</h4>
            <button className="btn btn-outline-primary mt-3" onClick={() => navigate('/loja')}>
              <i className="bi bi-arrow-left-circle me-2"></i>Voltar à Loja
            </button>
          </div>
        ) : (
          <div className="card p-4 shadow-sm mb-4">
            <h5 className="fw-bold mb-3">Confirme seu Pedido</h5>
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
                    {item.quantidade} x {parseFloat(item.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                </li>
              ))}
            </ul>

            <div className="d-flex justify-content-between mt-3">
              <h6 className="fw-bold">Subtotal:</h6>
              <span>{calcularSubtotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>

            <h6 className="fw-bold mt-4">Escolha o Frete:</h6>
            {['gratis', 'pac', 'sedex'].map(tipo => (
              <div className="form-check" key={tipo}>
                <input
                  className="form-check-input"
                  type="radio"
                  id={`frete-${tipo}`}
                  name="frete"
                  checked={freteSelecionado === tipo}
                  onChange={() => handleSelecionarFrete(tipo)}
                />
                <label className="form-check-label" htmlFor={`frete-${tipo}`}>
                  {tipo === 'gratis' && 'Frete Grátis (R$ 0,00)'}
                  {tipo === 'pac' && 'PAC - Correios (R$ 10,00)'}
                  {tipo === 'sedex' && 'SEDEX - Entrega Expressa (R$ 20,00)'}
                </label>
              </div>
            ))}

            <h5 className="fw-bold mt-4">Endereço de Entrega:</h5>
            {enderecosEntrega.length > 0 ? (
              enderecosEntrega.map((endereco, index) => (
                <div key={index} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`endereco${index}`}
                    name="endereco"
                    value={endereco.id}
                    checked={parseInt(enderecoEntrega) === endereco.id}
                    onChange={(e) => setEnderecoEntrega(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor={`endereco${index}`}>
                    {endereco.logradouro}, {endereco.numero} - {endereco.bairro}, {endereco.cidade}/{endereco.uf}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-muted">Você não possui endereços cadastrados.</p>
            )}

            <button className="btn btn-outline-secondary mt-2" onClick={handleConfirmarEndereco}>
              Confirmar Endereço Selecionado
            </button>

            <h5 className="fw-bold mt-4">Forma de Pagamento:</h5>
            <select className="form-select" onChange={handlePagamentoChange} value={pagamento}>
              <option value="">Selecione...</option>
              <option value="cartao">Cartão de Crédito</option>
              <option value="boleto">Boleto Bancário</option>
            </select>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <h4 className="fw-bold">Total:</h4>
              <span>{calcularTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button className="btn btn-outline-primary" onClick={() => navigate('/loja')}>
                <i className="bi bi-arrow-left-circle me-2"></i> Continuar Comprando
              </button>

              <button
                className="btn btn-success"
                onClick={finalizarCompra}
                disabled={!freteSelecionado || !pagamento || !enderecoEntrega}
              >
                <i className="bi bi-bag-check me-2"></i> Ir para pagamento
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CheckoutPage;
