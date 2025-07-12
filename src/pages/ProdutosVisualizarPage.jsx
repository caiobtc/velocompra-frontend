// Importa hooks do React e utilitários do projeto
import { useEffect, useState } from 'react'; // Hooks de ciclo de vida e estado
import { useParams, useNavigate } from 'react-router-dom'; // Hooks de rota: para acessar parâmetros da URL e redirecionar
import api from '../services/api.js'; // Serviço para chamadas HTTP à API
import BackofficeLayout from '../components/BackofficeLayout.jsx'; // Componente de layout padrão para páginas do backoffice
import 'bootstrap/dist/css/bootstrap.min.css'; // Estilos padrão do Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ícones do Bootstrap

// Componente da página de visualização de detalhes de um produto
const ProdutosVisualizarPage = () => {
  const { id } = useParams(); // Pega o ID do produto diretamente da URL
  const navigate = useNavigate(); // Hook para redirecionamento entre rotas

  // Estado para armazenar os dados do produto carregado
  const [produto, setProduto] = useState(null);

  // Estado para controlar qual imagem está sendo exibida como principal
  const [imagemSelecionada, setImagemSelecionada] = useState('');

  // useEffect executado ao montar o componente
  useEffect(() => {
    carregarProduto(); // Carrega os dados do produto
  }, []);

  // Função assíncrona para carregar o produto com base no ID
  const carregarProduto = async () => {
    try {
      // Faz requisição GET para buscar dados do produto pelo ID
      const response = await api.get(`/produtos/${id}`);
      const produtoCarregado = response.data;

      // Recupera a avaliação salva no localStorage, se houver
      const avaliacaoLocal = localStorage.getItem(`avaliacao_produto_${id}`);
      produtoCarregado.avaliacao = avaliacaoLocal ? parseFloat(avaliacaoLocal) : 0;

      // Atualiza o estado com os dados do produto
      setProduto(produtoCarregado);

      // Define a imagem selecionada:
      // Se tiver imagem padrão, usa ela
      if (produtoCarregado.imagemPadrao) {
        setImagemSelecionada(produtoCarregado.imagemPadrao);
      }
      // Se não tiver imagem padrão mas tiver outras imagens, pega a primeira
      else if (produtoCarregado.imagens?.length > 0) {
        setImagemSelecionada(produtoCarregado.imagens[0]);
      }
    } catch (error) {
      // Em caso de erro, exibe no console e redireciona para lista de produtos
      console.error('Erro ao carregar produto:', error);
      navigate('/produtos');
    }
  };

  // Enquanto os dados do produto não forem carregados, mostra spinner de carregamento
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

  // Quando os dados estiverem carregados, renderiza o conteúdo
  return (
    <BackofficeLayout>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card shadow-lg p-4" style={{ borderRadius: '15px' }}>
              
              {/* Exibe o nome do produto centralizado */}
              <h3 className="fw-bold text-center mb-4">{produto.nome}</h3>

              {/* Galeria de imagens: miniaturas à esquerda */}
              <div className="row">
                <div className="col-md-2 d-flex flex-column align-items-center gap-2">
                  {produto.imagens && produto.imagens.length > 0 ? (
                    // Renderiza uma miniatura para cada imagem
                    produto.imagens.map((img, index) => (
                      <img
                        key={index}
                        src={`http://localhost:8080/uploads/${img}`} // Caminho da imagem
                        alt={`Miniatura ${index}`}
                        onMouseEnter={() => setImagemSelecionada(img)} // Ao passar o mouse, troca imagem principal
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
                    <p>Sem imagens</p> // Caso não haja imagens
                  )}
                </div>

                {/* Imagem principal exibida maior ao lado direito */}
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
                    // Imagem padrão caso não haja imagem carregada
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

              {/* Detalhes do produto (descrição, preço, avaliação) */}
              <div className="mt-4">
                
                {/* Descrição do produto */}
                <div className="mb-3">
                  <strong>Descrição:</strong>
                  <p>{produto.descricaoDetalhada}</p>
                </div>

                {/* Preço formatado */}
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

                {/* Avaliação do produto com estrelas */}
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

                {/* Botão para voltar à listagem de produtos */}
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

// Exporta o componente
export default ProdutosVisualizarPage;
