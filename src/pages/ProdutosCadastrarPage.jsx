import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import BackofficeLayout from '../components/BackofficeLayout';

const ProdutosCadastrarPage = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [avaliacao, setAvaliacao] = useState(1);
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [imagens, setImagens] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [imagemPadraoIndex, setImagemPadraoIndex] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imagens.length === 0) {
      alert('Selecione pelo menos uma imagem para o produto!');
      return;
    }

    const estoqueNumerico = Math.max(0, parseInt(estoque) || 0);

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricaoDetalhada', descricao);
    formData.append('preco', preco);
    formData.append('quantidadeEstoque', estoqueNumerico);
    formData.append('imagemPadrao', imagemPadraoIndex);

    imagens.forEach((img) => {
      formData.append('imagens', img);
    });

    try {
      const response = await api.post('/produtos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const produtoCriado = response.data;
      const produtoId = produtoCriado?.id;

      if (produtoId) {
        localStorage.setItem(`avaliacao_produto_${produtoId}`, avaliacao);
      }

      alert('Produto cadastrado com sucesso!');
      navigate('/produtos');
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      alert('Erro ao cadastrar produto.');
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const novasImagens = [...imagens, ...files];
    const novasPreviews = [
      ...previews,
      ...files.map((file) => URL.createObjectURL(file)),
    ];

    setImagens(novasImagens);
    setPreviews(novasPreviews);

    if (novasImagens.length === files.length) {
      setImagemPadraoIndex(0);
    }
  };

  const removerImagem = (index) => {
    const novasImagens = imagens.filter((_, i) => i !== index);
    const novasPreviews = previews.filter((_, i) => i !== index);

    setImagens(novasImagens);
    setPreviews(novasPreviews);

    if (imagemPadraoIndex === index) {
      setImagemPadraoIndex(0);
    } else if (imagemPadraoIndex > index) {
      setImagemPadraoIndex(imagemPadraoIndex - 1);
    }
  };

  return (
    <BackofficeLayout>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '15px' }}>
          <h3 className="fw-bold text-center mb-4">Cadastro de Produto</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                maxLength={200}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Avaliação</label>
              <input
                type="number"
                className="form-control"
                min={1}
                max={5}
                step={0.5}
                value={avaliacao}
                onChange={(e) => setAvaliacao(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Descrição Detalhada</label>
              <textarea
                className="form-control"
                maxLength={2000}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Preço (R$)</label>
              <input
                type="number"
                className="form-control"
                step={0.01}
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Quantidade em Estoque</label>
              <input
                type="number"
                className="form-control"
                min={0}
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Imagens do Produto</label>
              <input
                type="file"
                className="form-control"
                multiple
                onChange={handleImageChange}
              />

              {previews.length > 0 && (
                <>
                  <div className="d-flex gap-3 flex-wrap">
                    {previews.map((preview, index) => (
                      <div
                        key={index}
                        className={`border p-1 position-relative ${imagemPadraoIndex === index ? 'border-primary' : ''}`}
                        style={{
                          width: '120px',
                          height: '120px',
                          cursor: 'pointer',
                          borderWidth: imagemPadraoIndex === index ? '3px' : '1px',
                          borderRadius: '10px',
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Imagem ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px',
                          }}
                          onClick={() => setImagemPadraoIndex(index)}
                        />

                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0"
                          onClick={() => removerImagem(index)}
                        >
                          ×
                        </button>

                        <div className="text-center">
                          {imagemPadraoIndex === index ? (
                            <small className="mt-1 text-primary fw-semibold">Imagem Padrão</small>
                          ) : (
                            <small className="text-muted">Clique p/ Padrão</small>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="d-grid gap-2 mt-4">
              <button type="submit" className="btn btn-success btn-lg">
                Cadastrar Produto
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-lg"
                onClick={() => navigate('/produtos')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </BackofficeLayout>
  );
};

export default ProdutosCadastrarPage;
