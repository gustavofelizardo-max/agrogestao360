import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Leaf } from 'lucide-react';

const CultureManagement = () => {
  const [cultures, setCultures] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCulture, setEditingCulture] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    season: '',
    cycle_days: '',
    description: ''
  });

  const categories = [
    'Grãos',
    'Oleaginosas', 
    'Fibra',
    'Bebida',
    'Energia',
    'Hortaliças',
    'Frutas',
    'Forragem'
  ];

  const seasons = [
    'Verão',
    'Inverno', 
    'Anual',
    'Perene'
  ];

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
      toast.error('Erro ao carregar culturas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCulture) {
        await api.put(`/cultures/${editingCulture.id}`, formData);
        toast.success('Cultura atualizada!');
      } else {
        await api.post('/cultures', formData);
        toast.success('Cultura cadastrada!');
      }
      
      resetForm();
      fetchCultures();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar cultura';
      toast.error(message);
    }
  };

  const handleEdit = (culture) => {
    setEditingCulture(culture);
    setFormData(culture);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirma a exclusão desta cultura?')) {
      try {
        await api.delete(`/cultures/${id}`);
        toast.success('Cultura excluída!');
        fetchCultures();
      } catch (error) {
        toast.error('Erro ao excluir cultura');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      season: '',
      cycle_days: '',
      description: ''
    });
    setEditingCulture(null);
    setShowForm(false);
  };

  return (
    <div style={{ padding: '25px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#1e293b', margin: 0, fontSize: '28px', fontWeight: '600' }}>
          Gestão de Culturas
        </h2>
        <button 
          onClick={() => setShowForm(!showForm)}
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
          <Plus size={16} />
          {showForm ? 'Cancelar' : 'Nova Cultura'}
        </button>
      </div>

      {showForm && (
        <form 
          onSubmit={handleSubmit}
          style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginBottom: '30px',
            border: '1px solid #e2e8f0'
          }}
        >
          <h3 style={{ marginBottom: '20px', color: '#1e293b', fontSize: '20px' }}>
            {editingCulture ? 'Editar Cultura' : 'Nova Cultura'}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Nome da Cultura *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="Ex: Soja, Milho, Algodão"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Selecionar categoria</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Época de Plantio
              </label>
              <select
                value={formData.season}
                onChange={(e) => setFormData({...formData, season: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Selecionar época</option>
                {seasons.map((season) => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Ciclo (dias)
              </label>
              <input
                type="number"
                value={formData.cycle_days}
                onChange={(e) => setFormData({...formData, cycle_days: e.target.value})}
                placeholder="Ex: 120"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
              placeholder="Informações adicionais sobre a cultura"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              type="submit"
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
              {editingCulture ? 'Atualizar' : 'Cadastrar'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{
                backgroundColor: '#e5e7eb',
                color: '#374151',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #059669',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '15px', color: '#6b7280' }}>Carregando culturas...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {cultures.map((culture) => (
            <div
              key={culture.id}
              style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Leaf size={20} color="#059669" />
                  <h3 style={{ margin: 0, color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>
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
                      padding: '6px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(culture.id)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '6px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              {culture.category && (
                <span style={{
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginBottom: '10px',
                  display: 'inline-block'
                }}>
                  {culture.category}
                </span>
              )}
              
              <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                {culture.season && (
                  <p style={{ margin: '5px 0' }}>
                    <strong>Época:</strong> {culture.season}
                  </p>
                )}
                {culture.cycle_days && (
                  <p style={{ margin: '5px 0' }}>
                    <strong>Ciclo:</strong> {culture.cycle_days} dias
                  </p>
                )}
                {culture.description && (
                  <p style={{ margin: '10px 0 0', color: '#4b5563' }}>
                    {culture.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && cultures.length === 0 && (
        <div style={{
          backgroundColor: '#fff',
          padding: '60px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <Leaf size={64} color="#d1d5db" style={{ marginBottom: '20px' }} />
          <h3 style={{ color: '#6b7280', marginBottom: '15px', fontSize: '20px' }}>
            Nenhuma cultura cadastrada
          </h3>
          <p style={{ color: '#9ca3af', marginBottom: '20px', fontSize: '16px' }}>
            Comece cadastrando as culturas disponíveis em sua região
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
            Cadastrar Primeira Cultura
          </button>
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

export default CultureManagement;
