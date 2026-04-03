import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, UserCircle2 } from 'lucide-react';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight: '',
    targetWeight: '',
    height: '',
    trainingType: 'Academia'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const trainingOptions = [
    'Academia',
    'Corrida',
    'Ciclismo',
    'Artes Marciais'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao atualizar perfil');
      
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.age = data.user.age;
        user.gender = data.user.gender;
        user.weight = data.user.weight;
        user.targetWeight = data.user.targetWeight;
        user.height = data.user.height;
        user.trainingType = data.user.trainingType;
        user.profileCompleted = true;
        localStorage.setItem('user', JSON.stringify(user));
      }

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
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', color: '#fff', fontFamily: '"Inter", sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '1.5rem',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <UserCircle2 size={64} color="#9f5bff" strokeWidth={1} />
        </div>
        
        <h2 style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>Complete seu Perfil</h2>
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
          Para personalizarmos sua experiência no FlowTrack, precisamos de mais alguns detalhes.
        </p>

        {error && <div style={{ background: '#ff333333', color: '#ffb3b3', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>Idade</label>
              <input 
                type="number" 
                name="age"
                placeholder="Ex: 25"
                value={formData.age}
                onChange={handleChange}
                required
                min="10"
                max="120"
                style={{ 
                  width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem', 
                  border: '1px solid rgba(255,255,255,0.1)', outline: 'none',
                  background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '1rem',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>Sexo</label>
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem', 
                  border: '1px solid rgba(255,255,255,0.1)', outline: 'none',
                  background: 'rgba(0,0,0,0.2)', color: formData.gender ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '1rem',
                  appearance: 'none', cursor: 'pointer'
                }}
              >
                <option value="" disabled style={{ color: '#000' }}>Selecione</option>
                <option value="Masculino" style={{ color: '#000' }}>Masculino</option>
                <option value="Feminino" style={{ color: '#000' }}>Feminino</option>
                <option value="Outro" style={{ color: '#000' }}>Outro</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>Peso Atual (kg)</label>
              <input 
                type="number" 
                name="weight"
                placeholder="Ex: 75.5"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem', 
                  border: '1px solid rgba(255,255,255,0.1)', outline: 'none',
                  background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#c77dff' }}>Meta de Peso (kg)</label>
              <input 
                type="number" 
                name="targetWeight"
                placeholder="Ex: 70.0"
                step="0.1"
                value={formData.targetWeight}
                onChange={handleChange}
                style={{ 
                  width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem', 
                  border: '1px solid rgba(157, 78, 221, 0.5)', outline: 'none',
                  background: 'rgba(157, 78, 221, 0.1)', color: '#fff', fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>Altura (cm)</label>
              <input 
                type="number" 
                name="height"
                placeholder="Ex: 175"
                value={formData.height}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem', 
                  border: '1px solid rgba(255,255,255,0.1)', outline: 'none',
                  background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>Foco Principal de Treino</label>
            <div style={{ position: 'relative' }}>
              <select 
                name="trainingType"
                value={formData.trainingType}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem', 
                  border: '1px solid rgba(255,255,255,0.1)', outline: 'none',
                  background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '1rem',
                  appearance: 'none', cursor: 'pointer'
                }}
              >
                {trainingOptions.map(option => (
                  <option key={option} value={option} style={{ background: '#16213e', color: '#fff' }}>
                    {option}
                  </option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <Settings size={16} color="rgba(255,255,255,0.5)" />
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              width: '100%', padding: '1rem', borderRadius: '0.75rem',
              border: 'none', background: 'linear-gradient(90deg, #9f5bff 0%, #6c2bd9 100%)', 
              color: '#ffffff', fontSize: '1rem', fontWeight: '700', 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '1rem', boxShadow: '0 4px 14px rgba(108, 43, 217, 0.4)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              opacity: isLoading ? 0.7 : 1
            }}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 6px 20px rgba(108, 43, 217, 0.6)')}
            onMouseOut={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 14px rgba(108, 43, 217, 0.4)')}
          >
            {isLoading ? 'Salvando...' : 'Finalizar Cadastro'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
