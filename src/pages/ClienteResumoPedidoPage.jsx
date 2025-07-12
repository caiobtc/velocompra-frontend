// Importa hooks do React: useState e useEffect para gerenciar estado e efeitos, useContext para acessar contextos globais
import { useState, useEffect, useContext } from 'react';
// Importa o contexto do carrinho de compras
import { CarrinhoContext } from '../contexts/CarrinhoContext.jsx';
// Importa o componente da navbar superior da loja
import NavbarLoja from '../components/NavbarLoja.jsx';
// Hook do React Router para redirecionamento de rotas
import { useNavigate } from 'react-router-dom';
// Utilitário para exibir alertas (sucesso, erro, aviso)
import AlertUtils from '../utils/alerts.js';
// Cliente HTTP configurado para fazer requisições à API
import api from '../services/api.js';

// Componente funcional que representa a página de resumo do pedido
const ClienteResumoPedidoPage = () => {
  const { carrinho } = useContext(CarrinhoContext); // Acessa o conteúdo do carrinho de compras
  const navigate = useNavigate(); // Hook para redirecionamento

  // Estados locais para armazenar dados relacionados ao pedido
  const [freteSelecionado, setFreteSelecionado] = useState('');
  const [valorFrete, setValorFrete] = useState(0);
  const [totalGeral, setTotalGeral] = useState(0);
  const [enderecoEntrega, setEnderecoEntrega] = useState(null);
  const [formaPagamento, setFormaPagamento] = useState('');

  // Efeito que é executado ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Verifica se o usuário está logado
    if (!token) {
      AlertUtils.aviso('Você precisa estar logado para ver o resumo do pedido.');
      navigate('/cliente/login'); // Redireciona para login se não estiver autenticado
      return;
    }

    // Recupera dados salvos no localStorage
    const freteSalvo = JSON.parse(localStorage.getItem('freteSelecionado'));
    const enderecoSalvo = JSON.parse(localStorage.getItem('enderecoEntrega'));
    const pagamentoSalvo = localStorage.getItem('formaPagamento');

    // Se houver dados salvos, atualiza os estados correspondentes
    if (freteSalvo) {
      setFreteSelecionado(freteSalvo.tipo);
      setValorFrete(freteSalvo.valor);
    }

    if (enderecoSalvo) {
      setEnderecoEntrega(enderecoSalvo);
    }

    if (pagamentoSalvo) {
      setFormaPagamento(pagamentoSalvo);
    }

    // Calcula o valor total do pedido com frete
    const subtotal = calcularSubtotal();
    const frete = freteSalvo?.valor || 0;
    setTotalGeral(subtotal + frete);
  }, [navigate]);

  // Função que calcula o subtotal dos produtos do carrinho
  const calcularSubtotal = () => {
    return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
  };

  // Função que retorna para a etapa anterior do checkout
  const handleVoltar = () => {
    navigate('/checkout');
  };

  // Função que finaliza o pedido e o envia para a API
  const handleConcluirCompra = async () => {
    // Validação: é necessário ter um endereço selecionado
    if (!enderecoEntrega) {
      AlertUtils.aviso('Selecione um endereço de entrega.');
      return;
    }

    const token = localStorage.getItem('token');
    const freteSalvo = JSON.parse(localStorage.getItem('freteSelecionado'));
    const formaPagamentoSalva = localStorage.getItem('formaPagamento');

    // Monta o objeto DTO do pedido
    const pedidoDTO = {
      enderecoEntregaId: enderecoEntrega.id,
      formaPagamento: formaPagamentoSalva,
      frete: freteSalvo?.valor || 0,
      produtos: carrinho.map(item => ({
        produtoId: item.id,
        quantidade: item.quantidade,
        precoUnitario: item.preco
      }))
    };

    try {
      // Envia requisição POST para a API com os dados do pedido
      const response = await api.post('/pedidos', pedidoDTO, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const pedido = response.data;

      // Alerta o usuário com o número do pedido e valor total
      AlertUtils.sucesso(
        `Pedido #${pedido.numeroPedido} criado com sucesso!\nValor total: ${pedido.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
      );

      // Limpa os dados salvos no localStorage após finalização
      localStorage.removeItem('freteSelecionado');
      localStorage.removeItem('enderecoEntrega');
      localStorage.removeItem('formaPagamento');

      // Redireciona para a página de "Meus Pedidos"
      navigate('/meus-pedidos');
    } catch (error) {
      // Trata erros de API
      console.error('Erro ao finalizar pedido', error);
      AlertUtils.erro('Erro ao finalizar a compra. Tente novamente.');
    }
  };

  // Renderiza a interface da tela
  return (
    <>
      <NavbarLoja /> {/* Barra superior da loja */}

      <div className="container py-5">
        <h2 className="fw-bold mb-4 text-center">Resumo do Pedido</h2>

        {/* Card principal com os dados do pedido */}
        <div className="card p-4 shadow-sm mb-4">
          <h5 className="fw-bold mb-3">Resumo do Pedido</h5>

          {/* Lista de produtos do carrinho */}
          <ul className="list-group">
            {carrinho.map((item) => (
              <li key={item.id} className="list-group-item d-flex align-items-center gap-3">
                <img
                  src={`http://localhost:8080/uploads/${item.imagemPadrao || item.imagens?.[0]}`}
                  alt={item.nome}
                  className="img-thumbnail"
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                />
                <div>
                  <strong>{item.nome}</strong><br />
                  {item.quantidade} x {parseFloat(item.preco).toLocaleString('pt-BR', {
                    style: 'currency', currency: 'BRL'
                  })} = {parseFloat(item.preco * item.quantidade).toLocaleString('pt-BR', {
                    style: 'currency', currency: 'BRL'
                  })}
                </div>
              </li>
            ))}
          </ul>

          {/* Subtotal dos produtos */}
          <div className="d-flex justify-content-between mt-3">
            <h6 className="fw-bold">Subtotal:</h6>
            <span>{calcularSubtotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>

          {/* Valor do frete */}
          <div className="d-flex justify-content-between mt-2">
            <h6 className="fw-bold">Frete:</h6>
            <span>{valorFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>

          {/* Endereço de entrega */}
          <div className="mt-4">
            <h6 className="fw-bold">Endereço de Entrega:</h6>
            {enderecoEntrega ? (
              <div>
                <p>{enderecoEntrega.logradouro}, {enderecoEntrega.numero}</p>
                <p>{enderecoEntrega.bairro}, {enderecoEntrega.cidade}/{enderecoEntrega.uf}</p>
                <p>CEP: {enderecoEntrega.cep}</p>
              </div>
            ) : (
              <p className="text-muted">Endereço não selecionado</p>
            )}
          </div>

          {/* Forma de pagamento */}
          <div className="mt-3">
            <h6 className="fw-bold">Forma de Pagamento:</h6>
            <p>{formaPagamento === 'cartao' ? 'Cartão de Crédito' : 'Boleto Bancário'}</p>
          </div>

          {/* Total geral */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4 className="fw-bold">Total:</h4>
            <span>{totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>

          {/* Botões de ação: voltar ou concluir compra */}
          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-outline-primary" onClick={handleVoltar}>
              <i className="bi bi-arrow-left-circle me-2"></i> Voltar à Escolha de Pagamento
            </button>
            <button
              className="btn btn-success"
              onClick={handleConcluirCompra}
              disabled={!enderecoEntrega} // Só permite clicar se houver endereço
            >
              <i className="bi bi-check-circle me-2"></i> Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Exporta o componente para ser usado nas rotas do app
export default ClienteResumoPedidoPage;
