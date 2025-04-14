import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import BackofficeLayout from '../components/BackofficeLayout.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ProdutosVisualizarPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState(null);
  const [imagemSelecionada, setImagemSelecionada] = useState('');

  useEffect(() => {
    carregarProduto();
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
      navigate('/produtos');
    }
  };

  if (!produto) {
    return (
      <BackofficeLayout>
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </BackofficeLayout>
    );
  }

  return (
    <BackofficeLayout>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card shadow-lg p-4" style={{ borderRadius: '15px' }}>
              
              {/* Nome do produto */}
              <h3 className="fw-bold text-center mb-4">{produto.nome}</h3>

              {/* Galeria de imagens */}
              <div className="row">
                <div className="col-md-2 d-flex flex-column align-items-center gap-2">
                  {produto.imagens && produto.imagens.length > 0 ? (
                    produto.imagens.map((img, index) => (
                      <img
                        key={index}
                        src={`http://localhost:8080/uploads/${img}`}
                        alt={`Miniatura ${index}`}
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
                    <p>Sem imagens</p>
                  )}
                </div>

                {/* Imagem principal */}
                <div className="col-md-10 d-flex justify-content-center align-items-center">
                  {imagemSelecionada ? (
                    <img
                      src={`http://localhost:8080/uploads/${imagemSelecionada}`}
                      alt="Imagem principal"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '400px',
                        objectFit: 'contain',
                        borderRadius: '10px'
                      }}
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/400x300.png?text=Sem+Imagem"
                      alt="Sem imagem"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '400px'
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Informações do produto */}
              <div className="mt-4">
                {/* Descrição */}
                <div className="mb-3">
                  <strong>Descrição:</strong>
                  <p>{produto.descricaoDetalhada}</p>
                </div>

                {/* Preço */}
                <div className="mb-3">
                  <strong>Preço:</strong>
                  <h4 className="text-success">
                    {produto.preco
                      ? parseFloat(produto.preco).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })
                      : 'Preço não disponível'}
                  </h4>
                </div>

                {/* Avaliação */}
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

                {/* Botão voltar */}
                <div className="d-grid gap-2 mt-4">
                  <button
                    className="btn btn-outline-secondary btn-lg"
                    onClick={() => navigate('/produtos')}
                  >
                    <i className="bi bi-arrow-left me-2"></i> Voltar para Lista de Produtos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackofficeLayout>
  );
};

export default ProdutosVisualizarPage;
