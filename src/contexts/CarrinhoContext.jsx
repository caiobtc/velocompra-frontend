// Importa o React e os hooks necessários
import React, { createContext, useState, useEffect } from 'react';
// Importa utilitário de alertas (avisos, erros, etc)
import AlertUtils from '../utils/alerts.js';

// Cria o contexto do carrinho, que poderá ser usado com useContext()
export const CarrinhoContext = createContext();

// Define o provedor do contexto que envolve os componentes filhos
export const CarrinhoProvider = ({ children }) => {
  // Estado carrinho inicializado com os dados do localStorage (ou array vazio se não houver nada salvo)
  const [carrinho, setCarrinho] = useState(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  });

  // Sempre que o carrinho for alterado, salva a nova versão no localStorage
  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

  // Função para adicionar um produto ao carrinho
  const adicionarAoCarrinho = (produto) => {
    // Verifica se o produto está sem estoque
    if (produto.quantidadeEstoque <= 0) {
      AlertUtils.aviso('Produto sem estoque disponível.');
      return;
    }

    let adicionado = false; // Flag para saber se foi possível adicionar

    // Atualiza o carrinho com base no estado anterior
    setCarrinho((prevCarrinho) => {
      // Verifica se o produto já está no carrinho
      const produtoExistente = prevCarrinho.find((item) => item.id === produto.id);

      if (produtoExistente) {
        // Se já atingiu o estoque máximo, exibe alerta e não adiciona mais
        if (produtoExistente.quantidade >= produto.quantidadeEstoque) {
          AlertUtils.aviso('Você atingiu o limite de estoque disponível para este produto.');
          return prevCarrinho;
        }

        adicionado = true;

        // Aumenta a quantidade do produto existente em 1
        return prevCarrinho.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      // Caso seja um novo produto, adiciona com quantidade 1
      adicionado = true;
      return [...prevCarrinho, { ...produto, quantidade: 1 }];
    });

    return adicionado; // Retorna true se o produto foi adicionado
  };

  // Função para remover um produto do carrinho com base no ID
  const removerDoCarrinho = (id) => {
    setCarrinho((prevCarrinho) => prevCarrinho.filter((item) => item.id !== id));
  };

  // Limpa todos os itens do carrinho
  const limparCarrinho = () => {
    setCarrinho([]);
  };

  // Altera a quantidade de um item no carrinho
  const alterarQuantidade = (id, novaQuantidade, estoqueDisponivel) => {
    // Verifica se a quantidade mínima é válida
    if (novaQuantidade < 1) {
      AlertUtils.aviso('A quantidade mínima é 1.');
      return;
    }

    // Verifica se a quantidade não excede o estoque
    if (novaQuantidade > estoqueDisponivel) {
      AlertUtils.aviso('Quantidade solicitada maior que o estoque disponível.');
      return;
    }

    // Atualiza a quantidade do produto no carrinho
    setCarrinho((prevCarrinho) =>
      prevCarrinho.map((item) =>
        item.id === id ? { ...item, quantidade: novaQuantidade } : item
      )
    );
  };

  // Reduz a quantidade de um produto no carrinho em 1 (mínimo 1)
  const reduzirQuantidade = (id) => {
    setCarrinho((prevCarrinho) =>
      prevCarrinho
        .map((item) =>
          item.id === id
            ? { ...item, quantidade: item.quantidade > 1 ? item.quantidade - 1 : 1 }
            : item
        )
        .filter((item) => item.quantidade > 0) // Remove itens com quantidade 0 (por segurança)
    );
  };

  // Retorna o componente Provider do contexto com os valores disponíveis para os componentes filhos
  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        adicionarAoCarrinho,
        removerDoCarrinho,
        limparCarrinho,
        alterarQuantidade,
        reduzirQuantidade
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};
