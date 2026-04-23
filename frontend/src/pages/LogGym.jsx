import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Timer, FileText, Dumbbell } from 'lucide-react';

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

const LogGym = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '',
    notes: '',
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
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: 'Treino de Musculação',
          type: 'GYM',
          date: (() => { const d = new Date(formData.date + 'T12:00:00'); return d.toISOString(); })(),
          notes: formData.notes ? `Tempo: ${formData.duration} min | Foco: ${formData.notes}` : `Tempo: ${formData.duration} min`,
          exercises: [],
        }),
      });

      if (!res.ok) throw new Error('Falha ao salvar registro de musculação.');
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
            'linear-gradient(to right, rgba(157, 78, 221, 0.9), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80")',
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
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Log de Atividade
        </p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Musculação</h1>
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
          
          {/* Foco de Treino / Título Simples */}
          <div>
            <label style={labelStyle}><Dumbbell size={15} /> Atividade</label>
            <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(157, 78, 221, 0.25)', border: '1px solid #9d4edd', color: '#c77dff', fontWeight: '700', fontSize: '0.9rem', textAlign: 'center' }}>
              🏋️ Treino de Musculação
            </div>
          </div>

          {/* Data */}
          <div>
            <label style={labelStyle}>Data</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required style={inputStyle} />
          </div>

          {/* Tempo */}
          <div>
            <label style={labelStyle}><Timer size={15} /> Tempo de Treino (minutos)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Ex: 60"
              required
              min="1"
              style={inputStyle}
            />
          </div>

          {/* Anotações/Foco */}
          <div>
            <label style={labelStyle}><FileText size={15} /> Foco / Anotações</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Ex: Peito e Tríceps"
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
            {isLoading ? 'Salvando...' : 'Salvar Treino'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogGym;
