import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Timer, Activity, Zap } from 'lucide-react';

const LogMartialArts = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '',
    intensity: 'leve' // leve, moderado, intenso, muito_intenso
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // Formata a intensidade para texto legível nas notas
      const formattedIntensity = formData.intensity.replace('_', ' ').toUpperCase();

      const res = await fetch('http://localhost:3001/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Artes Marciais / Lutas',
          type: 'MARTIAL_ARTS',
          date: new Date(formData.date).toISOString(),
          notes: `Tempo: ${formData.duration} min | Intensidade: ${formattedIntensity}`,
          exercises: []
        })
      });

      if (!res.ok) throw new Error('Falha ao salvar registro de lutas.');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%', minHeight: '100vh', 
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
      color: '#fff', fontFamily: '"Inter", sans-serif',
      padding: '2rem 1.5rem',
      display: 'flex', flexDirection: 'column'
    }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/')} style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Registrar Lutas</h1>
      </header>

      {error && <div style={{ color: '#ffb3b3', background: '#ff333333', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '1.5rem',
        padding: '2rem',
        flex: 1
      }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Data</label>
            <input 
              type="date" name="date" value={formData.date} onChange={handleChange} required
              style={{ width: '100%', padding: '1rem', background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}><Timer size={16} /> Tempo Total (minutos)</label>
            <input 
              type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="Ex: 60" required min="1"
              style={{ width: '100%', padding: '1rem', background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '1rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}><Activity size={16} /> Intensidade (Percepção de Esforço)</label>
            <select 
              name="intensity" value={formData.intensity} onChange={handleChange} required
              style={{ width: '100%', padding: '1rem', background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '1rem', appearance: 'none' }}
            >
              <option value="leve">Leve</option>
              <option value="moderado">Moderado</option>
              <option value="intenso">Intenso</option>
              <option value="muito_intenso">Muito Intenso</option>
            </select>
          </div>

          <button 
            type="submit" disabled={isLoading}
            style={{ 
              width: '100%', padding: '1.25rem', borderRadius: '12px', marginTop: '1rem',
              background: 'linear-gradient(90deg, #ff4d4d 0%, #ff1a1a 100%)', 
              color: '#fff', fontSize: '1.1rem', fontWeight: '700', border: 'none',
              boxShadow: '0 4px 14px rgba(255, 77, 77, 0.4)', opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Salvando...' : 'Salvar Atividade'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogMartialArts;
