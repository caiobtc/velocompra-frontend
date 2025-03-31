import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { formatCurrency } from '../utils/formatters.js';
import AlertUtils from '../utils/alerts';
import 'bootstrap-icons/font/bootstrap-icons.css';
import BackofficeLayout from '../components/BackofficeLayout';

const ProdutosPage = () => {
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  const [produtos, setProdutos] = useState([]);
  const [filtroNome, setFiltroNome] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const tamanhoPagina = 10;

  useEffect(() => {
    buscarProdutos();
  }, [paginaAtual]);

  const buscarProdutos = async () => {
    try {
      const response = await api.get('/produtos/admin', {
        params: {
          nome: filtroNome,
          page: paginaAtual,
          size: tamanhoPagina,
        },
      });

      setProdutos(response.data.content);
      setTotalPaginas(response.data.totalPages);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      AlertUtils.erro('Erro ao buscar produtos. Veja o console.');
    }
  };

  const handleBuscar = () => {
    setPaginaAtual(0);
    buscarProdutos();
  };

  const handleCadastrar = () => {
    navigate('/produtos/cadastrar');
  };

  const handleEditar = (id) => {
    navigate(`/produtos/editar/${id}`);
  };

  const handleHabilitarInabilitar = async (id) => {
    const confirmacao = await AlertUtils.confirmar('Tem certeza que deseja alterar o status deste produto?');
    if (!confirmacao) return;

    try {
      await api.patch(`/produtos/${id}/status`);
      buscarProdutos();
    } catch (error) {
      console.error('Erro ao atualizar status do produto:', error);
      AlertUtils.erro('Erro ao atualizar status do produto.');
    }
  };

  const handlePaginaAnterior = () => {
    if (paginaAtual > 0) setPaginaAtual(paginaAtual - 1);
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas - 1) setPaginaAtual(paginaAtual + 1);
  };


  return (
    <BackofficeLayout>
      <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '15px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0 text-primary">
            <i className="bi bi-box-seam me-2"></i> Produtos Cadastrados
          </h2>

          {usuario?.grupo === 'ADMINISTRADOR' && (
            <button className="btn btn-success btn-lg d-flex align-items-center gap-2" onClick={handleCadastrar}>
              <i className="bi bi-plus-circle"></i> Novo Produto
            </button>
          )}
        </div>

        {/* Filtro de busca */}
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

        {/* Tabela */}
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
                            onClick={() => navigate(`/produtos/visualizar/${produto.id}`)}>
                            <i className="bi bi-eye-fill"></i> Vizualizar
                          </button>
                          
                        </>
                      )}

                      {usuario?.grupo === 'ESTOQUISTA' && (
                        <button className="btn btn-warning btn-sm" onClick={() => handleEditar(produto.id)}>
                          <i className="bi bi-pencil-square"></i> Editar Estoque
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

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
