// Importações de hooks e bibliotecas necessárias
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js'; // Serviço para chamadas HTTP
import { AuthContext } from '../contexts/AuthContext.jsx'; // Contexto de autenticação para saber o tipo de usuário logado
import { formatCurrency } from '../utils/formatters.js'; // Função utilitária para formatar valores monetários
import AlertUtils from '../utils/alerts.js'; // Utilitário para exibir alertas ao usuário
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ícones do Bootstrap
import BackofficeLayout from '../components/BackofficeLayout.jsx'; // Layout base para páginas do backoffice

// Componente principal da página de listagem de produtos
const ProdutosPage = () => {
  const navigate = useNavigate(); // Hook de navegação para redirecionamento
  const { usuario } = useContext(AuthContext); // Obtém o usuário logado

  // Estados da página
  const [produtos, setProdutos] = useState([]); // Lista de produtos retornada da API
  const [filtroNome, setFiltroNome] = useState(''); // Texto digitado no campo de filtro por nome
  const [paginaAtual, setPaginaAtual] = useState(0); // Número da página atual
  const [totalPaginas, setTotalPaginas] = useState(0); // Total de páginas retornadas pela API

  const tamanhoPagina = 10; // Quantidade de produtos por página

  // useEffect executado ao carregar ou mudar de página
  useEffect(() => {
    buscarProdutos();
  }, [paginaAtual]);

  // Função para buscar produtos da API
  const buscarProdutos = async () => {
    try {
      const response = await api.get('/produtos/admin', {
        params: {
          nome: filtroNome, // Aplica filtro pelo nome
          page: paginaAtual, // Página atual
          size: tamanhoPagina, // Tamanho da página
        },
      });

      // Atualiza os estados com os dados da resposta
      setProdutos(response.data.content);
      setTotalPaginas(response.data.totalPages);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      AlertUtils.erro('Erro ao buscar produtos. Veja o console.');
    }
  };

  // Reinicia para a primeira página e busca os produtos com filtro
  const handleBuscar = () => {
    setPaginaAtual(0);
    buscarProdutos();
  };

  // Redireciona para a página de cadastro de produto
  const handleCadastrar = () => {
    navigate('/produtos/cadastrar');
  };

  // Redireciona para a página de edição de produto (estoque ou geral)
  const handleEditar = (id) => {
    navigate(`/produtos/editar/${id}`);
  };

  // Alterna o status do produto entre ativo e inativo
  const handleHabilitarInabilitar = async (id) => {
    const confirmacao = await AlertUtils.confirmar('Tem certeza que deseja alterar o status deste produto?');
    if (!confirmacao) return;

    try {
      await api.patch(`/produtos/${id}/status`);
      buscarProdutos(); // Atualiza a lista após alteração
    } catch (error) {
      console.error('Erro ao atualizar status do produto:', error);
      AlertUtils.erro('Erro ao atualizar status do produto.');
    }
  };

  // Vai para a página anterior, se possível
  const handlePaginaAnterior = () => {
    if (paginaAtual > 0) setPaginaAtual(paginaAtual - 1);
  };

  // Vai para a próxima página, se possível
  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas - 1) setPaginaAtual(paginaAtual + 1);
  };

  // JSX da página
  return (
    <BackofficeLayout>
      <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '15px' }}>
        {/* Título e botão de cadastro */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0 text-primary">
            <i className="bi bi-box-seam me-2"></i> Produtos Cadastrados
          </h2>

          {/* Botão visível apenas para administradores */}
          {usuario?.grupo === 'ADMINISTRADOR' && (
            <button className="btn btn-success btn-lg d-flex align-items-center gap-2" onClick={handleCadastrar}>
              <i className="bi bi-plus-circle"></i> Novo Produto
            </button>
          )}
        </div>

        {/* Campo de filtro por nome */}
        <div className="input-group mb-3">
          <input
            type="text"
            placeholder="Filtrar por nome do produto"
            className="form-control"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />
          <button className="btn btn-outline-primary" onClick={handleBuscar}>
            <i className="bi bi-search"></i> Buscar
          </button>
        </div>

        {/* Tabela de produtos */}
        <div className="table-responsive">
          <table className="table table-hover align-middle text-center">
            <thead className="table-primary">
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {/* Renderiza cada produto da lista */}
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.nome}</td>
                  <td>{formatCurrency(produto.preco)}</td>
                  <td>{produto.quantidadeEstoque}</td>
                  <td>
                    <span className={`badge ${produto.ativo ? 'bg-success' : 'bg-danger'}`}>
                      {produto.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      {/* Ações visíveis para administradores */}
                      {usuario?.grupo === 'ADMINISTRADOR' && (
                        <>
                          <button className="btn btn-warning btn-sm" onClick={() => handleEditar(produto.id)}>
                            <i className="bi bi-pencil-square"></i> Editar
                          </button>
                          <button
                            className={`btn btn-sm ${produto.ativo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                            onClick={() => handleHabilitarInabilitar(produto.id)}
                          >
                            <i className={`bi ${produto.ativo ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                            {produto.ativo ? ' Inativar' : ' Ativar'}
                          </button>
                          <button 
                            className="btn btn-info btn-sm d-flex align-items-center gap-1"
                            onClick={() => navigate(`/produtos/visualizar/${produto.id}`)}
                          >
                            <i className="bi bi-eye-fill"></i> Vizualizar
                          </button>
                        </>
                      )}

                      {/* Ação visível apenas para estoquistas */}
                      {usuario?.grupo === 'ESTOQUISTA' && (
                        <button className="btn btn-warning btn-sm" onClick={() => handleEditar(produto.id)}>
                          <i className="bi bi-pencil-square"></i> Editar Estoque
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {/* Mensagem se não houver produtos */}
              {produtos.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-3">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>Página {paginaAtual + 1} de {totalPaginas}</div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handlePaginaAnterior}
              disabled={paginaAtual === 0}
            >
              <i className="bi bi-chevron-left"></i> Anterior
            </button>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleProximaPagina}
              disabled={paginaAtual >= totalPaginas - 1}
            >
              Próxima <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </BackofficeLayout>
  );
};

export default ProdutosPage;
