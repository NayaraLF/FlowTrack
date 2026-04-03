import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Dumbbell, CalendarDays, Activity } from 'lucide-react';
import CaloriesChart from '../components/CaloriesChart';
import WeightChart from '../components/WeightChart';
import SidebarMenu from '../components/SidebarMenu';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingGym, setIsLoadingGym] = useState(false);
  const [user, setUser] = useState({});

  const loadUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener('profileUpdated', loadUser);
    return () => window.removeEventListener('profileUpdated', loadUser);
  }, []);

  const logGymWorkout = async () => {
    setIsLoadingGym(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Treino de Musculação',
          type: 'GYM',
          date: new Date().toISOString(),
          notes: 'Registrado pelo atalho rápido do Dashboard',
          exercises: []
        })
      });

      if (!res.ok) throw new Error('Falha ao registrar treino');
      
      alert('Treino registrado com sucesso! Ótimo trabalho.');
      navigate('/plano-de-treino');
    } catch (err) {
      alert('Houve um erro ao registrar: ' + err.message);
    } finally {
      setIsLoadingGym(false);
    }
  };

  const dataAtual = new Intl.DateTimeFormat('pt-BR', { 
    day: 'numeric', 
    month: 'long', 
    weekday: 'long' 
  }).format(new Date());

  // Capitalize explicitly for pt-BR aesthetics
  const formatadaCapitalizada = dataAtual.charAt(0).toUpperCase() + dataAtual.slice(1);

  return (
    <div className="mobile-container" style={{ padding: '2rem 1.5rem', color: '#fff' }}>
      
      {/* -------------------- SECTION 1: DASHBOARD (SCREEN 3) -------------------- */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.2rem' }}>
            Olá, {user.name ? user.name.split(' ')[0] : 'Atleta'}.
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'capitalize' }}>
            {formatadaCapitalizada}
          </p>
        </div>
        <button style={{ color: '#fff' }} onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </button>
      </header>

      {/* 3 Stat Pills */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, background: 'var(--primary)', borderRadius: '1rem', padding: '1rem 0.5rem', textAlign: 'center' }}>
          <Dumbbell size={24} color="#fff" style={{ margin: '0 auto 0.5rem' }} />
          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {user.trainingType || '-'}
          </h3>
          <p style={{ fontSize: '0.65rem', opacity: 0.8 }}>Foco Principal</p>
        </div>
        <div style={{ flex: 1, background: 'var(--primary)', borderRadius: '1rem', padding: '1rem 0.5rem', textAlign: 'center' }}>
          <CalendarDays size={24} color="#fff" style={{ margin: '0 auto 0.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>3 <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>x/sem</span></h3>
          <p style={{ fontSize: '0.65rem', opacity: 0.8 }}>Frequência</p>
        </div>
        <div style={{ flex: 1, background: 'var(--primary)', borderRadius: '1rem', padding: '1rem 0.5rem', textAlign: 'center' }}>
          <Activity size={24} color="#fff" style={{ margin: '0 auto 0.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>12</h3>
          <p style={{ fontSize: '0.65rem', opacity: 0.8 }}>Treinos Totais</p>
        </div>
      </div>

      {/* Calories Chart */}
      <div style={{ background: 'var(--primary)', borderRadius: '1.5rem', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', letterSpacing: '1px' }}>CALORIAS</h2>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.65rem', opacity: 0.8 }}>Média Semanal</p>
            <p style={{ fontSize: '1rem', fontWeight: '700' }}>112 KCAL</p>
          </div>
        </div>
        <CaloriesChart />
      </div>

      {/* Personalized Plan */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Plano de Treino</h2>
        <Link to="/plano-de-treino" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Ver tudo &gt;</Link>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        <button 
          onClick={logGymWorkout}
          disabled={isLoadingGym}
          style={{ 
            width: '100%', textAlign: 'left',
            background: 'linear-gradient(to right, rgba(157, 78, 221, 0.9), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80")', 
            backgroundSize: 'cover', backgroundPosition: 'center',
            borderRadius: '1.5rem', padding: '1.5rem', minHeight: '100px',
            display: 'flex', alignItems: 'center', border: 'none', color: '#fff', cursor: 'pointer'
          }}
        >
          {isLoadingGym ? (
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Registrando...</h3>
          ) : (
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Treino de Musculação<br/><span style={{ fontSize: '0.75rem', fontWeight: '400', opacity: 0.8 }}>Registrar e Visualizar Plano</span></h3>
          )}
        </button>

        <button 
          onClick={() => navigate('/log-cardio')}
          style={{ 
            width: '100%', textAlign: 'left',
            background: 'linear-gradient(to right, rgba(108, 43, 217, 0.85), rgba(0,0,0,0.75)), url("https://images.unsplash.com/photo-1461896836934-ffe607fa8211?auto=format&fit=crop&w=800&q=80")', 
            backgroundSize: 'cover', backgroundPosition: 'center',
            borderRadius: '1.5rem', padding: '1.5rem', minHeight: '100px',
            display: 'flex', alignItems: 'center', border: 'none', color: '#fff', cursor: 'pointer'
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Cardio (Corrida/Ciclismo)<br/><span style={{ fontSize: '0.75rem', fontWeight: '400', opacity: 0.8 }}>Registrar Tempo e Distância</span></h3>
        </button>

        <button 
          onClick={() => navigate('/log-martial-arts')}
          style={{ 
            width: '100%', textAlign: 'left',
            background: 'linear-gradient(to right, rgba(74, 20, 140, 0.9), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80")', 
            backgroundSize: 'cover', backgroundPosition: 'center',
            borderRadius: '1.5rem', padding: '1.5rem', minHeight: '100px',
            display: 'flex', alignItems: 'center', border: 'none', color: '#fff', cursor: 'pointer'
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Lutas<br/><span style={{ fontSize: '0.75rem', fontWeight: '400', opacity: 0.8 }}>Registrar Intensidade e Tempo</span></h3>
        </button>
      </div>

      {/* -------------------- SECTION 2: WEIGHT (SCREEN 4) -------------------- */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.2rem' }}>Peso</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'capitalize' }}>
            {new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date())}
          </p>
        </div>
        <button style={{ color: '#fff' }} onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </button>
      </header>

      {/* Weight Chart */}
      <div style={{ 
        background: 'linear-gradient(135deg, var(--primary-light), var(--primary))', 
        borderRadius: '1.5rem', padding: '1.5rem', marginBottom: '2rem' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{user.weight ? `${user.weight} kg` : '- kg'}</h2>
            <p style={{ fontSize: '0.65rem', opacity: 0.8 }}>Peso Atual</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{user.targetWeight ? `${user.targetWeight} kg` : '- kg'}</h2>
            <p style={{ fontSize: '0.65rem', opacity: 0.8 }}>Meta de Peso</p>
          </div>
        </div>
        <WeightChart currentWeight={user.weight} targetWeight={user.targetWeight} />
      </div>

      {/* Discover Section */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Descubra</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: '1.6', marginBottom: '1rem' }}>
        A consistência é a chave para a evolução. Com o FlowTrack, você pode rastrear suas métricas e garantir que cada sessão de treino te aproxime do seu objetivo principal de forma saudável.
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: '1.6', marginBottom: '2rem' }}>
        Acompanhe seus relatórios semanais e descubra o impacto do esporte no seu bem-estar diário e na queima calórica consistente.
      </p>

      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
};

export default Dashboard;
