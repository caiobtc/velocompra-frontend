// Importa hooks do React para gerenciar estado, efeitos colaterais e contexto
import { useState, useEffect, useContext } from 'react';
// Importa o contexto que armazena o carrinho de compras
import { CarrinhoContext } from '../contexts/CarrinhoContext.jsx';
// Importa o componente da barra de navegação da loja
import NavbarLoja from '../components/NavbarLoja.jsx';
// Hook para redirecionar o usuário entre rotas
import { useNavigate } from 'react-router-dom';
// Biblioteca utilitária para mostrar alertas
import AlertUtils from '../utils/alerts.js';
// Módulo com funções de requisição para a API
import api from '../services/api.js';

// Componente principal da página de checkout
const CheckoutPage = () => {
  // Acessa o carrinho de compras do contexto
  const { carrinho } = useContext(CarrinhoContext);
  // Permite redirecionamento de rota
  const navigate = useNavigate();

  // Estados para controle do frete selecionado, valor do frete, endereços salvos e ID do endereço selecionado
  const [freteSelecionado, setFreteSelecionado] = useState(null);
  const [valorFrete, setValorFrete] = useState(0);
  const [enderecosEntrega, setEnderecosEntrega] = useState([]);
  const [enderecoEntrega, setEnderecoEntrega] = useState('');

  // useEffect é executado assim que o componente monta
  useEffect(() => {
    // Recupera o token de autenticação do localStorage
    const token = localStorage.getItem('token');
    
    // Se não houver token, alerta o usuário e redireciona para login
    if (!token) {
      AlertUtils.aviso('Você precisa estar logado para fazer o checkout.');
      navigate('/cliente/login');
      return; // Encerra a execução do efeito
    }

    // Função assíncrona para buscar os endereços do cliente logado
    const loadEnderecos = async () => {
      try {
        // Faz requisição GET para rota protegida de checkout
        const response = await api.get('/checkout', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Armazena os endereços recebidos no estado
        setEnderecosEntrega(response.data);
      } catch (error) {
        // Exibe alerta em caso de falha
        AlertUtils.erro('Erro ao carregar os endereços.');
      }
    };

    // Executa a função de carregamento
    loadEnderecos();
  }, [navigate]);

  // Calcula o subtotal dos produtos no carrinho
  const calcularSubtotal = () => {
    return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
  };

  // Calcula o total final (subtotal + frete)
  const calcularTotal = () => {
    return calcularSubtotal() + valorFrete;
  };

  // Manipula seleção de frete e armazena no estado e localStorage
  const handleSelecionarFrete = (tipoFrete) => {
    let valor = 0;

    // Define o valor do frete com base no tipo selecionado
    switch (tipoFrete) {
      case 'gratis': valor = 0; break;
      case 'pac': valor = 10; break;
      case 'sedex': valor = 20; break;
      default: valor = 0;
    }

    // Atualiza estado com tipo e valor
    setFreteSelecionado(tipoFrete);
    setValorFrete(valor);

    // Armazena no localStorage o frete escolhido
    localStorage.setItem('freteSelecionado', JSON.stringify({ tipo: tipoFrete, valor }));
  };

  // Confirma o endereço selecionado, validando e salvando no localStorage
  const handleConfirmarEndereco = () => {
    // Verifica se o usuário selecionou algum endereço
    if (!enderecoEntrega) {
      AlertUtils.aviso('Selecione um endereço de entrega.');
      return;
    }

    // Busca o objeto completo do endereço a partir do ID selecionado
    const endereco = enderecosEntrega.find(e => e.id === parseInt(enderecoEntrega));

    // Se encontrou, salva no localStorage e exibe mensagem de sucesso
    if (endereco) {
      localStorage.setItem('enderecoEntrega', JSON.stringify(endereco));
      AlertUtils.sucesso('Endereço confirmado!');
    }
  };

  // Finaliza o pedido: valida frete e endereço, confirma endereço e navega para pagamento
  const finalizarCompra = () => {
    if (!freteSelecionado || !enderecoEntrega) {
      AlertUtils.aviso('Preencha todos os campos antes de continuar.');
      return;
    }

    handleConfirmarEndereco(); // Salva o endereço no localStorage
    navigate('/pagamento'); // Redireciona para página de pagamento
  };

  // Renderiza a interface visual da página de checkout
  return (
    <>
      <NavbarLoja /> {/* Exibe a navbar no topo */}
      <div className="container py-5">
        <h2 className="fw-bold mb-4 text-center">Confirme seu Pedido</h2>

        {/* IF: se o carrinho estiver vazio, mostra mensagem e botão de voltar à loja */}
        {carrinho.length === 0 ? (
          <div className="text-center text-muted py-5">
            <h4>Seu carrinho está vazio.</h4>
            <button className="btn btn-outline-primary mt-3" onClick={() => navigate('/loja')}>
              <i className="bi bi-arrow-left-circle me-2"></i>Voltar à Loja
            </button>
          </div>
        ) : (
          // Caso contrário, mostra resumo do pedido e opções
          <div className="card p-4 shadow-sm mb-4">
            <h5 className="fw-bold mb-3">Confirme seu Pedido</h5>

            {/* Lista de produtos no carrinho */}
            <ul className="list-group">
              {carrinho.map((item) => (
                <li key={item.id} className="list-group-item d-flex align-items-center gap-3">
                  {/* Imagem do produto */}
                  <img
                    src={`http://localhost:8080/uploads/${item.imagemPadrao || item.imagens?.[0]}`}
                    alt={item.nome}
                    className="img-thumbnail"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                  {/* Nome e preço/quantidade do produto */}
                  <div>
                    <strong>{item.nome}</strong><br />
                    {item.quantidade} x {parseFloat(item.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                </li>
              ))}
            </ul>

            {/* Exibe subtotal dos produtos */}
            <div className="d-flex justify-content-between mt-3">
              <h6 className="fw-bold">Subtotal:</h6>
              <span>{calcularSubtotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>

            {/* Seleção de tipo de frete */}
            <h6 className="fw-bold mt-4">Escolha o Frete:</h6>
            {['gratis', 'pac', 'sedex'].map(tipo => (
              <div className="form-check" key={tipo}>
                <input
                  className="form-check-input"
                  type="radio"
                  id={`frete-${tipo}`}
                  name="frete"
                  checked={freteSelecionado === tipo}
                  onChange={() => handleSelecionarFrete(tipo)}
                />
                <label className="form-check-label" htmlFor={`frete-${tipo}`}>
                  {tipo === 'gratis' && 'Frete Grátis (R$ 0,00)'}
                  {tipo === 'pac' && 'PAC - Correios (R$ 10,00)'}
                  {tipo === 'sedex' && 'SEDEX - Entrega Expressa (R$ 20,00)'}
                </label>
              </div>
            ))}

            {/* Seleção do endereço de entrega */}
            <h5 className="fw-bold mt-4">Endereço de Entrega:</h5>
            {enderecosEntrega.length > 0 ? (
              // Se houver endereços cadastrados, renderiza opções em radio buttons
              enderecosEntrega.map((endereco, index) => (
                <div key={index} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`endereco${index}`}
                    name="endereco"
                    value={endereco.id}
                    checked={parseInt(enderecoEntrega) === endereco.id}
                    onChange={(e) => setEnderecoEntrega(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor={`endereco${index}`}>
                    {endereco.logradouro}, {endereco.numero} - {endereco.bairro}, {endereco.cidade}/{endereco.uf}
                  </label>
                </div>
              ))
            ) : (
              // Se não houver endereços
              <p className="text-muted">Você não possui endereços cadastrados.</p>
            )}

            {/* Botão para confirmar endereço escolhido */}
            <button className="btn btn-outline-secondary mt-2" onClick={handleConfirmarEndereco}>
              Confirmar Endereço Selecionado
            </button>

            {/* Total final da compra */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <h4 className="fw-bold">Total:</h4>
              <span>{calcularTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>

            {/* Botões para voltar à loja ou seguir para pagamento */}
            <div className="d-flex gap-2 mt-4">
              <button className="btn btn-outline-primary" onClick={() => navigate('/loja')}>
                <i className="bi bi-arrow-left-circle me-2"></i> Continuar Comprando
              </button>

              <button
                className="btn btn-success"
                onClick={finalizarCompra}
                disabled={!freteSelecionado || !enderecoEntrega} // Desativa botão se dados obrigatórios estiverem faltando
              >
                <i className="bi bi-bag-check me-2"></i> Ir para pagamento
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Exporta o componente para ser usado nas rotas do app
export default CheckoutPage;
