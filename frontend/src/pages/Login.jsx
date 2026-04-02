import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to login');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
      window.location.reload(); // Quick way to update app state
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      width: '100%', minHeight: '100vh', 
      background: 'linear-gradient(180deg, #9f5bff 0%, #6c2bd9 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Dumbbell size={100} color="#ffffff" strokeWidth={1.5} style={{ transform: 'rotate(-45deg)', marginBottom: '0.5rem' }} />
        <h1 style={{ color: '#ffffff', fontSize: '3.5rem', fontFamily: '"Stylish", serif', margin: 0 }}>FlowTrack</h1>
      </div>

      <div style={{ width: '100%', maxWidth: '320px', paddingBottom: '3rem' }}>
        {error && <p style={{ color: '#ffb3b3', textAlign: 'center', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="email" 
            placeholder="Username (Email)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%', padding: '1rem 1.5rem', borderRadius: '2rem', 
              border: 'none', outline: 'none', fontSize: '0.875rem',
              background: '#ffffff', color: '#333'
            }}
          />
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', padding: '1rem 1.5rem', borderRadius: '2rem', 
              border: 'none', outline: 'none', fontSize: '0.875rem',
              background: '#ffffff', color: '#333'
            }}
          />
          
          <button type="submit" style={{
            width: '100%', padding: '1rem 1.5rem', borderRadius: '2rem',
            border: 'none', background: '#121212', color: '#ffffff',
            fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer',
            marginTop: '0.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            Sign in
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
          <a href="#" style={{ color: 'inherit' }}>Forgot password?</a>
        </p>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Login Failed')}
            theme="filled_black"
            shape="pill"
          />
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: '#fff' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: 'bold' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
