// Importa os hooks e módulos necessários
import { useState } from 'react'; // Hook para gerenciar estados locais
import { useNavigate } from 'react-router-dom'; // Hook para navegação programática entre páginas
import api from '../services/api.js'; // Instância do Axios para fazer chamadas à API
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ícones do Bootstrap
import BackofficeLayout from '../components/BackofficeLayout.jsx'; // Layout base para páginas do backoffice
import AlertUtils from '../utils/alerts.js'; // Utilitários para exibir alertas customizados

// Componente principal da página de cadastro de usuários
const UsuariosCadastrarPage = () => {
  const navigate = useNavigate(); // Hook para redirecionamento de rota

  // Estados para armazenar os dados do formulário
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [grupo, setGrupo] = useState('ESTOQUISTA'); // Valor padrão é ESTOQUISTA
  const [loading, setLoading] = useState(false); // Estado para exibir feedback durante requisição

  // Função utilitária para validar o CPF (apenas checa se tem 11 dígitos)
  const validarCPF = (cpf) => {
    return /^\d{11}$/.test(cpf.replace(/[^\d]/g, '')); // Remove caracteres não numéricos e testa se restam 11 dígitos
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o comportamento padrão de envio do formulário

    // Validação do CPF
    if (!validarCPF(cpf)) {
      AlertUtils.aviso('CPF inválido. Deve conter 11 dígitos.');
      return;
    }

    // Verifica se as senhas coincidem
    if (senha !== confirmarSenha) {
      AlertUtils.aviso('As senhas não conferem!');
      return;
    }

    // Cria um objeto com os dados do novo usuário
    const novoUsuario = {
      nome,
      cpf,
      email,
      senha,
      grupo
    };

    setLoading(true); // Ativa o estado de carregamento (desabilita botão e exibe texto "Cadastrando...")

    try {
      await api.post('/usuarios', novoUsuario); // Envia os dados para a API
      AlertUtils.sucesso('Usuário cadastrado com sucesso!'); 
      navigate('/usuarios'); // Redireciona para a listagem de usuários após o sucesso
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      // Exibe mensagem de erro com fallback
      AlertUtils.erro(error?.response?.data || 'Erro ao cadastrar usuário!');
    } finally {
      setLoading(false); // Independente do resultado, encerra o estado de carregamento
    }
  };

  // JSX da página
  return (
    <BackofficeLayout>
      <div className="d-flex justify-content-center">
        <div className="card shadow-lg p-5" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px' }}>
          <h3 className="fw-bold text-center mb-4">Cadastrar Usuário</h3>

          {/* Formulário de cadastro */}
          <form onSubmit={handleSubmit}>
            {/* Campo: Nome */}
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

            {/* Campo: CPF */}
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

            {/* Campo: Email */}
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

            {/* Campo: Senha */}
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

            {/* Campo: Confirmar Senha */}
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

            {/* Campo: Grupo (Perfil) */}
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

            {/* Botões de ação */}
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

// Exporta o componente para uso externo
export default UsuariosCadastrarPage;
