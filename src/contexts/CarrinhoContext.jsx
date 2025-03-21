import React, { createContext, useState, useEffect } from 'react';

// Criando o contexto
export const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  });

  // Salva o carrinho sempre que ele for atualizado
  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

  /**
   * Adiciona um produto ao carrinho
   * Se já existir, aumenta a quantidade em 1 (até o limite do estoque)
   * Se não existir, adiciona com quantidade 1 (se estoque >= 1)
   */
  const adicionarAoCarrinho = (produto) => {
    if (produto.quantidadeEstoque <= 0) {
      alert('Produto sem estoque disponível.');
      return;
    }

    let adicionado = false;

    setCarrinho((prevCarrinho) => {
      const produtoExistente = prevCarrinho.find((item) => item.id === produto.id);

      if (produtoExistente) {
        // Verifica se já atingiu o limite do estoque
        if (produtoExistente.quantidade >= produto.quantidadeEstoque) {
          alert('Você atingiu o limite de estoque disponível para este produto.');
          return prevCarrinho;
        }

        // Incrementa quantidade
        adicionado = true;
        return prevCarrinho.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }


      adicionado = true;
      // Adiciona novo item (se estoque >= 1)
      return [...prevCarrinho, { ...produto, quantidade: 1 }];
    });

    return adicionado;
  };

  /**
   * Remove o produto do carrinho pelo ID
   */
  const removerDoCarrinho = (id) => {
    setCarrinho((prevCarrinho) => prevCarrinho.filter((item) => item.id !== id));
  };

  /**
   * Limpa o carrinho inteiro
   */
  const limparCarrinho = () => {
    setCarrinho([]);
  };

  /**
   * Atualiza a quantidade de um item no carrinho
   */
  const alterarQuantidade = (id, novaQuantidade, estoqueDisponivel) => {
    if (novaQuantidade < 1) {
      alert('A quantidade mínima é 1.');
      return;
    }

    if (novaQuantidade > estoqueDisponivel) {
      alert('Quantidade solicitada maior que o estoque disponível.');
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
