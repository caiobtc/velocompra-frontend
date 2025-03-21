import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importe o FontAwesome
import { BrowserRouter } from 'react-router-dom';
import { CarrinhoProvider } from './contexts/CarrinhoContext.jsx'; // Importa o Provider do Carrinho

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CarrinhoProvider> {/* Adiciona o Provider aqui */}
        <App />
      </CarrinhoProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
