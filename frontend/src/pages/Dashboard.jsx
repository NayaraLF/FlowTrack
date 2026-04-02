import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dumbbell, CalendarDays, Activity } from 'lucide-react';
import CaloriesChart from '../components/CaloriesChart';
import WeightChart from '../components/WeightChart';
import WorkoutFormModal from '../components/WorkoutFormModal';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

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
        <button style={{ color: '#fff' }} onClick={() => setIsModalOpen(true)}>
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
      
      <div style={{ 
        background: 'linear-gradient(to right, rgba(157, 78, 221, 0.8), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80")', 
        backgroundSize: 'cover', backgroundPosition: 'center',
        borderRadius: '1.5rem', padding: '1.5rem', marginBottom: '3rem', minHeight: '120px',
        display: 'flex', alignItems: 'center'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Treino de Costas<br/><span style={{ fontSize: '0.75rem', fontWeight: '400', opacity: 0.8 }}>12 Exercícios</span></h3>
      </div>

      {/* -------------------- SECTION 2: WEIGHT (SCREEN 4) -------------------- */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.2rem' }}>Peso</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'capitalize' }}>
            {new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date())}
          </p>
        </div>
        <button style={{ color: '#fff' }} onClick={() => setIsModalOpen(true)}>
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{user.weight ? `${(user.weight - 5).toFixed(1)} kg` : '- kg'}</h2>
            <p style={{ fontSize: '0.65rem', opacity: 0.8 }}>Meta de Peso</p>
          </div>
        </div>
        <WeightChart />
      </div>

      {/* Discover Section */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Descubra</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: '1.6', marginBottom: '1rem' }}>
        A consistência é a chave para a evolução. Com o FlowTrack, você pode rastrear suas métricas e garantir que cada sessão de treino te aproxime do seu objetivo principal de forma saudável.
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: '1.6', marginBottom: '2rem' }}>
        Acompanhe seus relatórios semanais e descubra o impacto do esporte no seu bem-estar diário e na queima calórica consistente.
      </p>

      <WorkoutFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
