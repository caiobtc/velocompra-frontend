// Importa hooks do React e utilitários da aplicação
import { useEffect, useState } from 'react'; // Hook de efeito colateral e estado
import { useNavigate, useParams } from 'react-router-dom'; // Navegação e parâmetros da URL
import api from '../services/api.js'; // Módulo de comunicação com a API backend
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ícones do Bootstrap
import BackofficeLayout from '../components/BackofficeLayout'; // Layout padrão da área administrativa
import AlertUtils from '../utils/alerts.js'; // Utilitário para exibir alertas

// Componente da página de edição de usuários
const UsuariosEditarPage = () => {
  const navigate = useNavigate(); // Hook para redirecionamento de rotas
  const { id } = useParams(); // Obtém o ID do usuário pela URL

  // Estados controlados para os campos do formulário
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [grupo, setGrupo] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Hook de efeito: executa ao carregar a página ou quando o ID mudar
  useEffect(() => {
    // Função assíncrona para buscar os dados do usuário
    const carregarUsuario = async () => {
      try {
        const response = await api.get(`/usuarios/${id}`); // Busca o usuário pelo ID
        const usuario = response.data; // Extrai os dados

        // Atualiza os campos com os dados recebidos
        setNome(usuario.nome);
        setCpf(usuario.cpf);
        setGrupo(usuario.grupo);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        AlertUtils.erro('Erro ao carregar usuário. Verifique o console.');
      }
    };

    carregarUsuario(); // Chama a função de carregamento
  }, [id]); // Dependência do efeito: roda quando o `id` mudar

  // Função de validação de CPF (padrão brasileiro)
  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false; // Verifica tamanho e repetição

    // Primeiro dígito verificador
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    // Segundo dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.substring(10, 11));
  };

  // Função que trata o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    // Validação: nome e CPF obrigatórios
    if (!nome.trim() || !cpf.trim()) {
      AlertUtils.aviso('Nome e CPF são obrigatórios!');
      return;
    }

    // Validação do CPF
    if (!validarCPF(cpf)) {
      AlertUtils.aviso('CPF inválido!');
      return;
    }

    // Validação de senha (se foi preenchida)
    if (senha && senha !== confirmarSenha) {
      AlertUtils.aviso('As senhas não coincidem!');
      return;
    }

    try {
      // Monta o objeto com os dados a serem enviados
      const payload = { nome, cpf, grupo };
      if (senha) payload.senha = senha; // Só envia senha se estiver preenchida

      await api.put(`/usuarios/${id}`, payload); // Atualiza o usuário via PUT

      AlertUtils.sucesso('Usuário atualizado com sucesso!');
      navigate('/usuarios'); // Redireciona para a lista de usuários
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      AlertUtils.erro('Erro ao atualizar usuário. Verifique o console.');
    }
  };

  // Função para cancelar e voltar
  const handleCancelar = () => {
    navigate('/usuarios'); // Redireciona para a lista de usuários
  };

  // JSX da interface
  return (
    <BackofficeLayout>
      <div className="d-flex justify-content-center">
        <div className="card shadow-lg p-5" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px' }}>
          <h3 className="fw-bold text-center mb-4">Editar Usuário</h3>

          <form onSubmit={handleSubmit}>
            {/* Campo: Nome */}
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

            {/* Campo: CPF */}
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

            {/* Campo: Grupo */}
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

            {/* Campo: Nova senha (opcional) */}
            <div className="mb-3">
              <label className="form-label">Nova Senha (opcional)</label>
              <input
                type="password"
                className="form-control"
                value={senha || ''}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            {/* Campo: Confirmação de nova senha */}
            <div className="mb-3">
              <label className="form-label">Confirmar Nova Senha</label>
              <input
                type="password"
                className="form-control"
                value={confirmarSenha || ''}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </div>

            {/* Botões de ação */}
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

// Exporta o componente para uso em outras partes do app
export default UsuariosEditarPage;
