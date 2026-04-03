import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dumbbell, Timer, MapPin, ChevronDown, ChevronUp, Activity } from 'lucide-react';

const TYPE_LABELS = {
  GYM: { label: 'Musculação', emoji: '🏋️', color: '#9d4edd' },
  RUNNING: { label: 'Corrida', emoji: '🏃', color: '#6ec6f5' },
  CYCLING: { label: 'Ciclismo', emoji: '🚴', color: '#6ec6f5' },
  MARTIAL_ARTS: { label: 'Lutas', emoji: '🥊', color: '#c77dff' },
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(d);
};

const WorkoutHistory = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3001/api/workouts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Falha ao buscar histórico');
        const data = await res.json();
        setWorkouts(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  const toggleExpand = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const inputStyle = { background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '0.75rem' };

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1030 100%)',
      color: '#fff', fontFamily: '"Inter", sans-serif',
      padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        position: 'relative', borderRadius: '1.5rem', overflow: 'hidden',
        marginBottom: '2rem', minHeight: '140px',
        background: 'linear-gradient(to right, rgba(108, 43, 217, 0.9), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem',
      }}>
        <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '1rem', left: '1rem', color: '#fff', background: 'rgba(0,0,0,0.3)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={20} />
        </button>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
          FlowTrack
        </p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Histórico de Treinos</h1>
      </div>

      {/* Error */}
      {error && (
        <div style={{ color: '#ffb3b3', background: 'rgba(255,51,51,0.15)', border: '1px solid rgba(255,51,51,0.3)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.6 }}>
          <Activity size={32} style={{ margin: '0 auto 1rem' }} />
          <p>Carregando histórico...</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && workouts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
          <Dumbbell size={48} style={{ margin: '0 auto 1rem' }} />
          <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Nenhum treino registrado ainda</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Comece registrando seu primeiro treino!</p>
        </div>
      )}

      {/* Workout list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {workouts.map((workout) => {
          const typeInfo = TYPE_LABELS[workout.type] || { label: workout.type, emoji: '💪', color: '#9d4edd' };
          const isGym = workout.type === 'GYM';
          const hasExercises = isGym && workout.exercises && workout.exercises.length > 0;
          const isOpen = expanded[workout.id];

          return (
            <div key={workout.id} style={{ ...inputStyle, padding: 0, overflow: 'hidden' }}>
              {/* Card header */}
              <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', flex: 1 }}>
                  {/* Type badge */}
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `rgba(${typeInfo.color === '#9d4edd' ? '157,78,221' : '110,198,245'},0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                    {typeInfo.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '700', fontSize: '1rem', margin: '0 0 0.2rem' }}>{workout.title}</p>
                    <span style={{ fontSize: '0.7rem', background: `rgba(157,78,221,0.2)`, color: typeInfo.color, border: `1px solid ${typeInfo.color}44`, borderRadius: '999px', padding: '0.2rem 0.6rem', fontWeight: '600' }}>
                      {typeInfo.label}
                    </span>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: '0.4rem 0 0' }}>
                      {formatDate(workout.date)}
                    </p>
                  </div>
                </div>

                {/* Expand button (only for GYM with exercises) */}
                {hasExercises && (
                  <button onClick={() => toggleExpand(workout.id)} style={{ color: '#c77dff', background: 'rgba(157,78,221,0.1)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                )}
              </div>

              {/* Notes (non-gym) */}
              {!isGym && workout.notes && (
                <div style={{ padding: '0 1.25rem 1.25rem' }}>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', background: 'rgba(0,0,0,0.2)', padding: '0.6rem 0.875rem', borderRadius: '8px', margin: 0 }}>
                    {workout.notes}
                  </p>
                </div>
              )}

              {/* GYM exercises detail */}
              {isGym && isOpen && hasExercises && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '0 1.25rem 1.25rem', marginTop: '0' }}>
                  {/* Column headers */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4px', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.5rem' }}>
                    {['Exercício', 'Séries', 'Reps', 'Carga'].map((h) => (
                      <span key={h} style={{ fontSize: '0.65rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: h !== 'Exercício' ? 'center' : 'left' }}>{h}</span>
                    ))}
                  </div>
                  {workout.exercises.map((ex, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4px', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: '500' }}>{ex.name || '—'}</span>
                      <span style={{ fontSize: '0.8rem', color: '#c77dff', fontWeight: '700', textAlign: 'center' }}>{ex.sets || '—'}</span>
                      <span style={{ fontSize: '0.8rem', color: '#c77dff', fontWeight: '700', textAlign: 'center' }}>{ex.reps || '—'}</span>
                      <span style={{ fontSize: '0.8rem', color: '#c77dff', fontWeight: '700', textAlign: 'center' }}>{ex.weight ? ex.weight + 'kg' : '—'}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* GYM with no exercises - show notes */}
              {isGym && !hasExercises && workout.notes && (
                <div style={{ padding: '0 1.25rem 1.25rem' }}>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', padding: '0.5rem 0.875rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', margin: 0 }}>
                    {workout.notes}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutHistory;
