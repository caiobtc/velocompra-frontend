import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';

const AdminRoute = ({ children }) => {
  const { usuario } = useContext(AuthContext);

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.grupo !== 'ADMINISTRADOR') {
    return <Navigate to="/backoffice" replace />;
  }

  return children;
};

export default AdminRoute;
