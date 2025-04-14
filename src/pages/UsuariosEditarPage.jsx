import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import BackofficeLayout from '../components/BackofficeLayout';
import AlertUtils from '../utils/alerts.js';

const UsuariosEditarPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [grupo, setGrupo] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const response = await api.get(`/usuarios/${id}`);
        const usuario = response.data;

        setNome(usuario.nome);
        setCpf(usuario.cpf);
        setGrupo(usuario.grupo);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        AlertUtils.erro('Erro ao carregar usuário. Verifique o console.');
      }
    };

    carregarUsuario();
  }, [id]);

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome.trim() || !cpf.trim()) {
      AlertUtils.aviso('Nome e CPF são obrigatórios!');
      return;
    }

    if (!validarCPF(cpf)) {
      AlertUtils.aviso('CPF inválido!');
      return;
    }

    if (senha && senha !== confirmarSenha) {
      AlertUtils.aviso('As senhas não coincidem!');
      return;
    }

    try {
      const payload = { nome, cpf, grupo };
      if (senha) payload.senha = senha;

      await api.put(`/usuarios/${id}`, payload);

      AlertUtils.sucesso('Usuário atualizado com sucesso!');
      navigate('/usuarios');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      AlertUtils.erro('Erro ao atualizar usuário. Verifique o console.');
    }
  };

  const handleCancelar = () => {
    navigate('/usuarios');
  };

  return (
    <BackofficeLayout>
      <div className="d-flex justify-content-center">
        <div className="card shadow-lg p-5" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px' }}>
          <h3 className="fw-bold text-center mb-4">Editar Usuário</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                value={nome || ''}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">CPF</label>
              <input
                type="text"
                className="form-control"
                value={cpf || ''}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Grupo</label>
              <select
                className="form-select"
                value={grupo || ''}
                onChange={(e) => setGrupo(e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                <option value="ESTOQUISTA">ESTOQUISTA</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Nova Senha (opcional)</label>
              <input
                type="password"
                className="form-control"
                value={senha || ''}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirmar Nova Senha</label>
              <input
                type="password"
                className="form-control"
                value={confirmarSenha || ''}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-success btn-lg">
                <i className="bi bi-save me-2"></i> Salvar
              </button>

              <button type="button" className="btn btn-outline-danger btn-lg" onClick={handleCancelar}>
                <i className="bi bi-arrow-left me-2"></i> Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </BackofficeLayout>
  );
};

export default UsuariosEditarPage;
