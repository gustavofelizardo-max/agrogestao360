import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, MapPin, Save, X, Search, Leaf } from 'lucide-react';

const Properties = () => {
  const { t } = useLanguage();
  const [properties, setProperties] = useState([]);
  const [cultures, setCultures] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCulturesModal, setShowCulturesModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchingCep, setSearchingCep] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    cep: '',
    address: '',
    number: '',
    city: '',
    neighborhood: '',
    state: '',
    total_area: '',
    arable_area: '',
    legal_reserve: '',
    main_culture_id: '',
    has_irrigation: false,
    has_machinery: false,
    has_storage: false,
    description: ''
  });

  useEffect(() => {
    fetchProperties();
    fetchCultures();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get('/properties');
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
      toast.error(t('properties.error.load') || 'Erro ao carregar propriedades');
    } finally {
      setLoading(false);
    }
  };

  const fetchCultures = async () => {
    try {
      const response = await api.get('/cultures');
      setCultures(response.data.cultures || []);
    } catch (error) {
      console.error('Erro ao buscar culturas:', error);
    }
  };

  const searchCep = async (cep) => {
    if (!cep || cep.length !== 8) {
      toast.error('CEP deve ter 8 dígitos');
      return;
    }

    setSearchingCep(true);
    try {
      const response = await api.get(`/cep/${cep}`);
      if (response.data.success) {
        const { address, city, state } = response.data.data;
        setFormData(prev => ({
          ...prev,
          address: address || '',
          city: city || '',
          state: state || ''
        }));
        toast.success('CEP encontrado!');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast.error('CEP não encontrado');
    } finally {
      setSearchingCep(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error(t('properties.error.name_required') || 'Nome é obrigatório');
      return;
    }

    try {
      setLoading(true);
      
      if (editingProperty) {
        await api.put(`/properties/${editingProperty.id}`, formData);
        toast.success(t('properties.success.updated') || 'Propriedade atualizada!');
      } else {
        await api.post('/properties', formData);
        toast.success(t('properties.success.created') || 'Propriedade cadastrada!');
      }
      
      resetForm();
      fetchProperties();
    } catch (error) {
      const message = error.response?.data?.message || 
                    (editingProperty ? 
                     t('properties.error.update') || 'Erro ao atualizar propriedade' : 
                     t('properties.error.create') || 'Erro ao cadastrar propriedade');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      name: property.name || '',
      owner: property.owner || '',
      cep: property.cep || '',
      address: property.address || '',
      number: property.number || '',
      city: property.city || '',
      neighborhood: property.neighborhood || '',
      state: property.state || '',
      total_area: property.total_area || '',
      arable_area: property.arable_area || '',
      legal_reserve: property.legal_reserve || '',
      main_culture_id: property.main_culture_id || '',
      has_irrigation: property.has_irrigation || false,
      has_machinery: property.has_machinery || false,
      has_storage: property.has_storage || false,
      description: property.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('properties.confirm.delete') || 'Confirma a exclusão desta propriedade?')) {
      try {
        setLoading(true);
        await api.delete(`/properties/${id}`);
        toast.success(t('properties.success.deleted') || 'Propriedade excluída!');
        fetchProperties();
      } catch (error) {
        toast.error(t('properties.error.delete') || 'Erro ao excluir propriedade');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      owner: '',
      cep: '',
      address: '',
      number: '',
      city: '',
      neighborhood: '',
      state: '',
      total_area: '',
      arable_area: '',
      legal_reserve: '',
      main_culture_id: '',
      has_irrigation: false,
      has_machinery: false,
      has_storage: false,
      description: ''
    });
    setEditingProperty(null);
    setShowForm(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // FUNÇÃO PARA ABRIR MODAL DE CULTURAS
  const handleManageCultures = () => {
    setShowCulturesModal(true);
  };

  // Modal de Culturas Simplificado
  const CulturesModal = () => {
    if (!showCulturesModal) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '80vh',
          overflow: 'auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <h3 style={{
              color: '#1e293b',
              fontSize: '20px',
              fontWeight: '600',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Leaf size={24} color="#059669" />
              {t('cultures.manage') || 'Gerenciar Culturas'}
            </h3>
            <button
              onClick={() => setShowCulturesModal(false)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                padding: '5px'
              }}
            >
              <X size={24} />
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 15px 0' }}>
              Para gerenciar culturas completamente, acesse o menu "Culturas" na barra lateral.
            </p>
            
            {cultures.length > 0 ? (
              <div>
                <h4 style={{ color: '#374151', fontSize: '16px', marginBottom: '15px' }}>
                  Culturas Cadastradas:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cultures.map((culture) => (
                    <div
                      key={culture.id}
                      style={{
                        padding: '12px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: '600', color: '#1e293b' }}>
                          {culture.name}
                        </span>
                        {culture.category && (
                          <span style={{ 
                            marginLeft: '10px',
                            fontSize: '12px',
                            color: '#64748b',
                            backgroundColor: '#e2e8f0',
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}>
                            {culture.category}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <Leaf size={48} color="#d1d5db" style={{ marginBottom: '15px' }} />
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                  Nenhuma cultura cadastrada ainda.
                </p>
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '20px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => setShowCulturesModal(false)}
              style={{
                backgroundColor: '#e5e7eb',
                color: '#374151',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
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
          <MapPin size={32} color="#3b82f6" />
          {t('properties.title') || 'Gestão de Propriedades'}
        </h2>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: showForm ? '#ef4444' : '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 
            (t('common.cancel') || 'Cancelar') : 
            (t('properties.new') || 'Nova Propriedade')
          }
        </button>
      </div>

      {showForm && (
        <div style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            marginBottom: '25px', 
            color: '#1e293b', 
            fontSize: '20px',
            fontWeight: '600'
          }}>
            {editingProperty ? 
              (t('properties.edit') || 'Editar Propriedade') : 
              (t('properties.add') || 'Adicionar Propriedade')
            }
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {t('properties.form.name') || 'Nome da Propriedade'} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Fazenda São João"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {t('properties.form.owner') || 'Proprietário'} *
                </label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => handleInputChange('owner', e.target.value)}
                  placeholder="Nome do proprietário"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {t('properties.form.cep') || 'CEP'} *
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={formData.cep}
                    onChange={(e) => handleInputChange('cep', e.target.value.replace(/\D/g, '').slice(0, 8))}
                    placeholder="12345678"
                    maxLength="8"
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => searchCep(formData.cep)}
                    disabled={searchingCep}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: searchingCep ? '#94a3b8' : '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      cursor: searchingCep ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Search size={14} />
                    {t('properties.search_cep') || 'Buscar'}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {t('properties.form.address') || 'Endereço'}
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Endereço será preenchido automaticamente"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {t('properties.form.number') || 'Número'}
                </label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  placeholder="280"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {t('properties.form.city') || 'Cidade'}
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Socorro"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {t('properties.form.neighborhood') || 'Bairro'}
                </label>
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  placeholder="Salto"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {t('properties.form.state') || 'UF'}
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="SP"
                  maxLength="2"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {t('properties.form.total_area') || 'Área Total (ha)'}
                </label>
                <input
                  type="number"
                  value={formData.total_area}
                  onChange={(e) => handleInputChange('total_area', e.target.value)}
                  placeholder="100"
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {t('properties.form.arable_area') || 'Área Arável (ha)'}
                </label>
                <input
                  type="number"
                  value={formData.arable_area}
                  onChange={(e) => handleInputChange('arable_area', e.target.value)}
                  placeholder="80"
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {t('properties.form.legal_reserve') || 'Reserva Legal (ha)'}
                </label>
                <input
                  type="number"
                  value={formData.legal_reserve}
                  onChange={(e) => handleInputChange('legal_reserve', e.target.value)}
                  placeholder="20"
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#374151'
              }}>
                {t('properties.form.main_cultures') || 'Culturas Principais'}
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  value={formData.main_culture_id}
                  onChange={(e) => handleInputChange('main_culture_id', e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#fff'
                  }}
                >
                  <option value="">Selecionar cultura principal</option>
                  {cultures.map(culture => (
                    <option key={culture.id} value={culture.id}>
                      {culture.name}
                    </option>
                  ))}
                </select>
                
                {/* BOTÃO "GERENCIAR CULTURAS" - AGORA FUNCIONA! */}
                <button
                  type="button"
                  onClick={handleManageCultures}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Leaf size={14} />
                  {t('cultures.manage') || 'Gerenciar Culturas'}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '12px', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Recursos Disponíveis
              </label>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.has_irrigation}
                    onChange={(e) => handleInputChange('has_irrigation', e.target.checked)}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span style={{ color: '#374151', fontSize: '14px' }}>
                    {t('properties.form.has_irrigation') || 'Possui Irrigação'}
                  </span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.has_machinery}
                    onChange={(e) => handleInputChange('has_machinery', e.target.checked)}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span style={{ color: '#374151', fontSize: '14px' }}>
                    {t('properties.form.has_machinery') || 'Possui Maquinário'}
                  </span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.has_storage}
                    onChange={(e) => handleInputChange('has_storage', e.target.checked)}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span style={{ color: '#374151', fontSize: '14px' }}>
                    {t('properties.form.has_storage') || 'Possui Armazenamento'}
                  </span>
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#374151'
              }}>
                {t('properties.form.description') || 'Descrição Adicional'}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Informações adicionais sobre a propriedade"
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: loading ? '#94a3b8' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <Save size={16} />
                {loading ? 
                  (t('common.loading') || 'Carregando...') :
                  (editingProperty ? 
                    (t('common.update') || 'Atualizar') : 
                    (t('common.save') || 'Salvar')
                  )
                }
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <X size={16} />
                {t('common.cancel') || 'Cancelar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && !showForm ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '15px', color: '#6b7280' }}>
            {t('common.loading') || 'Carregando propriedades...'}
          </p>
        </div>
      ) : properties.length === 0 ? (
        <div style={{
          backgroundColor: '#fff',
          padding: '60px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <MapPin size={64} color="#d1d5db" style={{ marginBottom: '20px' }} />
          <h3 style={{ color: '#64748b', marginBottom: '15px', fontSize: '20px' }}>
            Nenhuma propriedade cadastrada
          </h3>
          <p style={{ color: '#94a3b8', marginBottom: '20px', fontSize: '16px' }}>
            Cadastre sua primeira propriedade para começar
          </p>
          <button
            onClick={() => setShowForm(true)}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Cadastrar Primeira Propriedade
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '20px' 
        }}>
          {properties.map((property) => (
            <div
              key={property.id}
              style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                marginBottom: '15px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={20} color="#3b82f6" />
                  <h3 style={{ 
                    margin: 0, 
                    color: '#1e293b', 
                    fontSize: '18px', 
                    fontWeight: '600' 
                  }}>
                    {property.name}
                  </h3>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEdit(property)}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={t('common.edit') || 'Editar'}
                  >
                    <Edit size={14} />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(property.id)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={t('common.delete') || 'Excluir'}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {property.owner && (
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '14px', 
                  margin: '0 0 8px 0'
                }}>
                  👤 {property.owner}
                </p>
              )}

              {property.city && property.state && (
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '14px', 
                  margin: '0 0 8px 0'
                }}>
                  📍 {property.city} - {property.state}
                </p>
              )}

              {property.total_area && (
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '14px', 
                  margin: '0 0 12px 0',
                  fontWeight: '500'
                }}>
                  🌾 {property.total_area} hectares
                </p>
              )}

              {property.culture_name && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ 
                    backgroundColor: '#ecfdf5', 
                    color: '#059669', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    🌱 {property.culture_name}
                  </span>
                </div>
              )}

              {property.description && (
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '14px', 
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  {property.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Culturas */}
      <CulturesModal />

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Properties;
