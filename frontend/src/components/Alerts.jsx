import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Bell, AlertTriangle, Info, CheckCircle, Plus } from 'lucide-react';

const Alerts = () => {
  const { t } = useLanguage();
  const [alerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Previsão de Chuva',
      message: 'Chuva prevista para os próximos 3 dias na região da propriedade.',
      timestamp: '2024-01-15T10:30:00Z',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Época de Plantio',
      message: 'Época ideal para plantio de milho está se aproximando.',
      timestamp: '2024-01-14T14:20:00Z',
      read: true
    }
  ]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={20} color="#f59e0b" />;
      case 'error':
        return <AlertTriangle size={20} color="#ef4444" />;
      case 'success':
        return <CheckCircle size={20} color="#10b981" />;
      default:
        return <Info size={20} color="#3b82f6" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning':
        return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' };
      case 'error':
        return { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' };
      case 'success':
        return { bg: '#ecfdf5', border: '#10b981', text: '#065f46' };
      default:
        return { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' };
    }
  };

  return (
    <div style={{ padding: '25px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          color: '#1e293b', 
          margin: 0, 
          fontSize: '28px', 
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Bell size={32} color="#3b82f6" />
          {t('alerts.title') || 'Alertas e Notificações'}
        </h2>
        
        <button 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <Plus size={16} />
          {t('alerts.new') || 'Novo Alerta'}
        </button>
      </div>

      {alerts.length === 0 ? (
        <div style={{
          backgroundColor: '#fff',
          padding: '60px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <Bell size={64} color="#d1d5db" style={{ marginBottom: '20px' }} />
          <h3 style={{ color: '#64748b', marginBottom: '15px', fontSize: '20px' }}>
            {t('alerts.empty.title') || 'Nenhum alerta ativo'}
          </h3>
          <p style={{ color: '#94a3b8', marginBottom: '0', fontSize: '16px' }}>
            {t('alerts.empty.description') || 'Quando houver alertas importantes, eles aparecerão aqui'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {alerts.map((alert) => {
            const colors = getAlertColor(alert.type);
            return (
              <div
                key={alert.id}
                style={{
                  backgroundColor: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                  opacity: alert.read ? 0.7 : 1,
                  transition: 'opacity 0.2s'
                }}
              >
                {getAlertIcon(alert.type)}
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    color: colors.text, 
                    fontSize: '16px', 
                    fontWeight: '600',
                    margin: '0 0 8px 0'
                  }}>
                    {alert.title}
                  </h3>
                  
                  <p style={{ 
                    color: colors.text, 
                    fontSize: '14px',
                    margin: '0 0 8px 0',
                    lineHeight: '1.5'
                  }}>
                    {alert.message}
                  </p>
                  
                  <span style={{ 
                    color: colors.text,
                    fontSize: '12px',
                    opacity: 0.7
                  }}>
                    {new Date(alert.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
                
                {!alert.read && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: colors.border,
                    borderRadius: '50%',
                    marginTop: '4px'
                  }}></div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Alerts;
