import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respostas - gerenciar tokens expirados
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se receber erro 401 ou 403, token pode estar inválido
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const message = error.response.data?.message;
      
      if (message && (message.includes('Token') || message.includes('inválido') || message.includes('expirado'))) {
        console.log('Token inválido detectado, fazendo logout...');
        
        // Limpar dados de autenticação
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        
        // Mostrar mensagem e redirecionar para login
        toast.error('Sessão expirada. Faça login novamente.');
        
        // Recarregar página para voltar ao login
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
