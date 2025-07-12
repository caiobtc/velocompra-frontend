// Importa hooks do React: useEffect (efeitos colaterais) e useState (estado local)
import { useEffect, useState } from 'react';

// Importa hook para navegação entre rotas
import { useNavigate } from 'react-router-dom';

// Importa instância do Axios com configurações pré-definidas
import api from '../services/api.js';

// Importa componente de menu superior da loja
import NavbarLoja from '../components/NavbarLoja.jsx';

// Importa funções de alerta (sucesso, erro, aviso etc.)
import AlertUtils from '../utils/alerts.js';

// Define o componente funcional da página principal da loja
const LojaHomePage = () => {
  // Cria função para navegação programática
  const navigate = useNavigate();

  // Estado local que armazena a lista de produtos
  const [produtos, setProdutos] = useState([]);

  // Executa a função buscarProdutos apenas 1 vez após montar a página
  useEffect(() => {
    buscarProdutos();
  }, []);

  // Função assíncrona que faz chamada GET para listar os produtos
  const buscarProdutos = async () => {
    try {
      // Faz requisição GET para o backend com paginação
      const response = await api.get('/produtos', {
        params: { page: 0, size: 20 }, // página 0, 20 itens por página
        headers: { Accept: 'application/json' } // Aceita JSON como resposta
      });

      // Atualiza o estado com a lista de produtos (content da resposta paginada)
      setProdutos(response.data.content);
    } catch (error) {
      // Exibe erro no console e alerta visual na interface
      console.error('Erro ao buscar produtos:', error);
      AlertUtils.erro('Erro ao carregar produtos.');
    }
  };

  // Redireciona para a página de detalhes do produto ao clicar no botão
  const handleVerDetalhes = (id) => {
    navigate(`/loja/produtos/${id}`);
  };

  // Retorna o caminho da imagem principal do produto
  const getImagemPrincipal = (produto) => {
    // Se o campo imagemPadrao estiver preenchido, usa ele
    if (produto.imagemPadrao) {
      return `http://localhost:8080/uploads/${produto.imagemPadrao}`;
    }

    // Se não tiver imagem padrão, usa a primeira imagem da lista (se existir)
    if (produto.imagens && produto.imagens.length > 0) {
      return `http://localhost:8080/uploads/${produto.imagens[0]}`;
    }

    // Se não tiver imagem nenhuma, usa imagem genérica
    return 'https://placehold.co/300x200?text=Sem+Imagem';
  };

  // Renderização do componente (parte visual)
  return (
    <>
      {/* Menu superior da loja */}
      <NavbarLoja />

      {/* Container dos produtos */}
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-4">Produtos em Destaque</h2>

        <div className="row g-4">
          {/* Mapeia cada produto para criar um card na tela */}
          {produtos.map((produto) => (
            <div className="col-md-4" key={produto.id}>
              <div className="card h-100 shadow-sm rounded">

                {/* Área da imagem do produto */}
                <div
                  style={{
                    height: '250px',
                    backgroundColor: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    overflow: 'hidden',
                  }}
                >
                  {/* Exibe a imagem principal do produto */}
                  <img
                    src={getImagemPrincipal(produto)}
                    alt={produto.nome}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      padding: '10px',
                    }}
                  />
                </div>

                {/* Corpo do card com informações do produto */}
                <div className="card-body d-flex flex-column">
                  {/* Nome do produto */}
                  <h5 className="card-title">{produto.nome}</h5>

                  {/* Preço formatado em real */}
                  <p className="card-text fw-bold text-success mb-2">
                    {parseFloat(produto.preco).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </p>

                  {/* Botão que redireciona para página de detalhes */}
                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => handleVerDetalhes(produto.id)}
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Caso não haja nenhum produto, mostra mensagem de vazio */}
          {produtos.length === 0 && (
            <div className="text-center text-muted">
              <p>Nenhum produto encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Exporta o componente como padrão para ser usado em rotas
export default LojaHomePage;
