import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import BackofficeLayout from '../components/BackofficeLayout.jsx';

const UsuariosCadastrarPage = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [grupo, setGrupo] = useState('ESTOQUISTA');
  const [loading, setLoading] = useState(false);

  // Função para validar CPF simples (pode ser melhorada se quiser)
  const validarCPF = (cpf) => {
    return /^\d{11}$/.test(cpf.replace(/[^\d]/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCPF(cpf)) {
      alert('CPF inválido. Deve conter 11 dígitos.');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não conferem!');
      return;
    }

    const novoUsuario = {
      nome,
      cpf,
      email,
      senha,
      grupo
    };

    setLoading(true);

    try {
      await api.post('/usuarios', novoUsuario);
      alert('Usuário cadastrado com sucesso!');
      navigate('/usuarios');
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      alert(error?.response?.data || 'Erro ao cadastrar usuário!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackofficeLayout>
      <div className="d-flex justify-content-center">
        <div className="card shadow-lg p-5" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px' }}>
          <h3 className="fw-bold text-center mb-4">Cadastrar Usuário</h3>

          <form onSubmit={handleSubmit}>
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
              <label className="form-label">CPF</label>
              <input
                type="text"
                className="form-control"
                placeholder="Somente números"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirmar Senha</label>
              <input
                type="password"
                className="form-control"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Grupo</label>
              <select
                className="form-select"
                value={grupo}
                onChange={(e) => setGrupo(e.target.value)}
                required
              >
                <option value="ADMINISTRADOR">Administrador</option>
                <option value="ESTOQUISTA">Estoquista</option>
              </select>
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-success btn-lg" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
              <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/usuarios')}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </BackofficeLayout>  
  );
};

export default UsuariosCadastrarPage;
