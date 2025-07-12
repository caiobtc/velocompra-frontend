// Hooks do React e roteador para redirecionar páginas
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Instância personalizada do Axios para chamadas à API
import api from '../services/api';

// Utilitário para mostrar mensagens de alerta (sucesso, erro, aviso)
import AlertUtils from '../utils/alerts';

// Navbar visível na tela de login da loja
import NavbarLoja from '../components/NavbarLoja';

// Componente de Login do Cliente
const ClienteLoginPage = () => {
  const navigate = useNavigate(); // Hook para redirecionar usuário após login

  // Estado para armazenar os dados do formulário
  const [form, setForm] = useState({
    email: '',
    senha: ''
  });

  // Estado booleano para mostrar carregamento no botão de login
  const [loading, setLoading] = useState(false);

  // Atualiza o estado do formulário conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Função chamada ao submeter o formulário de login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede comportamento padrão de reload
    setLoading(true); // Ativa loading para desabilitar botão

    try {
      // Faz a requisição POST para /auth/login-cliente com o form (email, senha)
      const response = await api.post('/auth/login-cliente', form);

      // Extrai os dados retornados: token JWT, grupo e nome do usuário
      const { token, grupo, nome } = response.data;

      // Valida se o grupo retornado é CLIENTE antes de prosseguir
      if (grupo === 'CLIENTE') {
        // Salva dados essenciais no localStorage (token, nome e grupo)
        localStorage.setItem('token', token);
        localStorage.setItem('nome', nome);
        localStorage.setItem('grupo', grupo);

        // Mostra alerta de sucesso e redireciona para a loja
        AlertUtils.sucesso('Login realizado com sucesso!');
        navigate('/loja');
      } else {
        // Impede acesso por outros perfis
        AlertUtils.aviso('Apenas clientes podem logar por aqui.');
      }

    } catch (error) {
      // Se der erro (ex: senha inválida), mostra mensagem genérica ou a do backend
      AlertUtils.erro(error?.response?.data || 'Erro ao realizar login.');
    } finally {
      setLoading(false); // Finaliza carregamento
    }
  };

  // JSX com estrutura visual da tela
  return (
    <>
      <NavbarLoja /> {/* Navbar da loja visível mesmo na tela de login */}

      <div className="container mt-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">ACESSE SUA CONTA</h2>
        </div>

        {/* Card que contém o formulário */}
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: 500 }}>
          <form onSubmit={handleSubmit}>
            {/* Campo de e-mail */}
            <div className="mb-3">
              <label>E-mail</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person-fill"></i> {/* ícone de pessoa */}
                </span>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Campo de senha */}
            <div className="mb-3">
              <label>Senha</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock-fill"></i> {/* ícone de cadeado */}
                </span>
                <input
                  type="password"
                  className="form-control"
                  name="senha"
                  value={form.senha}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Botão de login */}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'ENTRAR'}
            </button>

            {/* Link para tela de cadastro */}
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

// Exporta o componente
export default ClienteLoginPage;
