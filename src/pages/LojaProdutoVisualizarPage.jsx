import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import NavbarLoja from '../components/NavbarLoja';
import { CarrinhoContext } from '../contexts/CarrinhoContext.jsx';
import AlertUtils from '../utils/alerts';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const LojaProdutoVisualizarPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adicionarAoCarrinho } = useContext(CarrinhoContext);

  const [produto, setProduto] = useState(null);
  const [imagemSelecionada, setImagemSelecionada] = useState('');

  useEffect(() => {
    carregarProduto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarProduto = async () => {
    try {
      const response = await api.get(`/produtos/${id}`);
      const produtoCarregado = response.data;

      const avaliacaoLocal = localStorage.getItem(`avaliacao_produto_${id}`);
      produtoCarregado.avaliacao = avaliacaoLocal ? parseFloat(avaliacaoLocal) : 0;

      setProduto(produtoCarregado);

      if (produtoCarregado.imagemPadrao) {
        setImagemSelecionada(produtoCarregado.imagemPadrao);
      } else if (produtoCarregado.imagens?.length > 0) {
        setImagemSelecionada(produtoCarregado.imagens[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      navigate('/loja');
    }
  };

  const handleComprar = () => {
    if (!produto || produto.quantidadeEstoque <= 0) {
      AlertUtils.aviso('Produto fora de estoque.');
      return;
    }

    const adicionado = adicionarAoCarrinho(produto);

    if (adicionado) {
      AlertUtils.sucesso('Produto adicionado ao carrinho com sucesso!');
      navigate('/carrinho');
    }
  };

  if (!produto) {
    return (
      <>
        <NavbarLoja />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarLoja />
      <div className="container py-5">
        <h3 className="fw-bold text-center mb-4">{produto.nome}</h3>

        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card shadow-lg p-4" style={{ borderRadius: '15px' }}>
              
              {/* Galeria de imagens */}
              <div className="row">
                <div className="col-md-2 d-flex flex-column align-items-center gap-2">
                  {produto.imagens?.length > 0 ? (
                    produto.imagens.map((img, index) => (
                      <img
                        key={index}
                        src={`http://localhost:8080/uploads/${img}`}
                        alt={`Miniatura ${produto.nome} ${index + 1}`}
                        onMouseEnter={() => setImagemSelecionada(img)}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          border: img === imagemSelecionada ? '2px solid #0d6efd' : '1px solid #ccc',
                          borderRadius: '8px',
                          padding: '2px'
                        }}
                      />
                    ))
                  ) : (
                    <p className="text-muted">Sem imagens</p>
                  )}
                </div>

                {/* Imagem principal */}
                <div className="col-md-10 d-flex justify-content-center align-items-center">
                  {imagemSelecionada ? (
                    <img
                      src={`http://localhost:8080/uploads/${imagemSelecionada}`}
                      alt={`Imagem principal do produto ${produto.nome}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '400px',
                        objectFit: 'contain',
                        borderRadius: '10px'
                      }}
                    />
                  ) : (
                    <img
                      src="https://placehold.co/600x400?text=Sem+Imagem"
                      alt="Sem imagem disponível"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '400px',
                        borderRadius: '10px'
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Informações do Produto */}
              <div className="mt-4">
                <div className="mb-3">
                  <strong>Descrição:</strong>
                  <p>{produto.descricaoDetalhada}</p>
                </div>

                <div className="mb-3">
                  <strong>Preço:</strong>
                  <h4 className="text-success">
                    {parseFloat(produto.preco).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </h4>
                </div>

                <div className="mb-3">
                  <strong>Avaliação:</strong>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`bi ${produto.avaliacao >= star ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}
                      />
                    ))}
                    <span className="ms-2">({produto.avaliacao.toFixed(1)} / 5)</span>
                  </div>
                </div>

                <div className="mb-3">
                  <strong>Estoque:</strong>
                  <span className={`ms-2 ${produto.quantidadeEstoque > 0 ? 'text-success' : 'text-danger'}`}>
                    {produto.quantidadeEstoque > 0
                      ? `${produto.quantidadeEstoque} unidades disponíveis`
                      : 'Produto fora de estoque'}
                  </span>
                </div>

                {/* Botões */}
                <div className="d-grid gap-2 mt-4">
                  <button
                    className="btn btn-outline-secondary btn-lg"
                    onClick={() => navigate('/loja')}
                  >
                    <i className="bi bi-arrow-left me-2"></i> Voltar para Loja
                  </button>

                  <button
                    className="btn btn-success btn-lg"
                    onClick={handleComprar}
                    disabled={produto.quantidadeEstoque <= 0}
                  >
                    <i className="bi bi-cart3 me-2"></i> Comprar
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LojaProdutoVisualizarPage;
