import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

const gymExercises = [
  // Peito
  'Supino Reto', 'Supino Inclinado', 'Crucifixo Maquina', 'Crossover',
  // Costas
  'Puxada Frontal', 'Remada Curvada', 'Remada Baixa Triângulo', 'Tração Frontal Pronada+Supinada', 'Puxada Reta Corda',
  // Ombros
  'Desenvolvimento Máquina', 'Desenvolvimento livre', 'Elevação Lateral', 'Elevação Frontal',
  // Bíceps
  'Rosca Direta', 'Rosca Martelo', 'Rosca no Banco',
  // Tríceps
  'Tríceps Pulley', 'Tríceps Corda', 'Tríceps Testa',
  // Inferiores
  'Agachamento Livre', 'Leg Press', 'Agachamento Hack', 'Cadeira Extensora', 'Mesa Flexora', 'Cadeira Flexora', 'Adutora', 'Abdutora', 'Elevação Pélvica', 'Panturrilha',
  // Abdomen
  'Abdominal Supra', 'Abdominal Infra', 'Prancha Isometrica'
].sort();

const TrainingPlan = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('Plano de Treino');
  const [routines, setRoutines] = useState([
    {
      id: Date.now().toString(),
      name: 'TREINO A',
      targetGroup: 'Upper I',
      exercises: [
        { id: '1', exercise: '', sets: '', reps: '', load: '', observation: '' }
      ]
    }
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/training-plans', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setTitle(data.title);
          if (data.routines && data.routines.length > 0) {
            setRoutines(data.routines);
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch plan', e);
    }
  };

  const savePlan = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/training-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, routines })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao salvar plano');
      }
      navigate('/');
    } catch (e) {
      setError(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addRoutine = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nextLetter = letters[routines.length % letters.length];
    setRoutines([...routines, {
      id: Date.now().toString(),
      name: `TREINO ${nextLetter}`,
      targetGroup: 'Novo Grupo',
      exercises: []
    }]);
  };

  const removeRoutine = (rIndex) => {
    const newRoutines = [...routines];
    newRoutines.splice(rIndex, 1);
    setRoutines(newRoutines);
  };

  const addExercise = (rIndex) => {
    const newRoutines = [...routines];
    newRoutines[rIndex].exercises.push({
      id: Date.now().toString(),
      exercise: '', sets: '', reps: '', load: '', observation: ''
    });
    setRoutines(newRoutines);
  };

  const removeExercise = (rIndex, eIndex) => {
    const newRoutines = [...routines];
    newRoutines[rIndex].exercises.splice(eIndex, 1);
    setRoutines(newRoutines);
  };

  const handleRoutineChange = (rIndex, field, value) => {
    const newRoutines = [...routines];
    newRoutines[rIndex][field] = value;
    setRoutines(newRoutines);
  };

  const handleExerciseChange = (rIndex, eIndex, field, value) => {
    const newRoutines = [...routines];
    newRoutines[rIndex].exercises[eIndex][field] = value;
    setRoutines(newRoutines);
  };

  // Modern input style inside dark theme
  const inputStyle = {
    background: 'var(--bg-surface)',
    color: 'var(--text-base)',
    border: 'none',
    padding: '8px',
    width: '100%',
    fontWeight: '600',
    textAlign: 'center',
    outline: 'none',
    minHeight: '40px',
    borderRadius: '4px'
  };

  const getSelectStyle = (val) => ({
    ...inputStyle,
    color: val ? 'var(--text-base)' : 'var(--text-muted)',
    textAlign: 'left',
    background: 'var(--bg-surface)'
  });

  return (
    <div className="mobile-container" style={{ padding: '2rem 1.5rem', color: '#fff' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-base)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>
          {title}
        </h1>
        <div style={{ width: 24 }}></div>
      </div>

      <div>
        {error && <div style={{ background: '#ff333333', color: '#ffb3b3', padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

        {routines.map((routine, rIndex) => (
          <div key={routine.id || rIndex} style={{ marginBottom: '3rem' }}>

            {/* Header do Treino */}
            <div style={{ background: 'var(--primary)', color: '#fff', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: 'var(--radius-sm)', borderTopRightRadius: 'var(--radius-sm)' }}>
              <input
                value={routine.name}
                onChange={(e) => handleRoutineChange(rIndex, 'name', e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.1rem', fontWeight: '800', outline: 'none', textTransform: 'uppercase', width: '200px' }}
              />
              <button onClick={() => removeRoutine(rIndex)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8 }}>
                <Trash2 size={20} />
              </button>
            </div>

            {/* Cabeçalho de Colunas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 2fr) 45px 45px 55px 60px', gap: '4px', background: 'transparent', marginTop: '4px' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '0.5rem', display: 'flex', alignItems: 'center', borderRadius: '4px' }}>
                <input
                  value={routine.targetGroup}
                  onChange={(e) => handleRoutineChange(rIndex, 'targetGroup', e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--primary-light)', fontSize: '0.9rem', fontWeight: '700', outline: 'none', width: '100%' }}
                  placeholder="Ex: Peito..."
                />
              </div>
              <div style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-muted)', padding: '0.5rem', fontWeight: '700', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', borderRadius: '4px' }}>Sér.</div>
              <div style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-muted)', padding: '0.5rem', fontWeight: '700', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', borderRadius: '4px' }}>Rep.</div>
              <div style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-muted)', padding: '0.5rem', fontWeight: '700', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', borderRadius: '4px' }}>Carga</div>
              <div style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-muted)', padding: '0.5rem', fontWeight: '700', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', borderRadius: '4px' }}>Obs.</div>
            </div>

            {/* Lista de Exercícios */}
            {routine.exercises.map((ex, eIndex) => (
              <div key={ex.id || eIndex} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 2fr) 45px 45px 55px 60px', gap: '4px', marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <button onClick={() => removeExercise(rIndex, eIndex)} style={{ position: 'absolute', left: '-20px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10 }}>×</button>
                  <select
                    value={ex.exercise}
                    onChange={(e) => handleExerciseChange(rIndex, eIndex, 'exercise', e.target.value)}
                    style={{ ...getSelectStyle(ex.exercise), fontSize: '0.8rem', padding: '8px 4px' }}
                  >
                    <option value="" disabled>Exercício...</option>
                    {gymExercises.map(exerc => (
                      <option key={exerc} value={exerc}>{exerc}</option>
                    ))}
                    <option value="Outro">Outro...</option>
                  </select>
                </div>
                <div><input value={ex.sets} placeholder="3x" onChange={(e) => handleExerciseChange(rIndex, eIndex, 'sets', e.target.value)} style={{ ...inputStyle, padding: '8px 2px', fontSize: '0.8rem' }} /></div>
                <div><input value={ex.reps} placeholder="8a12" onChange={(e) => handleExerciseChange(rIndex, eIndex, 'reps', e.target.value)} style={{ ...inputStyle, padding: '8px 2px', fontSize: '0.8rem' }} /></div>
                <div><input value={ex.load} placeholder="Kg" onChange={(e) => handleExerciseChange(rIndex, eIndex, 'load', e.target.value)} style={{ ...inputStyle, padding: '8px 2px', fontSize: '0.8rem' }} /></div>
                <div><input value={ex.observation} placeholder="Rest" onChange={(e) => handleExerciseChange(rIndex, eIndex, 'observation', e.target.value)} style={{ ...inputStyle, padding: '8px 2px', fontSize: '0.8rem' }} /></div>
              </div>
            ))}

            <button onClick={() => addExercise(rIndex)} style={{ width: '100%', background: 'transparent', color: 'var(--primary-light)', border: `1px dashed var(--primary-light)`, borderRadius: '4px', padding: '0.75rem', marginTop: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} /> Adicionar Exercício
            </button>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', paddingBottom: '2rem' }}>
          <button onClick={addRoutine} style={{ flex: 1, background: 'var(--bg-surface)', color: 'var(--text-base)', border: 'none', padding: '1rem', borderRadius: 'var(--radius-sm)', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <Plus size={18} /> Novo Treino
          </button>
          <button onClick={savePlan} disabled={isSaving} style={{ flex: 1, background: 'var(--primary)', color: '#fff', border: 'none', padding: '1rem', borderRadius: 'var(--radius-sm)', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: isSaving ? 0.7 : 1, boxShadow: 'var(--shadow-glow)' }}>
            <Save size={18} /> {isSaving ? 'Salvando...' : 'Salvar Plano'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default TrainingPlan;
