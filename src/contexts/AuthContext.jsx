// Importa funções do React: createContext para criar o contexto e useState para controlar estado
import { createContext, useState } from 'react';

// Cria e exporta o contexto de autenticação, que será compartilhado com outros componentes
export const AuthContext = createContext();

// Cria o provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  // Define o estado inicial do usuário com dados armazenados no localStorage
  const [usuario, setUsuario] = useState(() => {
    // Recupera dados de autenticação armazenados no navegador
    const token = localStorage.getItem('token');
    const grupo = localStorage.getItem('grupo');
    const nome = localStorage.getItem('nome');

    // Se houver token e grupo, retorna um objeto com as informações do usuário
    if (token && grupo) {
      return { token, grupo, nome };
    }

    // Caso contrário, o usuário não está autenticado
    return null;
  });

  // Função que executa o login do usuário e armazena os dados no localStorage
  const login = ({ token, grupo, nome }) => {
    // Converte o grupo (ex: "administrador") para letras maiúsculas
    const grupoUpper = grupo.toUpperCase();

    // Armazena os dados no localStorage para manter a sessão após recarregar a página
    localStorage.setItem('token', token);
    localStorage.setItem('grupo', grupoUpper);
    localStorage.setItem('nome', nome);

    // Atualiza o estado com os dados do usuário logado
    setUsuario({ token, grupo: grupoUpper, nome });
  };

  // Função que executa o logout do usuário
  const logout = () => {
    // Remove os dados do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('grupo');
    localStorage.removeItem('nome');

    // Limpa o estado do usuário (desloga)
    setUsuario(null);
  };

  // Retorna o provedor do contexto com os valores disponíveis: usuário, login e logout
  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {/* children representa os componentes filhos que terão acesso ao contexto */}
      {children}
    </AuthContext.Provider>
  );
};
