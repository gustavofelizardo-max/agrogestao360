import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Users, Plus, Edit, Trash2, Shield, Search,
  Filter, Eye, EyeOff, Save, X, Mail, Phone,
  Building, MapPin, User, Lock
} from 'lucide-react';
import './UsersManagement.css';

const UsersManagement = () => {
  const { t } = useLanguage();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProfile, setFilterProfile] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    user_type: 'producer',
    profile_id: '',
    phone: '',
    company: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchProfiles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/profiles', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setProfiles(data.profiles);
      }
    } catch (error) {
      console.error('Erro ao carregar perfis:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const method = editingUser ? 'PUT' : 'POST';
      const url = editingUser
        ? `http://localhost:8000/api/users/${editingUser.id}`
        : 'http://localhost:8000/api/users';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(editingUser ? 'Usuário atualizado!' : 'Usuário criado!');
        setShowModal(false);
        resetForm();
        fetchUsers();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Erro ao salvar usuário');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Usuário desativado com sucesso');
        fetchUsers();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Erro ao excluir usuário');
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      name: user.name,
      user_type: user.user_type,
      profile_id: user.profile_id || '',
      phone: user.phone || '',
      company: user.company || '',
      city: user.city || '',
      state: user.state || ''
    });
    setShowModal(true);
  };

  const openPermissionsModal = async (profile) => {
    setSelectedProfile(profile);
    setShowPermissionsModal(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/profiles/${profile.id}/permissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSelectedProfile({ ...profile, permissions: data.permissions });
      }
    } catch (error) {
      console.error('Erro ao buscar permissões:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      user_type: 'producer',
      profile_id: '',
      phone: '',
      company: '',
      city: '',
      state: ''
    });
    setEditingUser(null);
    setShowPassword(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProfile = !filterProfile || user.profile_id?.toString() === filterProfile;
    return matchesSearch && matchesProfile;
  });

  const getProfileBadgeColor = (profileName) => {
    const colors = {
      admin: 'badge-admin',
      producer: 'badge-producer',
      manager: 'badge-manager',
      supplier: 'badge-supplier',
      buyer: 'badge-buyer',
      viewer: 'badge-viewer'
    };
    return colors[profileName] || 'badge-default';
  };

  const getStatusBadgeColor = (status) => {
    return status === 'active' ? 'badge-success' : 'badge-danger';
  };
  
  // CONTINUA NA PARTE 2...
// CONTINUAÇÃO DA PARTE 1...
  
  return (
    <div className="users-management">
      <div className="page-header">
        <div className="header-left">
          <h1><Users size={32} /> {t('users.title') || 'Gerenciamento de Usuários'}</h1>
          <p>{t('users.subtitle') || 'Gerencie usuários e suas permissões'}</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus size={20} /> {t('users.new') || 'Novo Usuário'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Filtros */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder={t('users.search_placeholder') || 'Buscar por nome ou email...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <Filter size={20} />
          <select
            value={filterProfile}
            onChange={(e) => setFilterProfile(e.target.value)}
          >
            <option value="">{t('users.all_roles') || 'Todos os perfis'}</option>
            {profiles.map(profile => (
              <option key={profile.id} value={profile.id}>
                {t(`user.types.${profile.name}`) || profile.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de usuários */}
      {loading ? (
        <div className="loading">{t('users.loading') || 'Carregando usuários...'}</div>
      ) : (
        <div className="users-grid">
          {filteredUsers.length === 0 ? (
            <div className="no-data">{t('users.no_users') || 'Nenhum usuário encontrado'}</div>
          ) : (
            filteredUsers.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-header">
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="user-details">
                  <div className="detail-row">
                    <Shield size={16} />
                    <span className={`badge ${getProfileBadgeColor(user.profile_name)}`}>
                      {t(`user.types.${user.profile_name}`) || user.profile_name}
                    </span>
                  </div>
                  
                  {user.company && (
                    <div className="detail-row">
                      <Building size={16} />
                      <span>{user.company}</span>
                    </div>
                  )}
                  
                  {user.phone && (
                    <div className="detail-row">
                      <Phone size={16} />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  
                  {(user.city || user.state) && (
                    <div className="detail-row">
                      <MapPin size={16} />
                      <span>{[user.city, user.state].filter(Boolean).join(', ')}</span>
                    </div>
                  )}

                  <div className="detail-row">
                    <span className={`badge ${getStatusBadgeColor(user.status)}`}>
                      {user.status === 'active' ? (t('users.active') || 'Ativo') : (t('users.inactive') || 'Inativo')}
                    </span>
                  </div>
                </div>

                <div className="user-actions">
                  <button
                    className="btn-icon"
                    onClick={() => openEditModal(user)}
                    title={t('common.edit') || 'Editar'}
                  >
                    <Edit size={18} />
                  </button>
                  
                  {user.id !== currentUser?.id && user.profile_name !== 'admin' && (
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDelete(user.id)}
                      title={t('common.delete') || 'Excluir'}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Seção de Perfis e Permissões */}
      <div className="profiles-section">
        <h2><Shield size={24} /> {t('profiles.title') || 'Perfis e Permissões'}</h2>
        <div className="profiles-grid">
          {profiles.map(profile => (
            <div key={profile.id} className="profile-card">
              <h3>{t(`user.types.${profile.name}`) || profile.name}</h3>
              <p>{profile.description}</p>
              <div className="profile-stats">
                <span>{profile.user_count} {t('profiles.users') || 'usuários'}</span>
                <span>{profile.permission_count} {t('profiles.permissions') || 'permissões'}</span>
              </div>
              {currentUser?.profile === 'admin' && (
                <button
                  className="btn btn-secondary"
                  onClick={() => openPermissionsModal(profile)}
                >
                  {t('profiles.manage_permissions') || 'Gerenciar Permissões'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Usuário */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? (t('users.edit') || 'Editar Usuário') : (t('users.new') || 'Novo Usuário')}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label><User size={16} /> {t('users.form.name') || 'Nome Completo'} *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder={t('users.form.name_placeholder') || 'João Silva'}
                    required
                  />
                </div>

                <div className="form-group">
                  <label><Mail size={16} /> {t('users.form.email') || 'Email'} *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder={t('users.form.email_placeholder') || 'joao@empresa.com'}
                    required
                  />
                </div>

                <div className="form-group">
                  <label><Lock size={16} /> {t('users.form.password') || 'Senha'} {editingUser && '(opcional)'}</label>
                  <div className="password-input">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      required={!editingUser}
                    />
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label><Shield size={16} /> {t('users.form.profile') || 'Perfil'} *</label>
                  <select
                    value={formData.profile_id}
                    onChange={(e) => setFormData({...formData, profile_id: e.target.value})}
                    required
                  >
                    <option value="">{t('users.form.select_profile') || 'Selecione um perfil'}</option>
                    {profiles.map(profile => (
                      <option key={profile.id} value={profile.id}>
                        {t(`user.types.${profile.name}`) || profile.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label><Phone size={16} /> {t('users.form.phone') || 'Telefone'}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="form-group">
                  <label><Building size={16} /> {t('users.form.company') || 'Empresa'}</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder={t('users.form.company_placeholder') || 'Nome da empresa'}
                  />
                </div>

                <div className="form-group">
                  <label><MapPin size={16} /> {t('users.form.city') || 'Cidade'}</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder={t('users.form.city_placeholder') || 'São Paulo'}
                  />
                </div>

                <div className="form-group">
                  <label><MapPin size={16} /> {t('users.form.state') || 'Estado'}</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    placeholder="SP"
                    maxLength="2"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  {t('common.cancel') || 'Cancelar'}
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={20} /> {editingUser ? (t('common.update') || 'Atualizar') : (t('common.save') || 'Salvar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Permissões */}
      {showPermissionsModal && selectedProfile && (
        <div className="modal-overlay" onClick={() => setShowPermissionsModal(false)}>
          <div className="modal-content permissions-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('profiles.permissions_for') || 'Permissões para'} {t(`user.types.${selectedProfile.name}`) || selectedProfile.name}</h2>
              <button className="btn-close" onClick={() => setShowPermissionsModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="permissions-list">
              {selectedProfile.permissions?.map(perm => (
                <div key={perm.id} className="permission-item">
                  <div>
                    <strong>{perm.resource}</strong> - {perm.action}
                    <p>{perm.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowPermissionsModal(false)}>
                {t('common.close') || 'Fechar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
