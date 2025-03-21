import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import NavbarLoja from '../components/NavbarLoja';

const LojaHomePage = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    buscarProdutos();
  }, []);

  const buscarProdutos = async () => {
    try {
      const response = await api.get('/produtos', {
        params: { page: 0, size: 20 },
        headers: { Accept: 'application/json' }
      });
      setProdutos(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      alert('Erro ao carregar produtos.');
    }
  };

  const handleVerDetalhes = (id) => {
    navigate(`/loja/produtos/${id}`); // Adicionando a origem
  };

  const getImagemPrincipal = (produto) => {
    if (produto.imagemPadrao) {
      return `http://localhost:8080/uploads/${produto.imagemPadrao}`;
    }

    if (produto.imagens && produto.imagens.length > 0) {
      return `http://localhost:8080/uploads/${produto.imagens[0]}`;
    }

    return 'https://placehold.co/300x200?text=Sem+Imagem';
  };

  return (
    <>
      <NavbarLoja />

      <div className="container py-5">
        <h2 className="text-center fw-bold mb-4">Produtos em Destaque</h2>

        <div className="row g-4">
          {produtos.map((produto) => (
            <div className="col-md-4" key={produto.id}>
              <div className="card h-100 shadow-sm rounded">
                {/* Imagem principal */}
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

                {/* Informações do produto */}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{produto.nome}</h5>

                  <p className="card-text fw-bold text-success mb-2">
                    {parseFloat(produto.preco).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </p>

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

export default LojaHomePage;
