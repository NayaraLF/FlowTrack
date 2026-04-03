import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, LogOut, ArrowLeft, Save } from 'lucide-react';

const SidebarMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [view, setView] = useState('menu'); // 'menu' | 'profile'
  
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight: '',
    targetWeight: '',
    height: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setView('menu');
      setSuccess(false);
      setError(null);
      // Load user data
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setFormData({
          age: user.age || '',
          gender: user.gender || '',
          weight: user.weight || '',
          targetWeight: user.targetWeight || '',
          height: user.height || ''
        });
      }
    }
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : null,
          height: formData.height ? parseFloat(formData.height) : null
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar perfil.');

      // Update LocalStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      setSuccess(true);
      setTimeout(() => {
        // Trigger generic custom event so Dashboard can re-render if needed
        window.dispatchEvent(new Event('profileUpdated'));
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '85%', maxWidth: '380px',
        background: 'var(--bg-surface)', zIndex: 1001,
        boxShadow: '-4px 0 20px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.3s forwards',
        color: '#fff',
        fontFamily: '"Inter", sans-serif'
      }}>
        <style>{`
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        `}</style>
        
        {/* Header */}
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {view === 'menu' ? (
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, fontFamily: '"Stylish", serif', letterSpacing: '1px' }}>Flow<span style={{ color: 'var(--primary-light)' }}>Track</span></h2>
          ) : (
            <button onClick={() => setView('menu')} style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeft size={20} /> <span style={{ fontWeight: '600' }}>Voltar</span>
            </button>
          )}
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          
          {view === 'menu' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                onClick={() => setView('profile')}
                style={{ background: 'var(--bg-surface-hover)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', color: '#fff', fontSize: '1.05rem', fontWeight: '600' }}
              >
                <div style={{ background: 'rgba(157, 78, 221, 0.2)', padding: '8px', borderRadius: '8px', color: 'var(--primary-light)' }}>
                  <User size={24} />
                </div>
                Dados Pessoais
              </button>
            </div>
          )}

          {view === 'profile' && (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Atualizar Dados</h3>
              
              {error && <div style={{ color: '#ffb3b3', background: '#ff333333', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem' }}>{error}</div>}
              {success && <div style={{ color: '#a3d9a5', background: '#33ff3333', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem' }}>Dados salvos com sucesso!</div>}

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Idade</label>
                <input 
                  type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Sua idade"
                  style={{ width: '100%', padding: '1rem', background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Sexo</label>
                <select 
                  name="gender" value={formData.gender} onChange={handleChange}
                  style={{ width: '100%', padding: '1rem', background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: formData.gender ? '#fff' : 'var(--text-muted)', outline: 'none' }}
                >
                  <option value="" disabled>Selecione seu sexo</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Peso Atual (kg)</label>
                <input 
                  type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} placeholder="Ex: 75.5"
                  style={{ width: '100%', padding: '1rem', background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--primary-light)', fontWeight: '600', marginBottom: '0.5rem' }}>Meta de Peso (kg)</label>
                <input 
                  type="number" step="0.1" name="targetWeight" value={formData.targetWeight} onChange={handleChange} placeholder="Ex: 70.0"
                  style={{ width: '100%', padding: '1rem', background: 'rgba(157, 78, 221, 0.1)', border: '1px solid var(--primary-light)', borderRadius: '12px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Altura (cm)</label>
                <input 
                  type="number" step="0.1" name="height" value={formData.height} onChange={handleChange} placeholder="Ex: 175"
                  style={{ width: '100%', padding: '1rem', background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }}
                />
              </div>

              <button 
                type="submit" disabled={isLoading}
                style={{ background: 'var(--primary)', color: '#fff', padding: '1rem', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                {isLoading ? 'Salvando...' : <><Save size={20} /> Salvar Alterações</>}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#ff4d4d', background: 'rgba(255, 77, 77, 0.1)', fontWeight: '700', fontSize: '1rem' }}
          >
            <LogOut size={20} /> Sair da conta
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;
