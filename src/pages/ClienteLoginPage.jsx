import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AlertUtils from '../utils/alerts';
import NavbarLoja from '../components/NavbarLoja';

const ClienteLoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Alterado para o endpoint exclusivo de login de cliente
      const response = await api.post('/auth/login-cliente', form);

      const { token, grupo, nome } = response.data;

      if (grupo === 'CLIENTE') {
        localStorage.setItem('token', token);
        localStorage.setItem('nome', nome);
        localStorage.setItem('grupo', grupo);
        AlertUtils.sucesso('Login realizado com sucesso!');
        navigate('/loja');
      } else {
        AlertUtils.aviso('Apenas clientes podem logar por aqui.');
      }

    } catch (error) {
      AlertUtils.erro(error?.response?.data || 'Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarLoja />
      <div className="container mt-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Login do Cliente</h2>
        </div>

        <div className="card shadow p-4 mx-auto" style={{ maxWidth: 500 }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Senha</label>
              <input
                type="password"
                className="form-control"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'ENTRAR'}
            </button>

            <div className="text-center mt-3">
              <small>
                Ainda não tem conta?{' '}
                <span
                  className="text-primary fw-bold"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/cadastro')}
                >
                  Criar Conta
                </span>
              </small>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ClienteLoginPage;
