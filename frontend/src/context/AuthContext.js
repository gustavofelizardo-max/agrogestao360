import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar se há token válido ao carregar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        // Verificar se o token não expirou
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        if (tokenPayload.exp > currentTime) {
          // Token ainda válido
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
          
          // Configurar token no axios
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          // Token expirado
          console.log('Token expirado, removendo...');
          logout();
        }
      }
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await api.post('http://localhost:8000/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const { token, user: userData } = response.data;
        
        // Salvar no localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Configurar header do axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Atualizar estado
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message || 'Erro no login' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      
      let message = 'Erro ao fazer login';
      if (error.response) {
        message = error.response.data?.message || 'Credenciais inválidas';
      } else if (error.request) {
        message = 'Erro de conexão. Verifique se o servidor está funcionando.';
      }
      
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Limpar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpar header do axios
    delete api.defaults.headers.common['Authorization'];
    
    // Atualizar estado
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshAuth = () => {
    // Função para recarregar dados de autenticação
    checkAuthStatus();
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
