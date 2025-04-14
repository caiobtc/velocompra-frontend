import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AlertUtils from '../utils/alerts';
import NavbarLoja from '../components/NavbarLoja.jsx';

const ClienteCadastroPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    genero: '',
    dataNascimento: '',
    cep: '',
    numero: '',
    complemento: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.senha !== form.confirmarSenha) {
      AlertUtils.aviso('As senhas não conferem!');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nome: form.nome,
        cpf: form.cpf,
        email: form.email,
        senha: form.senha,
        confirmarSenha: form.confirmarSenha,
        genero: form.genero,
        dataNascimento: form.dataNascimento,
        enderecoFaturamento: {
          cep: form.cep,
          numero: form.numero,
          complemento: form.complemento
        },
        enderecosEntrega: []
      };

      await api.post('/clientes/cadastrar', payload);
      AlertUtils.sucesso('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      AlertUtils.erro(err?.response?.data || 'Erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <NavbarLoja />
    <div className="container mt-5 mb-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-uppercase text-primary">Criar Conta</h2>
      </div>

      <div className="card shadow p-4 mx-auto" style={{ maxWidth: 700, borderRadius: '12px' }}>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label>Nome completo*</label>
              <input type="text" className="form-control" name="nome" value={form.nome} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label>CPF*</label>
              <input type="text" className="form-control" name="cpf" value={form.cpf} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label>Gênero*</label>
              <select className="form-select" name="genero" value={form.genero} onChange={handleChange} required>
                <option value="">Selecione</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>
                <option value="OUTROS">Outros</option>
              </select>
            </div>
            <div className="col-md-6">
              <label>Data de nascimento*</label>
              <input type="date" className="form-control" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label>Email*</label>
              <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label>CEP*</label>
              <input type="text" className="form-control" name="cep" value={form.cep} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label>Número*</label>
              <input type="text" className="form-control" name="numero" value={form.numero} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label>Complemento</label>
              <input type="text" className="form-control" name="complemento" value={form.complemento} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label>Senha*</label>
              <input type="password" className="form-control" name="senha" value={form.senha} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label>Confirmar senha*</label>
              <input type="password" className="form-control" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} required />
            </div>
          </div>

          <div className="text-center mt-4">
            <button type="submit" className="btn btn-primary btn-lg px-5 w-100" disabled={loading}>
              {loading ? 'Cadastrando...' : 'CONTINUAR'}
            </button>
          </div>

          <div className="text-center mt-3">
            <small>Já possui cadastro?{' '}
              <span
                className="text-primary fw-bold"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/login')}
              >
                ENTRAR
              </span>
            </small>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default ClienteCadastroPage;
