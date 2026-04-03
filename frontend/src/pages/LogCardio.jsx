import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Timer, MapPin, Zap } from 'lucide-react';

const inputStyle = {
  width: '100%',
  padding: '0.875rem 1rem',
  borderRadius: '0.75rem',
  border: '1px solid rgba(255,255,255,0.1)',
  outline: 'none',
  background: 'rgba(0,0,0,0.25)',
  color: '#fff',
  fontSize: '1rem',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '0.8rem',
  fontWeight: '600',
  color: 'rgba(255,255,255,0.7)',
  marginBottom: '0.5rem',
};

const LogCardio = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '',
    distance: '',
    type: 'RUNNING',
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.type === 'RUNNING' ? 'Corrida' : 'Ciclismo',
          type: formData.type,
          date: (() => { const d = new Date(formData.date + 'T12:00:00'); return d.toISOString(); })(),
          notes: `Tempo: ${formData.duration} min | Distância: ${formData.distance} km`,
          exercises: [
            { name: formData.type === 'RUNNING' ? 'Corrida' : 'Ciclismo', duration: parseInt(formData.duration) || 0, distance: parseFloat(formData.distance) || 0 },
          ],
        }),
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
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1030 100%)',
        color: '#fff',
        fontFamily: '"Inter", sans-serif',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header with hero image */}
      <div
        style={{
          position: 'relative',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          marginBottom: '2rem',
          minHeight: '160px',
          background:
            'linear-gradient(to right, rgba(108, 43, 217, 0.9), rgba(0,0,0,0.75)), url("https://images.unsplash.com/photo-1461896836934-ffe607fa8211?auto=format&fit=crop&w=800&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '1.5rem',
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            color: '#fff',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Log de Atividade
        </p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Cardio</h1>
      </div>

      {error && (
        <div
          style={{
            color: '#ffb3b3',
            background: 'rgba(255,51,51,0.15)',
            border: '1px solid rgba(255,51,51,0.3)',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Form Card */}
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1.5rem',
          padding: '2rem',
          flex: 1,
        }}
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Modalidade toggle */}
          <div>
            <label style={labelStyle}><Zap size={15} /> Modalidade</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['RUNNING', 'CYCLING'].map((t) => {
                const active = formData.type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: t })}
                    style={{
                      flex: 1,
                      padding: '0.875rem',
                      borderRadius: '0.75rem',
                      background: active ? 'rgba(157, 78, 221, 0.25)' : 'rgba(0,0,0,0.2)',
                      border: active ? '1px solid #9d4edd' : '1px solid rgba(255,255,255,0.1)',
                      color: active ? '#c77dff' : 'rgba(255,255,255,0.6)',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {t === 'RUNNING' ? '🏃 Corrida' : '🚴 Ciclismo'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data */}
          <div>
            <label style={labelStyle}>Data</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required style={inputStyle} />
          </div>

          {/* Tempo */}
          <div>
            <label style={labelStyle}><Timer size={15} /> Tempo (minutos)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Ex: 45"
              required
              min="1"
              style={inputStyle}
            />
          </div>

          {/* Distância */}
          <div>
            <label style={labelStyle}><MapPin size={15} /> Distância (km)</label>
            <input
              type="number"
              name="distance"
              step="0.1"
              value={formData.distance}
              onChange={handleChange}
              placeholder="Ex: 5.5"
              required
              min="0.1"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '1.1rem',
              borderRadius: '0.75rem',
              marginTop: '0.5rem',
              background: 'linear-gradient(90deg, #9f5bff 0%, #6c2bd9 100%)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '700',
              border: 'none',
              boxShadow: '0 4px 14px rgba(108, 43, 217, 0.4)',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
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
