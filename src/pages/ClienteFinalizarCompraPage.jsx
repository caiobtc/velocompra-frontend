// Importa os hooks do React para manipular estado, efeitos colaterais e contexto
import { useState, useContext, useEffect } from 'react';
// Importa o contexto do carrinho de compras
import { CarrinhoContext } from '../contexts/CarrinhoContext.jsx';
// Importa o componente da barra de navegação da loja
import NavbarLoja from '../components/NavbarLoja.jsx';
// Hook para redirecionamento entre rotas
import { useNavigate } from 'react-router-dom';
// Utilitário para exibir alertas personalizados
import AlertUtils from '../utils/alerts.js';
// Cliente HTTP que faz as requisições para a API
import api from '../services/api.js';

// Componente funcional da página de finalização da compra
const ClienteFinalizarCompraPage = () => {
  // Acessa os produtos que estão no carrinho usando contexto
  const { carrinho } = useContext(CarrinhoContext);

  // Estado que controla se o pedido foi confirmado ou não
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);

  // Estado que armazena os dados do pedido após a confirmação
  const [pedido, setPedido] = useState(null);

  // Hook para navegação entre páginas
  const navigate = useNavigate();

  // Função para calcular o subtotal somando o preço * quantidade de cada item
  const calcularSubtotal = () => {
    return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
  };

  // Função que retorna o valor total da compra (neste caso igual ao subtotal)
  const calcularTotal = () => {
    return calcularSubtotal();
  };

  // Função que será executada ao clicar no botão "Concluir Compra"
  const handleFinalizarCompra = async () => {
    // Recupera o token salvo localmente para autenticação
    const token = localStorage.getItem('token');

    // Forma de pagamento é fixa aqui, mas ideal seria capturar de um campo
    const formaPagamento = 'cartao';

    // Validação: verifica se existe token e forma de pagamento
    if (!token || !formaPagamento) {
      AlertUtils.aviso('Selecione uma forma de pagamento.');
      return; // Interrompe a execução se dados obrigatórios estiverem ausentes
    }

    // Monta o objeto do pedido com os dados necessários
    const pedidoData = {
      produtos: carrinho, // Lista de produtos no carrinho
      valorTotal: calcularTotal(), // Valor total da compra
      formaPagamento, // Forma de pagamento selecionada
      status: 'Aguardando pagamento', // Status inicial do pedido
      clienteId: localStorage.getItem('clienteId'), // ID do cliente (salvo anteriormente)
      enderecoEntrega: 'Endereço de entrega do cliente', // Aqui deveria ser o endereço real do cliente
    };

    try {
      // Envia os dados do pedido para a API via POST
      const response = await api.post('/pedido/criar', pedidoData, {
        headers: { Authorization: `Bearer ${token}` }, // Envia o token no cabeçalho
      });

      // Desestrutura os dados da resposta do backend
      const { numeroPedido, valorTotal } = response.data;

      // Atualiza o estado com os dados do pedido recém-criado
      setPedido({
        numero: numeroPedido,
        valor: valorTotal,
        status: 'Aguardando pagamento',
      });

      // Marca o pedido como confirmado para alterar a interface
      setPedidoConfirmado(true);
    } catch (error) {
      // Em caso de erro na criação do pedido, exibe mensagem ao usuário
      AlertUtils.erro('Erro ao finalizar a compra. Tente novamente.');
    }
  };

  // Retorna o JSX da interface da página
  return (
    <>
      {/* Navbar da loja */}
      <NavbarLoja />

      {/* Container central da página */}
      <div className="container py-5">
        <h2 className="fw-bold mb-4 text-center">🛒 Concluir Compra</h2>

        {/* Se o pedido foi confirmado, exibe mensagem de sucesso */}
        {pedidoConfirmado ? (
          <div className="alert alert-success text-center" role="alert">
            <h4 className="alert-heading">Pedido Confirmado!</h4>
            <p>
              Seu pedido número <strong>{pedido.numero}</strong> foi criado com sucesso. O valor total foi de{' '}
              <strong>{pedido.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>.
            </p>
            <p>Status: <strong>{pedido.status}</strong></p>

            {/* Botão para ver os pedidos realizados */}
            <button
              className="btn btn-success"
              onClick={() => navigate('/meus-pedidos')}
            >
              Ver Meus Pedidos
            </button>
          </div>
        ) : (
          // Caso o pedido ainda não tenha sido feito, mostra botão para concluir
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="fw-bold">
              Total: {calcularTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h4>

            {/* Botão que envia a requisição de finalização da compra */}
            <button
              className="btn btn-success"
              onClick={handleFinalizarCompra}
            >
              Concluir Compra
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// Exporta o componente para ser utilizado nas rotas da aplicação
export default ClienteFinalizarCompraPage;
