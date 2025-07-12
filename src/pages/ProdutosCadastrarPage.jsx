// Importa o hook useState do React para controlar estados locais do componente
import { useState } from 'react';
// Importa o serviço de API para realizar requisições HTTP
import api from '../services/api.js';
// Importa hook de navegação do React Router
import { useNavigate } from 'react-router-dom';
// Importa o layout padrão do backoffice
import BackofficeLayout from '../components/BackofficeLayout.jsx';
// Importa utilitário para exibir alertas
import AlertUtils from '../utils/alerts.js';

// Componente de cadastro de produtos
const ProdutosCadastrarPage = () => {
  const navigate = useNavigate(); // Inicializa o hook de navegação

  // Define os estados para os campos do formulário
  const [nome, setNome] = useState('');
  const [avaliacao, setAvaliacao] = useState(1); // Valor inicial da avaliação é 1
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [imagens, setImagens] = useState([]); // Lista de arquivos de imagem
  const [previews, setPreviews] = useState([]); // URLs para exibir as imagens
  const [imagemPadraoIndex, setImagemPadraoIndex] = useState(0); // Índice da imagem padrão

  // Função executada ao enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita recarregar a página

    // Valida se ao menos uma imagem foi selecionada
    if (imagens.length === 0) {
      AlertUtils.aviso('Selecione pelo menos uma imagem para o produto!');
      return;
    }

    // Garante que o estoque seja um número não-negativo
    const estoqueNumerico = Math.max(0, parseInt(estoque) || 0);

    // Prepara os dados em formato multipart/form-data para envio
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricaoDetalhada', descricao);
    formData.append('preco', preco);
    formData.append('quantidadeEstoque', estoqueNumerico);
    formData.append('imagemPadrao', imagemPadraoIndex);

    // Adiciona todas as imagens selecionadas no formData
    imagens.forEach((img) => {
      formData.append('imagens', img);
    });

    try {
      // Envia a requisição POST para cadastrar o produto
      const response = await api.post('/produtos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const produtoCriado = response.data;
      const produtoId = produtoCriado?.id;

      // Se existir um ID, armazena a avaliação localmente
      if (produtoId) {
        localStorage.setItem(`avaliacao_produto_${produtoId}`, avaliacao);
      }

      AlertUtils.sucesso('Produto cadastrado com sucesso!');
      navigate('/produtos'); // Redireciona para a lista de produtos
      
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      AlertUtils.erro('Erro ao cadastrar produto.');
    }
  };

  // Manipula a seleção de arquivos de imagem
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Converte para array

    if (files.length === 0) return;

    // Adiciona novas imagens ao estado atual
    const novasImagens = [...imagens, ...files];
    const novasPreviews = [
      ...previews,
      ...files.map((file) => URL.createObjectURL(file)),
    ];

    setImagens(novasImagens);
    setPreviews(novasPreviews);

    // Se for a primeira imagem, define como imagem padrão
    if (novasImagens.length === files.length) {
      setImagemPadraoIndex(0);
    }
  };

  // Remove uma imagem e seu preview com base no índice
  const removerImagem = (index) => {
    const novasImagens = imagens.filter((_, i) => i !== index);
    const novasPreviews = previews.filter((_, i) => i !== index);

    setImagens(novasImagens);
    setPreviews(novasPreviews);

    // Ajusta o índice da imagem padrão se necessário
    if (imagemPadraoIndex === index) {
      setImagemPadraoIndex(0);
    } else if (imagemPadraoIndex > index) {
      setImagemPadraoIndex(imagemPadraoIndex - 1);
    }
  };

  return (
    <BackofficeLayout>
      {/* Container centralizado verticalmente */}
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '15px' }}>
          <h3 className="fw-bold text-center mb-4">Cadastro de Produto</h3>

          {/* Formulário de cadastro */}
          <form onSubmit={handleSubmit}>
            {/* Campo nome */}
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

            {/* Campo avaliação */}
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

            {/* Campo descrição */}
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

            {/* Campo preço */}
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

            {/* Campo estoque */}
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

            {/* Upload de imagens */}
            <div className="mb-3">
              <label className="form-label">Imagens do Produto</label>
              <input
                type="file"
                className="form-control"
                multiple
                onChange={handleImageChange}
              />

              {/* Previews das imagens */}
              {previews.length > 0 && (
                <div className="d-flex gap-3 flex-wrap mt-2">
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

                      {/* Botão para remover imagem */}
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                        onClick={() => removerImagem(index)}
                      >
                        ×
                      </button>

                      {/* Indicação de imagem padrão */}
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
              )}
            </div>

            {/* Botões de ação */}
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

export default ProdutosCadastrarPage; // Exporta o componente
