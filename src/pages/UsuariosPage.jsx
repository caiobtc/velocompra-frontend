// Importa os hooks do React e bibliotecas necessárias
import { useEffect, useState } from 'react'; // useEffect para executar código após renderização; useState para controlar estado
import api from '../services/api.js'; // Serviço de comunicação com a API backend
import { useNavigate } from 'react-router-dom'; // Hook de navegação para redirecionar entre páginas
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ícones do Bootstrap
import BackofficeLayout from '../components/BackofficeLayout'; // Layout base do sistema administrativo
import AlertUtils from '../utils/alerts.js'; // Utilitário para exibir alertas

// Componente principal da página de listagem de usuários
const UsuariosPage = () => {
  const navigate = useNavigate(); // Hook para redirecionamento de páginas

  // Estado que armazena a lista de usuários retornados da API
  const [usuarios, setUsuarios] = useState([]);

  // Estado que armazena o nome digitado no campo de filtro
  const [filtroNome, setFiltroNome] = useState('');

  // useEffect executado uma única vez ao carregar a página
  useEffect(() => {
    buscarUsuarios(); // Executa a função de busca
  }, []);

  // Função para buscar usuários no backend com filtro de nome
  const buscarUsuarios = async () => {
    try {
      // Requisição GET com query param 'nome' para filtrar usuários
      const response = await api.get('/usuarios', {
        params: { nome: filtroNome }
      });
      setUsuarios(response.data); // Atualiza o estado com os usuários retornados
    } catch (error) {
      console.error('Erro ao buscar usuários:', error); // Mostra erro no console
      AlertUtils.erro('Erro ao buscar usuários.'); // Alerta visual para o usuário
    }
  };

  // Redireciona para a página de cadastro de um novo usuário
  const handleCadastrar = () => {
    navigate('/usuarios/cadastrar');
  };

  // Redireciona para a página de edição de um usuário
  const handleEditar = (id) => {
    navigate(`/usuarios/editar/${id}`);
  };

  // Ativa ou inativa o usuário após confirmação do alerta
  const handleAtivarInativar = async (id) => {
    // Exibe caixa de confirmação
    const confirmacao = await AlertUtils.confirmar('Tem certeza que deseja alterar o status deste usuário?');

    // Se o usuário cancelar, a função retorna sem fazer nada
    if (!confirmacao) return;

    try {
      // Chamada à API para atualizar o status (ativo/inativo)
      await api.patch(`/usuarios/${id}/status`);
      buscarUsuarios(); // Atualiza a lista após alteração
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      AlertUtils.erro('Erro ao atualizar status do usuário.');
    }
  };

  return (
    <BackofficeLayout>
      {/* Card visual para o conteúdo */}
      <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '15px' }}>
        {/* Cabeçalho com título e botão de novo usuário */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0 text-primary">
            <i className="bi bi-people-fill me-2"></i> Usuários Cadastrados
          </h2>
          <button
            className="btn btn-success btn-lg d-flex align-items-center gap-2"
            onClick={handleCadastrar}
          >
            <i className="bi bi-plus-circle"></i> Novo Usuário
          </button>
        </div>

        {/* Campo de filtro + botão de busca */}
        <div className="input-group mb-3">
          <input
            type="text"
            placeholder="Filtrar por nome"
            className="form-control"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)} // Atualiza filtro conforme usuário digita
          />
          <button className="btn btn-outline-primary" onClick={buscarUsuarios}>
            <i className="bi bi-search"></i> Buscar
          </button>
        </div>

        {/* Tabela de usuários */}
        <div className="table-responsive">
          <table className="table table-hover align-middle text-center">
            <thead className="table-primary">
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Email</th>
                <th scope="col">Grupo</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {/* Se houver usuários, mapeia e exibe cada um */}
              {usuarios.length > 0 ? (
                usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td className="fw-semibold">{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>
                      {/* Exibe o grupo com badge colorido */}
                      <span
                        className={`badge ${
                          usuario.grupo === 'ADMINISTRADOR' ? 'bg-danger' : 'bg-secondary'
                        }`}
                      >
                        {usuario.grupo}
                      </span>
                    </td>
                    <td>
                      {/* Badge para status ativo/inativo */}
                      <span
                        className={`badge ${usuario.ativo ? 'bg-success' : 'bg-danger'}`}
                      >
                        {usuario.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        {/* Botão de editar */}
                        <button
                          className="btn btn-warning btn-sm d-flex align-items-center gap-1"
                          onClick={() => handleEditar(usuario.id)}
                        >
                          <i className="bi bi-pencil-square"></i> Editar
                        </button>

                        {/* Botão de ativar/inativar */}
                        <button
                          className={`btn btn-sm d-flex align-items-center gap-1 ${
                            usuario.ativo
                              ? 'btn-outline-danger'
                              : 'btn-outline-success'
                          }`}
                          onClick={() => handleAtivarInativar(usuario.id)}
                        >
                          <i
                            className={`bi ${
                              usuario.ativo ? 'bi-person-dash' : 'bi-person-check'
                            }`}
                          ></i>
                          {usuario.ativo ? 'Inativar' : 'Ativar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // Se não houver usuários, mostra linha única com mensagem
                <tr>
                  <td colSpan="5" className="text-center text-muted py-3">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé da tela */}
        <div className="text-end mt-3">
          <small className="text-muted">© 2024 Velocompra</small>
        </div>
      </div>
    </BackofficeLayout>
  );
};

// Exporta o componente para ser utilizado na aplicação
export default UsuariosPage;
