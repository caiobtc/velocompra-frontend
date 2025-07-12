// Importa hooks do React
import { useState, useEffect, useContext } from 'react';
// Importa hooks de navegação e parâmetros de rota
import { useParams, useNavigate } from 'react-router-dom';
// Importa a instância configurada do axios
import api from '../services/api.js';
// Importa o contexto de autenticação do usuário
import { AuthContext } from '../contexts/AuthContext.jsx';
// Importa layout padrão do backoffice
import BackofficeLayout from '../components/BackofficeLayout.jsx';
// Importa utilitário para exibição de alertas
import AlertUtils from '../utils/alerts.js';

// Componente principal da página
const ProdutosEditarPage = () => {
  // Extrai o ID do produto da URL
  const { id } = useParams();
  // Permite redirecionamento programático
  const navigate = useNavigate();
  // Obtém o usuário autenticado
  const { usuario } = useContext(AuthContext);

  // Define estados para os campos do formulário
  const [nome, setNome] = useState('');
  const [descricaoDetalhada, setDescricaoDetalhada] = useState('');
  const [preco, setPreco] = useState('');
  const [avaliacao, setAvaliacao] = useState(0);
  const [quantidadeEstoque, setQuantidadeEstoque] = useState('');
  const [imagensExistentes, setImagensExistentes] = useState([]);
  const [imagemPadraoExistente, setImagemPadraoExistente] = useState('');
  const [novasImagens, setNovasImagens] = useState([]);
  const [imagemPadraoIndex, setImagemPadraoIndex] = useState(0);

  // Flags para saber o grupo de acesso do usuário
  const isAdmin = usuario?.grupo === 'ADMINISTRADOR';
  const isEstoquista = usuario?.grupo === 'ESTOQUISTA';

  // Carrega os dados do produto ao montar o componente
  useEffect(() => {
    carregarProduto();
  }, []);

  // Requisição para buscar os dados do produto no backend
  const carregarProduto = async () => {
    try {
      const response = await api.get(`/produtos/${id}`);
      const produto = response.data;

      // Preenche os campos com os dados retornados da API
      setNome(produto.nome);
      setDescricaoDetalhada(produto.descricaoDetalhada);
      setPreco(produto.preco);
      setQuantidadeEstoque(produto.quantidadeEstoque);
      setImagensExistentes(produto.imagens || []);
      setImagemPadraoExistente(produto.imagemPadrao || '');

      // Recupera a avaliação salva localmente, se existir
      const avaliacaoSalva = localStorage.getItem(`avaliacao_produto_${id}`);
      setAvaliacao(parseFloat(avaliacaoSalva) || 0);

      // Inicializa a imagem padrão com a primeira
      setImagemPadraoIndex(0);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      AlertUtils.erro('Erro ao carregar produto.');
    }
  };

  // Trata seleção de novas imagens
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNovasImagens(files);
    setImagemPadraoIndex(0);
  };

  // Envia atualização do produto ou estoque ao backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Caso seja estoquista, atualiza somente o estoque
      if (isEstoquista) {
        await api.patch(`/produtos/${id}/estoque`, null, {
          params: { quantidadeEstoque },
        });

        AlertUtils.sucesso('Estoque atualizado com sucesso!');
        navigate('/produtos');
        return;
      }

      // Converte estoque para número inteiro positivo
      const estoqueNumerico = Math.max(0, parseInt(quantidadeEstoque), 0);

      // Prepara os dados para envio via multipart/form-data
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('descricaoDetalhada', descricaoDetalhada);
      formData.append('preco', preco);
      formData.append('quantidadeEstoque', estoqueNumerico);

      // Se novas imagens forem enviadas, adiciona ao formData
      if (novasImagens.length > 0) {
        formData.append('imagemPadrao', imagemPadraoIndex);
        novasImagens.forEach((img) => {
          formData.append('imagens', img);
        });
      } else {
        // Caso contrário, mantém imagem padrão existente
        const indexExistente = imagensExistentes.indexOf(imagemPadraoExistente);
        formData.append('imagemPadrao', indexExistente >= 0 ? indexExistente : 0);
      }

      // Envia os dados via PUT para atualizar o produto
      await api.put(`/produtos/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Salva avaliação no localStorage
      localStorage.setItem(`avaliacao_produto_${id}`, avaliacao);

      AlertUtils.sucesso('Produto atualizado com sucesso!');
      navigate('/produtos');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      AlertUtils.erro('Erro ao atualizar produto.');
    }
  };

  // JSX com o formulário de edição
  return (
    <BackofficeLayout>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '15px' }}>
          <h3 className="fw-bold text-center mb-4">
            {isAdmin ? 'Editar Produto' : 'Editar Estoque'}
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Campos exibidos apenas para administradores */}
            {isAdmin && (
              <>
                <div className="mb-3">
                  <label className="form-label">Nome</label>
                  <input type="text" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descrição Detalhada</label>
                  <textarea className="form-control" value={descricaoDetalhada} onChange={(e) => setDescricaoDetalhada(e.target.value)} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Preço</label>
                  <input type="number" className="form-control" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Avaliação</label>
                  <input type="number" className="form-control" step="0.5" min="1" max="5" value={avaliacao} onChange={(e) => setAvaliacao(e.target.value)} required />
                  <small className="text-muted">De 1 a 5 (pode usar frações de 0.5)</small>
                </div>
              </>
            )}

            {/* Campo comum a ambos os perfis */}
            <div className="mb-3">
              <label className="form-label">Quantidade em Estoque</label>
              <input type="number" className="form-control" min={0} value={quantidadeEstoque} onChange={(e) => setQuantidadeEstoque(e.target.value)} required />
            </div>

            {/* Se admin, exibe imagens existentes e campo de novas imagens */}
            {isAdmin && (
              <>
                {imagensExistentes.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label fw-bold">Imagens Existentes</label>
                    <div className="d-flex gap-3 flex-wrap">
                      {imagensExistentes.map((img, index) => (
                        <div key={index} className="text-center">
                          <img
                            src={`http://localhost:8080/uploads/${img}`}
                            alt={`Imagem ${index}`}
                            style={{
                              width: '120px',
                              height: '120px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: img === imagemPadraoExistente ? '3px solid #0d6efd' : '1px solid #ddd'
                            }}
                          />
                          {img === imagemPadraoExistente && (
                            <div className="mt-1 text-primary fw-semibold">Imagem Padrão</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Nova(s) Imagem(ns)</label>
                  <input type="file" className="form-control" multiple onChange={handleImageChange} />

                  {novasImagens.length > 0 && (
                    <div className="mt-3 d-flex gap-3 flex-wrap">
                      {novasImagens.map((img, index) => (
                        <div key={index} className="text-center">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`Preview ${index}`}
                            style={{
                              width: '120px',
                              height: '120px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: index === imagemPadraoIndex ? '3px solid #0d6efd' : '1px solid #ddd'
                            }}
                            onClick={() => setImagemPadraoIndex(index)}
                          />
                          {index === imagemPadraoIndex && (
                            <div className="mt-1 text-primary fw-semibold">Imagem Padrão</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Botões de ação */}
            <div className="d-grid gap-2 mt-4">
              <button type="button" className="btn btn-outline-danger btn-lg" onClick={() => navigate('/produtos')}>
                <i className="bi bi-arrow-left me-2"></i> Cancelar
              </button>
              <button type="submit" className="btn btn-success btn-lg">
                <i className="bi bi-save me-2"></i> Atualizar {isAdmin ? 'Produto' : 'Estoque'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </BackofficeLayout>
  );
};

// Exporta o componente para uso no roteador
export default ProdutosEditarPage;
