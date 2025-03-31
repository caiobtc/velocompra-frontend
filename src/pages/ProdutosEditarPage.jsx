import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext.jsx';
import BackofficeLayout from '../components/BackofficeLayout';
import AlertUtils from '../utils/alerts';

const ProdutosEditarPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  const [nome, setNome] = useState('');
  const [descricaoDetalhada, setDescricaoDetalhada] = useState('');
  const [preco, setPreco] = useState('');
  const [avaliacao, setAvaliacao] = useState(0);
  const [quantidadeEstoque, setQuantidadeEstoque] = useState('');
  const [imagensExistentes, setImagensExistentes] = useState([]);
  const [imagemPadraoExistente, setImagemPadraoExistente] = useState('');
  const [novasImagens, setNovasImagens] = useState([]);
  const [imagemPadraoIndex, setImagemPadraoIndex] = useState(0);

  const isAdmin = usuario?.grupo === 'ADMINISTRADOR';
  const isEstoquista = usuario?.grupo === 'ESTOQUISTA';

  useEffect(() => {
    carregarProduto();
  }, []);

  const carregarProduto = async () => {
    try {
      const response = await api.get(`/produtos/${id}`);
      const produto = response.data;

      setNome(produto.nome);
      setDescricaoDetalhada(produto.descricaoDetalhada);
      setPreco(produto.preco);
      setQuantidadeEstoque(produto.quantidadeEstoque);
      setImagensExistentes(produto.imagens || []);
      setImagemPadraoExistente(produto.imagemPadrao || '');

      const avaliacaoSalva = localStorage.getItem(`avaliacao_produto_${id}`);
      setAvaliacao(parseFloat(avaliacaoSalva) || 0);

      setImagemPadraoIndex(0);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      AlertUtils.erro('Erro ao carregar produto.');
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNovasImagens(files);
    setImagemPadraoIndex(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEstoquista) {
        await api.patch(`/produtos/${id}/estoque`, null, {
          params: { quantidadeEstoque },
        });

        AlertUtils.sucesso('Estoque atualizado com sucesso!');
        navigate('/produtos');
        return;
      }

      const estoqueNumerico = Math.max(0, parseInt(quantidadeEstoque), 0);

      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('descricaoDetalhada', descricaoDetalhada);
      formData.append('preco', preco);
      formData.append('quantidadeEstoque', estoqueNumerico);

      if (novasImagens.length > 0) {
        formData.append('imagemPadrao', imagemPadraoIndex);
        novasImagens.forEach((img) => {
          formData.append('imagens', img);
        });
      } else {
        const indexExistente = imagensExistentes.indexOf(imagemPadraoExistente);
        formData.append('imagemPadrao', indexExistente >= 0 ? indexExistente : 0);
      }

      await api.put(`/produtos/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      localStorage.setItem(`avaliacao_produto_${id}`, avaliacao);

      AlertUtils.sucesso('Produto atualizado com sucesso!');
      navigate('/produtos');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      AlertUtils.erro('Erro ao atualizar produto.');
    }
  };

  return (
    <BackofficeLayout>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '15px' }}>
          <h3 className="fw-bold text-center mb-4">
            {isAdmin ? 'Editar Produto' : 'Editar Estoque'}
          </h3>

          <form onSubmit={handleSubmit}>
            {isAdmin && (
              <>
                <div className="mb-3">
                  <label className="form-label">Nome</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descrição Detalhada</label>
                  <textarea
                    className="form-control"
                    value={descricaoDetalhada}
                    onChange={(e) => setDescricaoDetalhada(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Preço</label>
                  <input
                    type="number"
                    className="form-control"
                    step="0.01"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Avaliação</label>
                  <input
                    type="number"
                    className="form-control"
                    step="0.5"
                    min="1"
                    max="5"
                    value={avaliacao}
                    onChange={(e) => setAvaliacao(e.target.value)}
                    required
                  />
                  <small className="text-muted">De 1 a 5 (pode usar frações de 0.5)</small>
                </div>
              </>
            )}

            <div className="mb-3">
              <label className="form-label">Quantidade em Estoque</label>
              <input
                type="number"
                className="form-control"
                min={0}
                value={quantidadeEstoque}
                onChange={(e) => setQuantidadeEstoque(e.target.value)}
                required
              />
            </div>

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
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    onChange={handleImageChange}
                  />

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

            <div className="d-grid gap-2 mt-4">
              <button
                type="button"
                className="btn btn-outline-danger btn-lg"
                onClick={() => navigate('/produtos')}
              >
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

export default ProdutosEditarPage;
