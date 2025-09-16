import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Leaf, Save, X } from 'lucide-react';

const Cultures = () => {
  const { t } = useLanguage();
  const [cultures, setCultures] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCulture, setEditingCulture] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Grãos',
    season: 'Verão',
    cycle_days: '',
    description: ''
  });

  const categories = [
    'Grãos', 'Oleaginosas', 'Fibra', 'Bebida', 
    'Energia', 'Hortaliças', 'Frutas', 'Forragem'
  ];

  const seasons = ['Verão', 'Inverno', 'Anual', 'Perene'];

  useEffect(() => {
    fetchCultures();
  }, []);

  const fetchCultures = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cultures');
      setCultures(response.data.cultures || []);
    } catch (error) {
      console.error('Erro ao buscar culturas:', error);
      toast.error(t('cultures.error.load') || 'Erro ao carregar culturas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error(t('cultures.error.name_required') || 'Nome é obrigatório');
      return;
    }

    try {
      setLoading(true);
      
      if (editingCulture) {
        await api.put(`/cultures/${editingCulture.id}`, formData);
        toast.success(t('cultures.success.updated') || 'Cultura atualizada!');
      } else {
        await api.post('/cultures', formData);
        toast.success(t('cultures.success.created') || 'Cultura cadastrada!');
      }
      
      resetForm();
      fetchCultures();
    } catch (error) {
      const message = error.response?.data?.message || 
                    (editingCulture ? 
                     t('cultures.error.update') || 'Erro ao atualizar cultura' : 
                     t('cultures.error.create') || 'Erro ao cadastrar cultura');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (culture) => {
    setEditingCulture(culture);
    setFormData({
      name: culture.name || '',
      category: culture.category || 'Grãos',
      season: culture.season || 'Verão',
      cycle_days: culture.cycle_days || '',
      description: culture.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('cultures.confirm.delete') || 'Confirma a exclusão desta cultura?')) {
      try {
        setLoading(true);
        await api.delete(`/cultures/${id}`);
        toast.success(t('cultures.success.deleted') || 'Cultura excluída!');
        fetchCultures();
      } catch (error) {
        toast.error(t('cultures.error.delete') || 'Erro ao excluir cultura');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Grãos',
      season: 'Verão',
      cycle_days: '',
      description: ''
    });
    setEditingCulture(null);
    setShowForm(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
          <Leaf size={32} color="#059669" />
          {t('cultures.title') || 'Gestão de Culturas'}
        </h2>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: showForm ? '#ef4444' : '#059669',
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
            (t('cultures.new') || 'Nova Cultura')
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
            {editingCulture ? 
              (t('cultures.edit') || 'Editar Cultura') : 
              (t('cultures.add') || 'Adicionar Cultura')
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
                  {t('cultures.form.name') || 'Nome da Cultura'} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('cultures.form.name_placeholder') || 'Ex: Café'}
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
                  {t('cultures.form.category') || 'Categoria'}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#fff'
                  }}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {t('cultures.form.season') || 'Época de Plantio'}
                </label>
                <select
                  value={formData.season}
                  onChange={(e) => handleInputChange('season', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#fff'
                  }}
                >
                  {seasons.map(season => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {t('cultures.form.cycle') || 'Ciclo (dias)'}
                </label>
                <input
                  type="number"
                  value={formData.cycle_days}
                  onChange={(e) => handleInputChange('cycle_days', e.target.value)}
                  placeholder="Ex: 1095"
                  min="1"
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

            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#374151'
              }}>
                {t('cultures.form.description') || 'Descrição'}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={t('cultures.form.description_placeholder') || 'Informações adicionais sobre a cultura'}
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
                  backgroundColor: loading ? '#94a3b8' : '#059669',
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
                  (editingCulture ? 
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
            borderTop: '3px solid #059669',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '15px', color: '#6b7280' }}>
            {t('cultures.loading') || 'Carregando culturas...'}
          </p>
        </div>
      ) : cultures.length === 0 ? (
        <div style={{
          backgroundColor: '#fff',
          padding: '60px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <Leaf size={64} color="#d1d5db" style={{ marginBottom: '20px' }} />
          <h3 style={{ color: '#64748b', marginBottom: '15px', fontSize: '20px' }}>
            {t('cultures.empty.title') || 'Nenhuma cultura cadastrada'}
          </h3>
          <p style={{ color: '#94a3b8', marginBottom: '20px', fontSize: '16px' }}>
            {t('cultures.empty.description') || 'Cadastre sua primeira cultura para começar'}
          </p>
          <button
            onClick={() => setShowForm(true)}
            style={{
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {t('cultures.empty.button') || 'Cadastrar Primeira Cultura'}
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '20px' 
        }}>
          {cultures.map((culture) => (
            <div
              key={culture.id}
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
                  <Leaf size={20} color="#059669" />
                  <h3 style={{ 
                    margin: 0, 
                    color: '#1e293b', 
                    fontSize: '18px', 
                    fontWeight: '600' 
                  }}>
                    {culture.name}
                  </h3>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEdit(culture)}
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
                    onClick={() => handleDelete(culture.id)}
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

              <div style={{ marginBottom: '12px' }}>
                <span style={{ 
                  backgroundColor: '#f1f5f9', 
                  color: '#0f172a', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '12px',
                  fontWeight: '500',
                  marginRight: '8px'
                }}>
                  {culture.category}
                </span>
                <span style={{ 
                  backgroundColor: '#ecfdf5', 
                  color: '#059669', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {culture.season}
                </span>
              </div>

              {culture.cycle_days && (
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '14px', 
                  margin: '0 0 12px 0',
                  fontWeight: '500'
                }}>
                  🕒 {culture.cycle_days} dias de ciclo
                </p>
              )}

              {culture.description && (
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '14px', 
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  {culture.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Cultures;
