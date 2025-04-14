import React, { createContext, useState, useEffect } from 'react';
import AlertUtils from '../utils/alerts.js';

export const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

  const adicionarAoCarrinho = (produto) => {
    if (produto.quantidadeEstoque <= 0) {
      AlertUtils.aviso('Produto sem estoque disponível.');
      return;
    }

    let adicionado = false;

    setCarrinho((prevCarrinho) => {
      const produtoExistente = prevCarrinho.find((item) => item.id === produto.id);

      if (produtoExistente) {
        if (produtoExistente.quantidade >= produto.quantidadeEstoque) {
          AlertUtils.aviso('Você atingiu o limite de estoque disponível para este produto.');
          return prevCarrinho;
        }

        adicionado = true;
        return prevCarrinho.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      adicionado = true;
      return [...prevCarrinho, { ...produto, quantidade: 1 }];
    });

    return adicionado;
  };

  const removerDoCarrinho = (id) => {
    setCarrinho((prevCarrinho) => prevCarrinho.filter((item) => item.id !== id));
  };

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  const alterarQuantidade = (id, novaQuantidade, estoqueDisponivel) => {
    if (novaQuantidade < 1) {
      AlertUtils.aviso('A quantidade mínima é 1.');
      return;
    }

    if (novaQuantidade > estoqueDisponivel) {
      AlertUtils.aviso('Quantidade solicitada maior que o estoque disponível.');
      return;
    }

    setCarrinho((prevCarrinho) =>
      prevCarrinho.map((item) =>
        item.id === id ? { ...item, quantidade: novaQuantidade } : item
      )
    );
  };

  const reduzirQuantidade = (id) => {
    setCarrinho((prevCarrinho) =>
      prevCarrinho
        .map((item) =>
          item.id === id
            ? { ...item, quantidade: item.quantidade > 1 ? item.quantidade - 1 : 1 }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

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
