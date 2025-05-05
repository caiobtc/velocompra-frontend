import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertUtils from '../utils/alerts.js';
import NavbarLoja from '../components/NavbarLoja.jsx';

const ClientePagamentoPage = () => {
  const navigate = useNavigate();

  const [formaPagamento, setFormaPagamento] = useState('');
  const [cartaoNumero, setCartaoNumero] = useState('');
  const [cartaoNome, setCartaoNome] = useState('');
  const [cartaoValidade, setCartaoValidade] = useState('');
  const [cartaoCVV, setCartaoCVV] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [apelido, setApelido] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  // Função para tratar a mudança na forma de pagamento
  const handlePagamentoChange = (e) => {
    setFormaPagamento(e.target.value);
  };

  // Função para tratar a mudança nos campos do cartão de crédito
  const handleCartaoChange = (e) => {
    const { name, value } = e.target;
    if (name === 'numero') setCartaoNumero(value.replace(/\D/g, '')); // Aceitar apenas números
    if (name === 'nome') setCartaoNome(value.replace(/[^a-zA-Z\s]/g, '')); // Aceitar apenas letras
    if (name === 'cvv') setCartaoCVV(value.replace(/\D/g, '')); // Aceitar apenas números
    if (name === 'cpfCnpj') setCpfCnpj(value.replace(/\D/g, '')); // Aceitar apenas números
    if (name === 'apelido') setApelido(value.replace(/[^a-zA-Z\s]/g, '')); // Aceitar apenas letras
    if (name === 'dataNascimento') setDataNascimento(value);
    if (name === 'validade') {
      let onlyNumbers = value.replace(/\D/g, '').slice(0, 4);
      if (onlyNumbers.length >= 3) {
        onlyNumbers = onlyNumbers.slice(0, 2) + '/' + onlyNumbers.slice(2);
      }
      setCartaoValidade(onlyNumbers);
    }
  };

  // Função para processar o pagamento
  const processarPagamento = () => {
    // Validação dos dados do pagamento
    if (!formaPagamento) {
      AlertUtils.aviso('Por favor, selecione uma forma de pagamento.');
      return;
    }

    if (formaPagamento === 'cartao') {
      if (!cartaoNumero || !cartaoNome || !cartaoValidade || !cartaoCVV || !cpfCnpj || !dataNascimento) {
        AlertUtils.aviso('Por favor, preencha todos os dados do cartão de crédito.');
        return;
      }
      // Validação do formato dos campos (exemplo)
      if (cartaoNumero.length !== 16) {
        AlertUtils.aviso('O número do cartão deve ter 16 dígitos.');
        return;
      }
      if (cartaoCVV.length !== 3) {
        AlertUtils.aviso('O código de verificação (CVV) deve ter 3 dígitos.');
        return;
      }
      if (!/\d{2}\/\d{2}/.test(cartaoValidade)) {
        AlertUtils.aviso('Data de validade inválida.');
        return;
      }
      if (cpfCnpj.length < 11 || cpfCnpj.length > 14) {
        AlertUtils.aviso('CPF/CNPJ inválido.');
        return;
      }
    }

    // Lógica de envio para o backend para processar o pagamento
    //AlertUtils.sucesso('Pagamento realizado com sucesso!');
    navigate('/resumo-pedido'); // Navega para a página de confirmação do pedido
  };

  return (
    <>
      <NavbarLoja />
      <div className="container py-5">
        <h2 className="fw-bold mb-4 text-center">💳 Escolha a Forma de Pagamento</h2>

        <div className="card p-4 shadow-sm">
          <h5 className="fw-bold mb-3">Escolha a Forma de Pagamento</h5>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="pagamentoCartao"
              name="formaPagamento"
              value="cartao"
              checked={formaPagamento === 'cartao'}
              onChange={handlePagamentoChange}
            />
            <label className="form-check-label" htmlFor="pagamentoCartao">
              Cartão de Crédito
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="pagamentoBoleto"
              name="formaPagamento"
              value="boleto"
              checked={formaPagamento === 'boleto'}
              onChange={handlePagamentoChange}
            />
            <label className="form-check-label" htmlFor="pagamentoBoleto">
              Boleto Bancário
            </label>
          </div>

          {/* Formulário para Cartão de Crédito */}
          {formaPagamento === 'cartao' && (
            <>
              <div className="mt-4">
                <h6 className="fw-bold">Dados do Cartão</h6>

                <div className="mb-3">
                  <label htmlFor="numero" className="form-label">Número do Cartão</label>
                  <input
                    type="text"
                    id="numero"
                    name="numero"
                    value={cartaoNumero}
                    onChange={handleCartaoChange}
                    className="form-control"
                    placeholder="Digite o número do cartão"
                    maxLength="16"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="nome" className="form-label">Nome Impresso no Cartão</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={cartaoNome}
                    onChange={handleCartaoChange}
                    className="form-control"
                    placeholder="Nome como aparece no cartão"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="validade" className="form-label">Validade</label>
                  <input
                    type="text"
                    id="validade"
                    name="validade"
                    value={cartaoValidade}
                    onChange={handleCartaoChange}
                    className="form-control"
                    placeholder="MM/AA"
                    maxLength="5"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="cvv" className="form-label">Código de Verificação (CVV)</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cartaoCVV}
                    onChange={handleCartaoChange}
                    className="form-control"
                    placeholder="Código de verificação"
                    maxLength="3"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="apelido" className="form-label">Apelido para este Cartão</label>
                  <input
                    type="text"
                    id="apelido"
                    name="apelido"
                    value={apelido}
                    onChange={handleCartaoChange}
                    className="form-control"
                    placeholder="Ex: Cartão de Crédito"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="cpfCnpj" className="form-label">CPF/CNPJ do Titular</label>
                  <input
                    type="text"
                    id="cpfCnpj"
                    name="cpfCnpj"
                    value={cpfCnpj}
                    onChange={handleCartaoChange}
                    className="form-control"
                    placeholder="CPF ou CNPJ"
                    maxLength="14"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="dataNascimento" className="form-label">Data de Nascimento</label>
                  <input
                    type="date"
                    id="dataNascimento"
                    name="dataNascimento"
                    value={dataNascimento}
                    onChange={handleCartaoChange}
                    className="form-control"
                  />
                </div>
              </div>
            </>
          )}

          {/* Formulário para Boleto Bancário */}
          {formaPagamento === 'boleto' && (
            <div className="mt-4">
              <h6 className="fw-bold">Boleto Bancário</h6>
              <p className="text-muted">5% de desconto pagando com boleto.</p>
            </div>
          )}

          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate('/checkout')}
            >
              <i className="bi bi-arrow-left-circle me-2"></i> Voltar ao Checkout
            </button>

            <button
              className="btn btn-success"
              onClick={processarPagamento}
              disabled={!formaPagamento}
            >
              <i className="bi bi-credit-card me-2"></i> Resumo do pedido
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientePagamentoPage