// Importações de hooks e bibliotecas necessárias
import { useEffect, useState, useContext } from 'react'; // Hooks do React
import { useParams, useNavigate } from 'react-router-dom'; // Hooks de navegação e parâmetros da URL
import api from '../services/api.js'; // Importa o serviço de API (axios configurado)
import NavbarLoja from '../components/NavbarLoja'; // Importa o componente da navbar da loja
import { CarrinhoContext } from '../contexts/CarrinhoContext.jsx'; // Importa o contexto do carrinho
import AlertUtils from '../utils/alerts.js'; // Importa utilitários de alertas
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa CSS do Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'; // Importa ícones do Bootstrap

const LojaProdutoVisualizarPage = () => {
  // Pega o ID do produto da URL
  const { id } = useParams();

  // Hook de navegação para redirecionar páginas
  const navigate = useNavigate();

  // Função para adicionar o produto ao carrinho
  const { adicionarAoCarrinho } = useContext(CarrinhoContext);

  // Estado do produto carregado da API
  const [produto, setProduto] = useState(null);

  // Estado da imagem atualmente selecionada
  const [imagemSelecionada, setImagemSelecionada] = useState('');

  // Executa ao montar o componente
  useEffect(() => {
    carregarProduto(); // Busca os dados do produto
  }, []);

  // Função para carregar os dados do produto
  const carregarProduto = async () => {
    try {
      const response = await api.get(`/produtos/${id}`); // Requisição GET para buscar o produto
      const produtoCarregado = response.data;

      // Busca a avaliação salva no localStorage (caso exista)
      const avaliacaoLocal = localStorage.getItem(`avaliacao_produto_${id}`);
      produtoCarregado.avaliacao = avaliacaoLocal ? parseFloat(avaliacaoLocal) : 0;

      // Atualiza o estado com os dados carregados
      setProduto(produtoCarregado);

      // Define imagem principal a ser exibida
      if (produtoCarregado.imagemPadrao) {
        setImagemSelecionada(produtoCarregado.imagemPadrao);
      } else if (produtoCarregado.imagens?.length > 0) {
        setImagemSelecionada(produtoCarregado.imagens[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      navigate('/loja'); // Redireciona para a loja caso falhe
    }
  };

  // Função para comprar o produto (adiciona ao carrinho)
  const handleComprar = () => {
    // Verifica se há estoque
    if (!produto || produto.quantidadeEstoque <= 0) {
      AlertUtils.aviso('Produto fora de estoque.');
      return;
    }

    // Adiciona ao carrinho
    const adicionado = adicionarAoCarrinho(produto);

    // Mostra mensagem de sucesso e redireciona para o carrinho
    if (adicionado) {
      AlertUtils.sucesso('Produto adicionado ao carrinho com sucesso!');
      navigate('/carrinho');
    }
  };

  // Enquanto o produto estiver sendo carregado, mostra o spinner
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

  // Renderização principal do componente
  return (
    <>
      <NavbarLoja />
      <div className="container py-5">
        <h3 className="fw-bold text-center mb-4">{produto.nome}</h3>

        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card shadow-lg p-4" style={{ borderRadius: '15px' }}>
              
              {/* Galeria de imagens em miniatura */}
              <div className="row">
                <div className="col-md-2 d-flex flex-column align-items-center gap-2">
                  {produto.imagens?.length > 0 ? (
                    produto.imagens.map((img, index) => (
                      <img
                        key={index}
                        src={`http://localhost:8080/uploads/${img}`}
                        alt={`Miniatura ${produto.nome} ${index + 1}`}
                        onMouseEnter={() => setImagemSelecionada(img)} // Troca a imagem principal
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

                {/* Imagem principal selecionada */}
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

                {/* Botões de voltar e comprar */}
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

export default LojaProdutoVisualizarPage; // Exporta o componente para ser usado nas rotas
