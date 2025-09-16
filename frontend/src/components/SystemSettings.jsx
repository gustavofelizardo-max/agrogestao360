import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Settings, Globe, Bell, Key, Database, Save } from 'lucide-react';

const SystemSettings = () => {
  const { t, language, setLanguage } = useLanguage();
  const [settings, setSettings] = useState({
    language: language,
    notifications: true,
    emailAlerts: true,
    weatherUpdates: true,
    apiKey: '',
    backupFrequency: 'daily'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    if (key === 'language') {
      setLanguage(value);
    }
  };

  const handleSave = () => {
    // Implementar salvamento das configurações
    console.log('Configurações salvas:', settings);
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
          <Settings size={32} color="#3b82f6" />
          {t('settings.title') || 'Configurações do Sistema'}
        </h2>
        
        <button 
          onClick={handleSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <Save size={16} />
          {t('common.save') || 'Salvar'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: '25px' }}>
        {/* Idioma */}
        <div style={{
          backgroundColor: '#fff',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Globe size={24} color="#3b82f6" />
            <h3 style={{ color: '#1e293b', fontSize: '18px', fontWeight: '600', margin: 0 }}>
              {t('settings.language') || 'Idioma'}
            </h3>
          </div>
          
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            style={{
              width: '200px',
              padding: '10px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#fff'
            }}
          >
            <option value="pt">🇧🇷 Português</option>
            <option value="en">🇺🇸 English</option>
            <option value="es">🇪🇸 Español</option>
          </select>
        </div>

        {/* Notificações */}
        <div style={{
          backgroundColor: '#fff',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Bell size={24} color="#3b82f6" />
            <h3 style={{ color: '#1e293b', fontSize: '18px', fontWeight: '600', margin: 0 }}>
              {t('settings.notifications') || 'Notificações'}
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ color: '#374151', fontSize: '14px' }}>
                Notificações gerais do sistema
              </span>
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ color: '#374151', fontSize: '14px' }}>
                Alertas por email
              </span>
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.weatherUpdates}
                onChange={(e) => handleSettingChange('weatherUpdates', e.target.checked)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ color: '#374151', fontSize: '14px' }}>
                Atualizações meteorológicas
              </span>
            </label>
          </div>
        </div>

        {/* API */}
        <div style={{
          backgroundColor: '#fff',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Key size={24} color="#3b82f6" />
            <h3 style={{ color: '#1e293b', fontSize: '18px', fontWeight: '600', margin: 0 }}>
              {t('settings.api') || 'Configurações de API'}
            </h3>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: '#374151',
              fontSize: '14px'
            }}>
              Chave da API do Clima
            </label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => handleSettingChange('apiKey', e.target.value)}
              placeholder="Digite sua chave da API"
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '10px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* Backup */}
        <div style={{
          backgroundColor: '#fff',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Database size={24} color="#3b82f6" />
            <h3 style={{ color: '#1e293b', fontSize: '18px', fontWeight: '600', margin: 0 }}>
              Backup e Dados
            </h3>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: '#374151',
              fontSize: '14px'
            }}>
              Frequência de Backup
            </label>
            <select
              value={settings.backupFrequency}
              onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
              style={{
                width: '200px',
                padding: '10px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            >
              <option value="hourly">A cada hora</option>
              <option value="daily">Diariamente</option>
              <option value="weekly">Semanalmente</option>
              <option value="monthly">Mensalmente</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
