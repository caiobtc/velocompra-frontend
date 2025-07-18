// Importa os hooks do React para estado e efeitos colaterais
import { useEffect, useState } from 'react';
// Importa o cliente de requisições HTTP
import api from '../services/api';
// Importa utilitários de alerta (sucesso, erro, aviso)
import AlertUtils from '../utils/alerts';
// Importa a navbar da loja
import NavbarLoja from '../components/NavbarLoja.jsx';

const ClienteEditarPage = () => {
  // Estado do formulário com dados pessoais e endereços do cliente
  const [form, setForm] = useState({
    nome: '',
    email: '',
    cpf: '',
    dataNascimento: '',
    genero: '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
    enderecoFaturamento: {
      cep: '',
      numero: '',
      complemento: ''
    },
    enderecosEntrega: [],
    novoEndereco: null // Estado para cadastro de novo endereço
  });

  // Efeito para buscar os dados do cliente ao carregar a página
  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await api.get('/clientes/meus-dados'); // Chamada para backend
        const {
          nomeCompleto,
          email,
          cpf,
          dataNascimento,
          genero,
          enderecoFaturamento,
          enderecosEntrega
        } = response.data;

        const dataFormatada = new Date(dataNascimento).toISOString().split('T')[0]; // Formata data para input

        // Atualiza os dados no formulário
        setForm(prev => ({
          ...prev,
          nome: nomeCompleto,
          email,
          cpf,
          dataNascimento: dataFormatada,
          genero,
          enderecoFaturamento: enderecoFaturamento ? {
            cep: enderecoFaturamento.cep || '',
            numero: enderecoFaturamento.numero || '',
            complemento: enderecoFaturamento.complemento || ''
          } : {
            cep: '',
            numero: '',
            complemento: ''
          },
          enderecosEntrega: enderecosEntrega || []
        }));
      } catch (error) {
        AlertUtils.erro('Erro ao carregar dados do cliente.');
      }
    };

    fetchDados(); // Executa a busca
  }, []); // Roda apenas uma vez

  // Atualiza o campo diretamente no formulário principal
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Atualiza o endereço de faturamento
  const handleEnderecoChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      enderecoFaturamento: {
        ...prev.enderecoFaturamento,
        [name]: value
      }
    }));
  };

  // Salva dados básicos do cliente (nome, data, gênero, senha)
  const salvarDadosBasicos = async e => {
    e.preventDefault();

    // Valida se nova senha e confirmação coincidem
    if (form.novaSenha && form.novaSenha !== form.confirmarSenha) {
      return AlertUtils.aviso('As senhas não coincidem.');
    }

    try {
      const payload = {
        nome: form.nome,
        dataNascimento: form.dataNascimento,
        genero: form.genero,
        senhaAtual: form.senhaAtual,
        novaSenha: form.novaSenha
      };

      await api.put('/clientes/meus-dados', payload); // Envia PUT para atualizar
      AlertUtils.sucesso('Dados pessoais atualizados com sucesso!');
    } catch (error) {
      AlertUtils.erro(error?.response?.data || 'Erro ao atualizar dados.');
    }
  };

  // Salva novo endereço de entrega
  const salvarEnderecos = async e => {
    e.preventDefault();
  
    // Valida se o CEP é válido
    if (!form.novoEndereco?.cep || form.novoEndereco.cep.length !== 8) {
      return AlertUtils.erro('CEP inválido ou vazio.');
    }
  
    try {
      // Envia o novo endereço para o backend
      await api.post('/clientes/enderecos-entrega', form.novoEndereco);
  
      AlertUtils.sucesso('Endereço cadastrado com sucesso!');
      // Atualiza localmente a lista e reseta o formulário de novo endereço
      setForm(prev => ({
        ...prev,
        novoEndereco: null,
        enderecosEntrega: [...prev.enderecosEntrega, form.novoEndereco]
      }));
    } catch (error) {
      AlertUtils.erro(error?.response?.data || 'Erro ao cadastrar endereço.');
    }
  };

  // Alterna a visibilidade do formulário de novo endereço
  const toggleNovoEndereco = () => {
    setForm(prev => ({
      ...prev,
      novoEndereco: prev.novoEndereco ? null : {
        cep: '',
        numero: '',
        complemento: '',
        logradouro: '',
        bairro: '',
        cidade: '',
        uf: '',
        padrao: false
      }
    }));
  };

  // Atualiza campos do novo endereço
  const handleNovoEnderecoChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      novoEndereco: {
        ...prev.novoEndereco,
        [name]: value
      }
    }));
  };

  // Consulta dados do endereço a partir do CEP
  const buscarCep = async () => {
    const cepLimpo = form.novoEndereco.cep.replace(/\D/g, '');  // Remove caracteres não numéricos
    if (cepLimpo.length === 8) {
      try {
        const { data } = await api.get(`/viacep/${cepLimpo}`);
        setForm(prev => ({
          ...prev,
          novoEndereco: {
            ...prev.novoEndereco,
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.cidade|| '',  
            uf: data.uf || ''
          }
        }));
      } catch {
        AlertUtils.erro('CEP inválido ou não encontrado.');
      }
    } else {
      AlertUtils.erro('CEP inválido, deve conter 8 caracteres.');
    }
  };

  // Define um endereço como o padrão da lista
  const definirEnderecoPadrao = (index) => {
    setForm(prev => ({
      ...prev,
      enderecosEntrega: prev.enderecosEntrega.map((e, i) => ({
        ...e,
        padrao: i === index // Apenas o endereço clicado será padrão
      }))
    }));
  };

  // Interface da página
  return (
    <>
      <NavbarLoja />
      <div className="container mt-5">
        <div className="row">
          {/* Seção de dados pessoais */}
          <section className="col-md-6 mb-4">
            <div className="card shadow p-4">
              <h4 className="fw-bold text-uppercase text-primary"> <i className="bi bi-file-earmark-text-fill"></i> Dados básicos </h4>
              
              {/* Campo: nome */}
              <div className="mb-2">
                <label>Nome Completo</label>
                <input name="nome" value={form.nome} onChange={handleChange} className="form-control mb-3" placeholder="Nome Completo" />
              </div>

              {/* Campo: data de nascimento */}
              <div className="mb-2">
                <label>Data de nascimento</label>
                <input type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} className="form-control mb-3" />
              </div>

              {/* Campo: gênero */}
              <div className="mb-2">
                <label>Gênero</label>
                <select name="genero" value={form.genero} onChange={handleChange} className="form-control mb-3">
                  <option value="">Selecione o Gênero</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>

              {/* CPF e Email são apenas leitura */}
              <div className="mb-2">
                <label>CPF <i className="bi bi-lock-fill text-secondary"></i></label>
                <input disabled value={form.cpf} className="form-control" />
              </div>

              <div className="mb-2">
                <label>Email <i className="bi bi-lock-fill text-secondary"></i></label>
                <input disabled value={form.email} className="form-control" />
              </div>

              {/* Campos para troca de senha */}
              <h5>Alterar Senha</h5>
              <input type="password" name="senhaAtual" onChange={handleChange} className="form-control mb-2" placeholder="Senha Atual" />
              <input type="password" name="novaSenha" onChange={handleChange} className="form-control mb-2" placeholder="Nova Senha" />
              <input type="password" name="confirmarSenha" onChange={handleChange} className="form-control mb-2" placeholder="Confirmar Nova Senha" />

              <div className="text-end mt-3">
                <button onClick={salvarDadosBasicos} className="btn btn-success px-4">Salvar Dados</button>
              </div>
            </div>
          </section>

          {/* Seção de endereços */}
          <section className="col-md-6 mb-4">
            <div className="card shadow p-4">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="fw-bold text-uppercase text-primary"><i className="bi bi-geo-alt-fill"></i> Endereços </h4>
                <button type="button" className="btn btn-link text-decoration-none text-primary" onClick={toggleNovoEndereco}>
                  + CADASTRAR NOVO ENDEREÇO
                </button>
              </div>

              {/* Lista de endereços cadastrados */}
              {form.enderecosEntrega.map((e, i) => (
                <div key={i} className="border p-3 mb-3 bg-light rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{e.padrao ? 'Endereço Principal' : 'Endereço'}</strong>
                      <div>{e.logradouro}</div>
                      <div>Número: {e.numero}, {e.complemento}</div>
                      <div>CEP {e.cep} - {e.cidade}, {e.uf}</div>
                    </div>
                    <div className="d-flex gap-2">
                      {/* Botão para tornar padrão se ainda não for */}
                      {!e.padrao && (
                        <button type="button" className="btn btn-sm btn-outline-success" onClick={() => definirEnderecoPadrao(i)}>
                          Tornar padrão
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Formulário de novo endereço */}
              {form.novoEndereco && (
                <div className="mt-4">
                  <h5>Cadastrar Novo Endereço</h5>
                  <input name="cep" value={form.novoEndereco?.cep || ''} onChange={handleNovoEnderecoChange} onBlur={buscarCep} className="form-control mb-2" placeholder="CEP*" />
                  <input name="logradouro" value={form.novoEndereco.logradouro} readOnly className="form-control mb-2" placeholder="Logradouro" />
                  <div className="row">
                    <div className="col-md-6">
                      <input name="numero" value={form.novoEndereco.numero} onChange={handleNovoEnderecoChange} className="form-control mb-2" placeholder="Número*" />
                    </div>
                    <div className="col-md-6">
                      <input name="complemento" value={form.novoEndereco.complemento} onChange={handleNovoEnderecoChange} className="form-control mb-2" placeholder="Complemento" />
                    </div>
                  </div>
                  <input name="bairro" value={form.novoEndereco.bairro} readOnly className="form-control mb-2" placeholder="Bairro" />
                  <input name="cidade" value={form.novoEndereco.cidade} readOnly className="form-control mb-2" placeholder="Cidade" />
                  <input name="uf" value={form.novoEndereco.uf} readOnly className="form-control mb-2" placeholder="UF" />
                  <div className="form-check mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={form.novoEndereco.padrao || false}
                      onChange={(e) =>
                        setForm(prev => ({
                          ...prev,
                          novoEndereco: {
                            ...prev.novoEndereco,
                            padrao: e.target.checked
                          }
                        }))
                      }
                      id="padraoCheck"
                    />
                    <label className="form-check-label" htmlFor="padraoCheck">
                      Definir como padrão
                    </label>
                  </div>
                </div>
              )}

              <div className="text-end mt-3">
                <button onClick={salvarEnderecos} className="btn btn-success px-4">Salvar Endereços</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ClienteEditarPage;
