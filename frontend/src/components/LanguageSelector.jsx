import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = ({ position = 'header' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { 
      code: 'pt', 
      name: 'Português', 
      flag: '🇧🇷',
      shortName: 'PT'
    },
    { 
      code: 'en', 
      name: 'English', 
      flag: '🇺🇸',
      shortName: 'EN'
    },
    { 
      code: 'es', 
      name: 'Español', 
      flag: '🇪🇸',
      shortName: 'ES'
    }
  ];

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  const buttonStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s',
    minWidth: '80px'
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: '0',
    marginTop: '4px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    minWidth: '140px',
    overflow: 'hidden'
  };

  const optionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 15px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151',
    transition: 'background-color 0.2s'
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={buttonStyle}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#f8fafc';
          e.target.style.borderColor = '#cbd5e1';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
          e.target.style.borderColor = '#e2e8f0';
        }}
      >
        <span style={{ fontSize: '16px' }}>{currentLang.flag}</span>
        <span>{currentLang.shortName}</span>
        <span style={{ 
          fontSize: '12px', 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s'
        }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <>
          {/* Overlay para fechar o dropdown */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setIsOpen(false)}
          />
          
          <div style={dropdownStyle}>
            {languages.map((lang) => (
              <div
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                style={{
                  ...optionStyle,
                  backgroundColor: language === lang.code ? '#f0f9ff' : 'transparent'
                }}
                onMouseOver={(e) => {
                  if (language !== lang.code) {
                    e.target.style.backgroundColor = '#f8fafc';
                  }
                }}
                onMouseOut={(e) => {
                  if (language !== lang.code) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{lang.flag}</span>
                <span>{lang.name}</span>
                {language === lang.code && (
                  <span style={{ 
                    marginLeft: 'auto', 
                    color: '#3b82f6',
                    fontSize: '12px'
                  }}>
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
