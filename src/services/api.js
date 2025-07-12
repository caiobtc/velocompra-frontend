// Importa o Axios, biblioteca utilizada para fazer requisições HTTP
import axios from 'axios';

// Cria uma instância do Axios com configurações padrão
const api = axios.create({
  // Define a URL base para todas as requisições feitas com esta instância
  baseURL: 'http://localhost:8080/api',

  // Define o cabeçalho padrão "Content-Type" como JSON
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adiciona um interceptador de requisição que será executado antes de qualquer requisição sair da aplicação
api.interceptors.request.use(
  (config) => {
    // Recupera o token JWT armazenado localmente no navegador (se existir)
    const token = localStorage.getItem('token');

    // Define rotas públicas que não devem exigir autenticação com token
    const publicRoutes = [
      '/clientes/cadastrar',   // Cadastro de cliente
      '/auth/login',           // Login de administrador/estoquista
      '/cliente/login',        // Login de cliente
      '/viacep/',              // Consulta de CEP
      '/checkout'              // Acesso à tela de checkout
    ];

    // Verifica se a URL da requisição corresponde a alguma rota pública
    const isPublic = publicRoutes.some(route => config.url.includes(route));

    // Se houver token e a rota não for pública, adiciona o token no cabeçalho Authorization
    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
      // Linha opcional para depuração: imprime o token no console
      // console.log("Token no cabeçalho:", config.headers.Authorization);
    }

    // Retorna a configuração modificada (ou original) para que a requisição prossiga
    return config;
  },

  // Caso ocorra um erro ao configurar a requisição, ele é rejeitado aqui
  (error) => {
    return Promise.reject(error);
  }
);

// Exporta a instância configurada do Axios para ser usada em toda a aplicação
export default api;
