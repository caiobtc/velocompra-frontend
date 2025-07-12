// Hooks do React: useState para estados e useNavigate para navegação entre páginas
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Instância do Axios customizada para chamadas à API
import api from '../services/api';

// Utilitários para mostrar alertas de sucesso, erro ou aviso
import AlertUtils from '../utils/alerts';

// Componente de navegação superior da loja (navbar do cliente)
import NavbarLoja from '../components/NavbarLoja.jsx';

// Componente da página de cadastro do cliente
const ClienteCadastroPage = () => {
  // Hook para redirecionar usuário entre rotas
  const navigate = useNavigate();

  // Estado que armazena os dados do formulário
  const [form, setForm] = useState({ // Inicializa o estado 'form' com valores padrão e função 'setForm' para atualizá-lo
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
    logradouro: '',
    bairro: '',
    cidade: '',
    uf: ''
  });

  // Estado booleano para indicar se está carregando (ex: botão desabilitado)
  const [loading, setLoading] = useState(false); // Inicializa o estado 'loading' como falso para controlar o estado de carregamento

  // Atualiza campos do formulário conforme usuário digita
  const handleChange = (e) => { // Função para lidar com a mudança nos campos do formulário
    const { name, value } = e.target; // Extrai o nome e o valor do campo do evento
    setForm({ ...form, [name]: value }); // Atualiza o estado 'form' com o novo valor do campo
  };

  // Função que busca os dados do CEP (logradouro, bairro, cidade...) via API
  const buscarCep = async () => {
    try {
      const cepLimpo = form.cep.replace(/\D/g, ''); // remove caracteres não numéricos
      const { data } = await api.get(`/viacep/${cepLimpo}`); // chamada backend (que consulta o ViaCep)

      // Atualiza os campos de endereço automaticamente se o CEP for encontrado
      setForm(prev => ({
        ...prev,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.cidade || '',
        uf: data.uf || ''
      }));
    } catch {
      // Caso o CEP seja inválido ou não encontrado, exibe erro
      AlertUtils.erro('CEP inválido ou não encontrado.');
    }
  };

  // Função chamada ao enviar o formulário de cadastro
  const handleSubmit = async (e) => {
    e.preventDefault(); // impede o recarregamento da página padrão do formulário

    // Verifica se a senha e confirmação estão iguais
    if (form.senha !== form.confirmarSenha) {
      AlertUtils.aviso('As senhas não conferem!');
      return;
    }

    setLoading(true); // ativa o loading para bloquear o botão

    try {
      // Monta o objeto de endereço com base no preenchido
      const enderecoCompleto = {
        cep: form.cep,
        numero: form.numero,
        complemento: form.complemento,
        logradouro: form.logradouro,
        bairro: form.bairro,
        cidade: form.cidade,
        uf: form.uf,
        padrao: true // define como endereço principal
      };

      // Monta o corpo (payload) do cadastro de cliente
      const payload = {
        nome: form.nome,
        cpf: form.cpf,
        email: form.email,
        senha: form.senha,
        confirmarSenha: form.confirmarSenha,
        genero: form.genero,
        dataNascimento: form.dataNascimento,
        enderecoFaturamento: { ...enderecoCompleto }, // endereço principal
        enderecosEntrega: [enderecoCompleto] // lista com um endereço padrão de entrega
      };

      // Envia os dados via POST para o endpoint /clientes/cadastrar
      await api.post('/clientes/cadastrar', payload);

      // Em caso de sucesso: exibe sucesso e redireciona para login
      AlertUtils.sucesso('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      // Em caso de erro: exibe mensagem vinda do backend (se houver) ou genérica
      AlertUtils.erro(err?.response?.data || 'Erro ao cadastrar.');
    } finally {
      setLoading(false); // encerra loading
    }
  };

  // Renderização do componente na tela
  return (
    <>
      <NavbarLoja /> {/* Barra de navegação do topo */}

      {/* Container principal do formulário */}
      <div className="container mt-5 mb-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-uppercase text-primary">Criar Conta</h2>
        </div>

        {/* Card com o formulário */}
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: 700, borderRadius: '12px' }}>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Cada campo do formulário, agrupado em colunas */}
              {/* Nome e CPF */}
              <div className="col-md-6">
                <label>Nome completo*</label>
                <input type="text" className="form-control" name="nome" value={form.nome} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label>CPF*</label>
                <input type="text" className="form-control" name="cpf" value={form.cpf} onChange={handleChange} required />
              </div>

              {/* Gênero e data de nascimento */}
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

              {/* Email e CEP */}
              <div className="col-md-6">
                <label>Email*</label>
                <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label>CEP*</label>
                <input type="text" className="form-control" name="cep" value={form.cep} onChange={handleChange} onBlur={buscarCep} required />
              </div>

              {/* Endereço: logradouro, bairro, cidade, UF (preenchidos automaticamente e só leitura) */}
              <div className="col-md-6">
                <label>Logradouro</label>
                <input type="text" className="form-control" name="logradouro" value={form.logradouro} readOnly />
              </div>
              <div className="col-md-6">
                <label>Bairro</label>
                <input type="text" className="form-control" name="bairro" value={form.bairro} readOnly />
              </div>
              <div className="col-md-6">
                <label>Cidade</label>
                <input type="text" className="form-control" name="cidade" value={form.cidade} readOnly />
              </div>
              <div className="col-md-6">
                <label>UF</label>
                <input type="text" className="form-control" name="uf" value={form.uf} readOnly />
              </div>

              {/* Número e complemento do endereço */}
              <div className="col-md-6">
                <label>Número*</label>
                <input type="text" className="form-control" name="numero" value={form.numero} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label>Complemento</label>
                <input type="text" className="form-control" name="complemento" value={form.complemento} onChange={handleChange} />
              </div>

              {/* Senha e confirmação */}
              <div className="col-md-6">
                <label>Senha*</label>
                <input type="password" className="form-control" name="senha" value={form.senha} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label>Confirmar senha*</label>
                <input type="password" className="form-control" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} required />
              </div>
            </div>

            {/* Botão de envio do formulário */}
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary btn-lg px-5 w-100" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </div>

            {/* Link para página de login, caso o cliente já tenha conta */}
            <div className="text-center mt-3">
              <small>Já possui cadastro?{' '}
                <button
                  className="text-primary fw-bold"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/cliente/login')}
                >
                  ENTRAR
                </button>
              </small>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// Exporta a página para uso no roteador
export default ClienteCadastroPage;
