import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Timer, MapPin, Zap } from 'lucide-react';

const LogCardio = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '',
    distance: '',
    type: 'RUNNING' // or 'CYCLING'
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
      const res = await fetch('http://localhost:3001/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.type === 'RUNNING' ? 'Corrida' : 'Ciclismo',
          type: formData.type,
          date: new Date(formData.date).toISOString(),
          notes: `Tempo: ${formData.duration} min | Distância: ${formData.distance} km`,
          exercises: [
            {
              name: formData.type === 'RUNNING' ? 'Corrida' : 'Ciclismo',
              duration: parseInt(formData.duration) || 0,
              distance: parseFloat(formData.distance) || 0
            }
          ]
        })
      });

      if (!res.ok) throw new Error('Falha ao salvar registro de cardio.');
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
        <h1 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Registrar Cardio</h1>
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
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}><Zap size={16} /> Modalidade</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'RUNNING' })}
                style={{ 
                  flex: 1, padding: '1rem', borderRadius: '12px',
                  background: formData.type === 'RUNNING' ? 'rgba(0, 204, 255, 0.2)' : 'var(--bg-base)',
                  border: formData.type === 'RUNNING' ? '1px solid #00ccff' : '1px solid rgba(255,255,255,0.1)',
                  color: formData.type === 'RUNNING' ? '#00ccff' : '#fff', fontWeight: '600'
                }}>
                Corrida
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'CYCLING' })}
                style={{ 
                  flex: 1, padding: '1rem', borderRadius: '12px',
                  background: formData.type === 'CYCLING' ? 'rgba(0, 204, 255, 0.2)' : 'var(--bg-base)',
                  border: formData.type === 'CYCLING' ? '1px solid #00ccff' : '1px solid rgba(255,255,255,0.1)',
                  color: formData.type === 'CYCLING' ? '#00ccff' : '#fff', fontWeight: '600'
                }}>
                Ciclismo
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Data</label>
            <input 
              type="date" name="date" value={formData.date} onChange={handleChange} required
              style={{ width: '100%', padding: '1rem', background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}><Timer size={16} /> Tempo (minutos)</label>
            <input 
              type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="Ex: 45" required min="1"
              style={{ width: '100%', padding: '1rem', background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '1rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}><MapPin size={16} /> Distância (km)</label>
            <input 
              type="number" name="distance" step="0.1" value={formData.distance} onChange={handleChange} placeholder="Ex: 5.5" required min="0.1"
              style={{ width: '100%', padding: '1rem', background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '1rem' }}
            />
          </div>

          <button 
            type="submit" disabled={isLoading}
            style={{ 
              width: '100%', padding: '1.25rem', borderRadius: '12px', marginTop: '1rem',
              background: 'linear-gradient(90deg, #00ccff 0%, #0099ff 100%)', 
              color: '#fff', fontSize: '1.1rem', fontWeight: '700', border: 'none',
              boxShadow: '0 4px 14px rgba(0, 204, 255, 0.4)', opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Salvando...' : 'Salvar Atividade'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogCardio;
