// Importa o hook useContext para acessar o contexto React
import { useContext } from 'react';
// Importa o componente Navigate, usado para redirecionar o usuário entre rotas
import { Navigate } from 'react-router-dom';
// Importa o contexto de autenticação para verificar se o usuário está logado e qual seu grupo
import { AuthContext } from '../contexts/AuthContext.jsx';

// Define um componente chamado AdminRoute, que recebe children como prop.
// Esse componente é usado como uma proteção de rota (Route Guard) para rotas que só devem ser acessadas por administradores.
const AdminRoute = ({ children }) => {
  // Usa o contexto AuthContext para acessar o objeto 'usuario', que contém token, grupo e nome do usuário logado
  const { usuario } = useContext(AuthContext);

  // Primeiro if: verifica se o usuário está autenticado
  if (!usuario) {
    // Se não estiver logado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  // Segundo if: verifica se o usuário logado tem permissão de administrador
  if (usuario.grupo !== 'ADMINISTRADOR') {
    // Se o usuário não for do grupo 'ADMINISTRADOR', redireciona para o painel comum do backoffice
    return <Navigate to="/backoffice" replace />;
  }

  // Se o usuário estiver logado e for administrador, permite o acesso ao conteúdo protegido (children)
  return children;
};

// Exporta o componente AdminRoute para ser usado em rotas protegidas por permissão de administrador
export default AdminRoute;
