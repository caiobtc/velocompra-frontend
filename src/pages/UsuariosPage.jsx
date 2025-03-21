import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import BackofficeLayout from '../components/BackofficeLayout';

const UsuariosPage = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [filtroNome, setFiltroNome] = useState('');

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const buscarUsuarios = async () => {
    try {
      const response = await api.get('/usuarios', {
        params: { nome: filtroNome }
      });
      console.log('Dados recebidos:', response.data); // Debug: Confirme o campo "ativo"
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleCadastrar = () => {
    navigate('/usuarios/cadastrar');
  };

  const handleEditar = (id) => {
    navigate(`/usuarios/editar/${id}`);
  };

  const handleAtivarInativar = async (id) => {
    const confirmacao = window.confirm('Tem certeza que deseja alterar o status deste usuário?');
    if (!confirmacao) return;

    try {
      await api.patch(`/usuarios/${id}/status`);
      buscarUsuarios();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  return (
      <BackofficeLayout>
        <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '15px' }}>
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

          <div className="input-group mb-3">
            <input
              type="text"
              placeholder="Filtrar por nome"
              className="form-control"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
            />
            <button className="btn btn-outline-primary" onClick={buscarUsuarios}>
              <i className="bi bi-search"></i> Buscar
            </button>
          </div>

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
                {usuarios.length > 0 ? (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td className="fw-semibold">{usuario.nome}</td>
                      <td>{usuario.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            usuario.grupo === 'ADMINISTRADOR' ? 'bg-danger' : 'bg-secondary'
                          }`}
                        >
                          {usuario.grupo}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${usuario.ativo ? 'bg-success' : 'bg-danger'}`}
                        >
                          {usuario.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-warning btn-sm d-flex align-items-center gap-1"
                            onClick={() => handleEditar(usuario.id)}
                          >
                            <i className="bi bi-pencil-square"></i> Editar
                          </button>
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
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-3">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="text-end mt-3">
            <small className="text-muted">© 2024 Velocompra</small>
          </div>
        </div>
    </BackofficeLayout>
  );
};

export default UsuariosPage;
