import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Lock, Globe } from 'lucide-react';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, language, cycleLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'producer'
  });

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
      console.log('Enviando:', formData);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: formData.email,
    password: formData.password
  })  // Enviando apenas email e senha
});

      const data = await response.json();

      if (data.success) {
      // Salvar o token e usuário
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirecionar para o dashboard
      window.location.href = '/dashboard';
    } else {
      setError(data.message || 'Erro ao fazer login');
    }
  } catch (err) {
    setError('Erro de conexão. Verifique se o servidor está rodando.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <div className="language-selector">
        <button 
          className="language-btn"
          onClick={() => setShowLangDropdown(!showLangDropdown)}
        >
          <Globe size={20} />
          <span>{languages.find(l => l.code === language)?.flag}</span>
        </button>
        
        {showLangDropdown && (
          <div className="language-dropdown">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
               cycleLanguage();
                  setShowLangDropdown(false);
                }}
                className={language === lang.code ? 'active' : ''}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="login-box">
        <div className="login-header">
          <img src="/logo.png" alt="AgroTech" className="logo" />
          <h1>Sistema de Gestão Agrícola</h1>
          <p>Sistema completo de gestão para o agronegócio</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>{t('auth.email')}</label>
            <div className="input-with-icon">
              <User size={20} />
              <input
                type="email"
                placeholder={t('auth.email_placeholder')}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('auth.password')}</label>
            <div className="input-with-icon">
              <Lock size={20} />
              <input
                type="password"
                placeholder={t('auth.password_placeholder')}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? t('auth.logging_in') : t('auth.login')}
          </button>
        </form>

        <div className="login-footer">
          <p className="hint">
            Use: admin@agrotech.com / admin123 ou gufeliza@gmail.com / 123456
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
