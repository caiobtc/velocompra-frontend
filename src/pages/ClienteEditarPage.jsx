import { useState, useEffect } from 'react';
import api from '../services/api';
import AlertUtils from '../utils/alerts';
import NavbarLoja from '../components/NavbarLoja';

const ClienteEditarPage = () => {
  const [form, setForm] = useState({
    nome: '',
    dataNascimento: '',
    genero: '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
    enderecoFaturamento: {
      cep: '',
      numero: '',
      complemento: ''
    }
  });

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await api.get('/clientes/meus-dados');
        const {
          nomeCompleto,
          dataNascimento,
          genero,
          enderecoFaturamento
        } = response.data;

        const dataFormatada = new Date(dataNascimento).toISOString().split('T')[0];

        setForm(prev => ({
          ...prev,
          nome: nomeCompleto,
          dataNascimento: dataFormatada,
          genero,
          enderecoFaturamento: {
            cep: enderecoFaturamento.cep || '',
            numero: enderecoFaturamento.numero || '',
            complemento: enderecoFaturamento.complemento || ''
          }
        }));
      } catch (error) {
        AlertUtils.erro('Erro ao carregar dados do cliente.');
      }
    };

    fetchDados();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.novaSenha !== form.confirmarSenha) return AlertUtils.aviso('As senhas não coincidem.');
    try {
      await api.put('/clientes/meus-dados', form);
      AlertUtils.sucesso('Dados atualizados com sucesso!');
    } catch (error) {
      AlertUtils.erro(error?.response?.data || 'Erro ao atualizar dados.');
    }
  };

  return (
    <>
      <NavbarLoja />
      <div className="container mt-5">
        <h3 className="mb-4 text-primary text-center">Editar Meus Dados</h3>
        <form className="card shadow p-4 mx-auto" style={{ maxWidth: 600 }} onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Nome Completo</label>
            <input name="nome" className="form-control" value={form.nome} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Data de Nascimento</label>
            <input type="date" name="dataNascimento" className="form-control" value={form.dataNascimento} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Gênero</label>
            <select name="genero" className="form-control" value={form.genero} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMININO">Feminino</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>

          <h5 className="mt-4">Endereço de Faturamento</h5>
          <div className="mb-3">
            <label>CEP</label>
            <input
              type="text"
              name="cep"
              className="form-control"
              value={form.enderecoFaturamento.cep}
              onChange={handleEnderecoChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Número</label>
            <input
              type="text"
              name="numero"
              className="form-control"
              value={form.enderecoFaturamento.numero}
              onChange={handleEnderecoChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Complemento</label>
            <input
              type="text"
              name="complemento"
              className="form-control"
              value={form.enderecoFaturamento.complemento}
              onChange={handleEnderecoChange}
            />
          </div>

          <hr />
          <h5>Alterar Senha</h5>
          <div className="mb-3">
            <label>Senha Atual</label>
            <input type="password" name="senhaAtual" className="form-control" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Nova Senha</label>
            <input type="password" name="novaSenha" className="form-control" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Confirmar Nova Senha</label>
            <input type="password" name="confirmarSenha" className="form-control" onChange={handleChange} />
          </div>
          <button className="btn btn-success w-100">Salvar Alterações</button>
        </form>
      </div>
    </>
  );
};

export default ClienteEditarPage;
