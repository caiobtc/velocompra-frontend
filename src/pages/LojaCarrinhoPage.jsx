import { useContext, useState } from 'react';
import { CarrinhoContext } from '../contexts/CarrinhoContext.jsx';
import NavbarLoja from '../components/NavbarLoja.jsx';
import { useNavigate } from 'react-router-dom';

const LojaCarrinhoPage = () => {
  const { carrinho, adicionarAoCarrinho, removerDoCarrinho, limparCarrinho } = useContext(CarrinhoContext);
  const navigate = useNavigate();

  const [cep, setCep] = useState('');
  const [freteSelecionado, setFreteSelecionado] = useState(null);
  const [valorFrete, setValorFrete] = useState(0);
  const [freteCalculado, setFreteCalculado] = useState(false);

  const calcularSubtotal = () => {
    return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal() + valorFrete;
  };

  const diminuirQuantidade = (produto) => {
    if (produto.quantidade <= 1) {
      removerDoCarrinho(produto.id);
    } else {
      const produtoComNovaQuantidade = { ...produto, quantidade: produto.quantidade - 1 };
      removerDoCarrinho(produto.id);
      for (let i = 0; i < produtoComNovaQuantidade.quantidade; i++) {
        adicionarAoCarrinho(produto);
      }
    }
  };

  const handleCalcularFrete = () => {
    if (!cep || cep.length < 8) {
      alert('Por favor, informe um CEP válido.');
      return;
    }

    // Simulação de cálculo de frete para cliente não logado
    setFreteCalculado(true);
  };

  const handleSelecionarFrete = (tipoFrete) => {
    setFreteSelecionado(tipoFrete);

    switch (tipoFrete) {
      case 'gratis':
        setValorFrete(0);
        break;
      case 'pac':
        setValorFrete(10);
        break;
      case 'sedex':
        setValorFrete(20);
        break;
      default:
        setValorFrete(0);
    }
  };

  return (
    <>
      <NavbarLoja />
      <div className="container py-5">
        <h2 className="fw-bold mb-4 text-center">🛒 Meu Carrinho</h2>

        {carrinho.length === 0 ? (
          <div className="text-center text-muted py-5">
            <h4>Seu carrinho está vazio.</h4>
            <button className="btn btn-outline-primary mt-3" onClick={() => navigate('/loja')}>
              <i className="bi bi-arrow-left-circle me-2"></i>Voltar à Loja
            </button>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-end mb-3">
              <button className="btn btn-outline-danger" onClick={limparCarrinho}>
                <i className="bi bi-trash me-2"></i> REMOVER TODOS OS PRODUTOS
              </button>
            </div>

            {carrinho.map((item) => (
              <div key={item.id} className="card mb-4 shadow-sm">
                <div className="row g-0 align-items-center">
                  <div className="col-md-2 text-center p-2">
                    <img
                      src={`http://localhost:8080/uploads/${item.imagemPadrao || item.imagens[0]}`}
                      alt={item.nome}
                      className="img-fluid rounded"
                      style={{ maxHeight: '100px', objectFit: 'contain' }}
                    />
                  </div>

                  <div className="col-md-6">
                    <div className="card-body">
                      <h5 className="card-title mb-2">{item.nome}</h5>
                      <p className="mb-1 text-success fw-bold">
                        {parseFloat(item.preco).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="col-md-4 text-center">
                    <div className="d-flex flex-column align-items-center gap-2">
                      <div className="d-flex align-items-center gap-3">
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => diminuirQuantidade(item)}
                        >
                          <i className="bi bi-dash"></i>
                        </button>

                        <span className="fw-bold fs-5">{item.quantidade}</span>

                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => adicionarAoCarrinho(item)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>

                      <button
                        className="btn btn-outline-danger btn-sm mt-2"
                        onClick={() => removerDoCarrinho(item.id)}
                      >
                        <i className="bi bi-trash me-1"></i> REMOVER
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Área de cálculo de frete */}
            <div className="card p-4 shadow-sm mb-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-truck me-2 text-primary"></i> Calcular Frete
              </h5>

              <div className="d-flex flex-column flex-md-row gap-3 align-items-center">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Digite seu CEP"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  maxLength={8}
                />

                <button className="btn btn-outline-primary" onClick={handleCalcularFrete}>
                  Calcular Frete
                </button>
              </div>

              {freteCalculado && (
                <div className="mt-4">
                  <h6 className="fw-bold mb-2">Escolha uma opção de frete:</h6>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="freteGratis"
                      name="frete"
                      checked={freteSelecionado === 'gratis'}
                      onChange={() => handleSelecionarFrete('gratis')}
                    />
                    <label className="form-check-label" htmlFor="freteGratis">
                      Frete Grátis (R$ 0,00)
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="fretePAC"
                      name="frete"
                      checked={freteSelecionado === 'pac'}
                      onChange={() => handleSelecionarFrete('pac')}
                    />
                    <label className="form-check-label" htmlFor="fretePAC">
                      PAC - Correios (R$ 10,00)
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="freteSEDEX"
                      name="frete"
                      checked={freteSelecionado === 'sedex'}
                      onChange={() => handleSelecionarFrete('sedex')}
                    />
                    <label className="form-check-label" htmlFor="freteSEDEX">
                      SEDEX - Entrega Expressa (R$ 20,00)
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-between align-items-center mt-5 flex-wrap gap-3">
              <h4 className="fw-bold">
                Total: {calcularTotal().toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </h4>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate('/loja')}
                >
                  <i className="bi bi-arrow-left-circle me-2"></i> Continuar Comprando
                </button>

                <button
                  className="btn btn-success"
                  onClick={() => alert('Compra finalizada com sucesso!')}
                  disabled={!freteSelecionado}
                >
                  <i className="bi bi-bag-check me-2"></i> Finalizar Compra
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LojaCarrinhoPage;
