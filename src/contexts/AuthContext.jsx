import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem('token');
    const grupo = localStorage.getItem('grupo');
    const nome = localStorage.getItem('nome');

    if (token && grupo) {
      return { token, grupo, nome };
    }

    return null;
  });

  const login = ({ token, grupo, nome }) => {
    const grupoUpper = grupo.toUpperCase(); // Força para caixa alta

    localStorage.setItem('token', token);
    localStorage.setItem('grupo', grupoUpper);
    localStorage.setItem('nome', nome);

    setUsuario({ token, grupo: grupoUpper, nome });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('grupo');
    localStorage.removeItem('nome');

    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
