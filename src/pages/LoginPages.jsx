// Importa hook useState para controle de estado local e useContext para acesso ao contexto
import { useState, useContext } from 'react';
// Importa cliente HTTP configurado para chamadas à API
import api from '../services/api.js';
// Importa o contexto de autenticação, que contém o método login
import { AuthContext } from '../contexts/AuthContext.jsx';
// Importa hook de navegação entre rotas
import { useNavigate } from 'react-router-dom';
// Importa utilitário para exibir alertas visuais (sucesso, erro, aviso)
import AlertUtils from '../utils/alerts.js';

// Componente funcional da página de login
const LoginPage = () => {
  // Obtém a função `login` do contexto de autenticação
  const { login } = useContext(AuthContext);
  // Hook para redirecionar o usuário após login
  const navigate = useNavigate();

  // Estados locais para os campos do formulário e o status de carregamento
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // Função chamada ao submeter o formulário de login
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita o recarregamento da página
    setLoading(true);   // Ativa o estado de carregamento

    try {
      // Envia os dados para o backend via POST na rota de login
      const response = await api.post('/auth/login', { email, senha });

      // Exibe a resposta no console para fins de depuração
      console.log('RESPONSE DATA:', response.data);

      // Salva os dados de autenticação no contexto
      login(response.data);

      // Redireciona para o dashboard do backoffice
      navigate('/backoffice');
    } catch (error) {
      // Em caso de erro na requisição, exibe no console
      console.error('Erro no login:', error);

      // Se a API retornar erro 401, alerta de credenciais inválidas
      if (error.response && error.response.status === 401) {
        AlertUtils.erro('Credenciais inválidas!');
      } else {
        // Para outros erros, exibe erro genérico de conexão
        AlertUtils.erro('Erro de conexão com o servidor.');
      }
    } finally {
      // Encerra o estado de carregamento em qualquer situação (sucesso ou erro)
      setLoading(false);
    }
  };

  // Retorna a interface visual da tela de login
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      {/* Card centralizado com padding e sombra */}
      <div className="card shadow-lg border-0 p-5" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px' }}>
        <div className="card-body">
          {/* Cabeçalho do formulário */}
          <div className="text-center mb-4">
            <h3 className="fw-bold mb-1">
              <span className="text-primary">Backoffice</span> - Login
            </h3>
          </div>

          {/* Formulário de login */}
          <form onSubmit={handleLogin}>
            {/* Campo de email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Atualiza estado do email
                required
              />
            </div>

            {/* Campo de senha */}
            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)} // Atualiza estado da senha
                required
              />
            </div>

            {/* Botão de login */}
            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading} // Desativa botão durante carregamento
              >
                {/* Altera o texto do botão se estiver carregando */}
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          {/* Rodapé com texto institucional */}
          <div className="text-center mt-3">
            <small className="text-muted">© 2024 Velocompra Backoffice</small>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporta o componente para ser utilizado nas rotas
export default LoginPage;
