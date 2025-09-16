import React from 'react';

const UserProfile = () => {
  return (
    <div style={{ padding: '25px' }}>
      <h2 style={{ color: '#1e293b', marginBottom: '30px', fontSize: '28px', fontWeight: '600' }}>
        Meu Perfil
      </h2>
      <div style={{
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#64748b', marginBottom: '15px' }}>
          Em Desenvolvimento
        </h3>
        <p style={{ color: '#94a3b8' }}>
          Funcionalidade de perfil do usuário será implementada em breve.
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
