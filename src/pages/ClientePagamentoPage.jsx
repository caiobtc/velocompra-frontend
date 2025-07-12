// Importa o hook useState para gerenciar estado local
import { useState } from 'react';
// Importa o hook useNavigate para redirecionamento de rotas
import { useNavigate } from 'react-router-dom';
// Importa utilitários para exibir alertas (sucesso, erro, aviso)
import AlertUtils from '../utils/alerts.js';
// Importa a barra de navegação superior da loja
import NavbarLoja from '../components/NavbarLoja.jsx';

// Componente principal da página de pagamento
const ClientePagamentoPage = () => {
  const navigate = useNavigate(); // Hook para navegação entre páginas

  // Estados para armazenar dados da forma de pagamento e cartão
  const [formaPagamento, setFormaPagamento] = useState('');
  const [cartaoNumero, setCartaoNumero] = useState('');
  const [cartaoNome, setCartaoNome] = useState('');
  const [cartaoValidade, setCartaoValidade] = useState('');
  const [cartaoCVV, setCartaoCVV] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [apelido, setApelido] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  // Manipula a seleção da forma de pagamento
  const handlePagamentoChange = (e) => {
    const valor = e.target.value;
    setFormaPagamento(valor); // Atualiza o estado
    localStorage.setItem('formaPagamento', valor); // Salva no localStorage
  };

  // Manipula os campos do cartão, aplicando formatações básicas
  const handleCartaoChange = (e) => {
    const { name, value } = e.target;
    if (name === 'numero') setCartaoNumero(value.replace(/\D/g, '')); // Aceita apenas números
    if (name === 'nome') setCartaoNome(value.replace(/[^a-zA-Z\s]/g, '')); // Aceita apenas letras e espaço
    if (name === 'cvv') setCartaoCVV(value.replace(/\D/g, '')); // Aceita apenas números
    if (name === 'cpfCnpj') setCpfCnpj(value.replace(/\D/g, '')); // Remove caracteres não numéricos
    if (name === 'apelido') setApelido(value.replace(/[^a-zA-Z\s]/g, '')); // Apenas letras e espaço
    if (name === 'dataNascimento') setDataNascimento(value); // Aceita o valor do input tipo date
    if (name === 'validade') {
      // Formata a validade para MM/AA
      let onlyNumbers = value.replace(/\D/g, '').slice(0, 4);
      if (onlyNumbers.length >= 3) {
        onlyNumbers = onlyNumbers.slice(0, 2) + '/' + onlyNumbers.slice(2);
      }
      setCartaoValidade(onlyNumbers);
    }
  };

  // Função executada ao clicar no botão "Resumo do pedido"
  const processarPagamento = () => {
    // Validação geral: forma de pagamento obrigatória
    if (!formaPagamento) {
      AlertUtils.aviso('Por favor, selecione uma forma de pagamento.');
      return;
    }

    // Se for cartão, valida todos os campos obrigatórios
    if (formaPagamento === 'cartao') {
      if (!cartaoNumero || !cartaoNome || !cartaoValidade || !cartaoCVV || !cpfCnpj || !dataNascimento) {
        AlertUtils.aviso('Por favor, preencha todos os dados do cartão de crédito.');
        return;
      }

      // Valida número do cartão com 16 dígitos
      if (cartaoNumero.length !== 16) {
        AlertUtils.aviso('O número do cartão deve ter 16 dígitos.');
        return;
      }

      // Valida CVV com 3 dígitos
      if (cartaoCVV.length !== 3) {
        AlertUtils.aviso('O código de verificação (CVV) deve ter 3 dígitos.');
        return;
      }

      // Valida formato MM/AA da validade
      if (!/\d{2}\/\d{2}/.test(cartaoValidade)) {
        AlertUtils.aviso('Data de validade inválida.');
        return;
      }

      // Valida CPF (11) ou CNPJ (14)
      if (cpfCnpj.length < 11 || cpfCnpj.length > 14) {
        AlertUtils.aviso('CPF/CNPJ inválido.');
        return;
      }
    }

    // Se passou por todas as validações, redireciona para o resumo do pedido
    navigate('/resumo-pedido');
  };

  // Interface JSX da página de pagamento
  return (
    <>
      {/* Navbar superior da loja */}
      <NavbarLoja />

      <div className="container py-5">
        <h2 className="fw-bold mb-4 text-center">Escolha a Forma de Pagamento</h2>

        <div className="card p-4 shadow-sm">
          <h5 className="fw-bold mb-3">Escolha a Forma de Pagamento</h5>

          {/* Radio: cartão de crédito */}
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

          {/* Radio: boleto bancário */}
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

          {/* Formulário de cartão exibido apenas se "cartao" estiver selecionado */}
          {formaPagamento === 'cartao' && (
            <>
              <div className="mt-4">
                <h6 className="fw-bold">Dados do Cartão</h6>

                {/* Número do cartão */}
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

                {/* Nome impresso no cartão */}
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

                {/* Validade do cartão */}
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

                {/* CVV do cartão */}
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

                {/* Apelido do cartão */}
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

                {/* CPF ou CNPJ do titular */}
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

                {/* Data de nascimento do titular */}
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

          {/* Informações adicionais ao selecionar boleto */}
          {formaPagamento === 'boleto' && (
            <div className="mt-4">
              <h6 className="fw-bold">Boleto Bancário</h6>
              <p className="text-muted">5% de desconto pagando com boleto.</p>
            </div>
          )}

          {/* Botões de navegação da tela */}
          <div className="d-flex justify-content-between mt-4">
            {/* Voltar ao checkout */}
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate('/checkout')}
            >
              <i className="bi bi-arrow-left-circle me-2"></i> Voltar ao Checkout
            </button>

            {/* Ir para o resumo do pedido */}
            <button
              className="btn btn-success"
              onClick={processarPagamento}
              disabled={!formaPagamento} // Botão desabilitado se forma de pagamento não for selecionada
            >
              <i className="bi bi-credit-card me-2"></i> Resumo do pedido
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Exporta o componente para ser utilizado na aplicação
export default ClientePagamentoPage;
