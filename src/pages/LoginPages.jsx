import { useState, useContext } from 'react';
import api from '../services/api.js';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import AlertUtils from '../utils/alerts.js';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, senha });

      console.log('RESPONSE DATA:', response.data);

      login(response.data);
      navigate('/backoffice');
    } catch (error) {
      console.error('Erro no login:', error);

      if (error.response && error.response.status === 401) {
        AlertUtils.erro('Credenciais inválidas!');
      } else {
        AlertUtils.erro('Erro de conexão com o servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg border-0 p-5" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px' }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <h3 className="fw-bold mb-1"> <span className="text-primary">Backoffice</span> - Login</h3>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Digite seu email"
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
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <small className="text-muted">© 2024 Velocompra Backoffice</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
