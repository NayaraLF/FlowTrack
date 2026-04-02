import React from 'react';
import { X } from 'lucide-react';

const WorkoutFormModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
    }}>
      <div className="glass-panel" style={{
        width: '100%', maxWidth: '500px', padding: '2rem', background: 'var(--bg-surface)', position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}>
          <X size={24} />
        </button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>Log Workout</h2>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Workout Title</label>
            <input type="text" placeholder="e.g. Back and Biceps" style={{
              width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)',
              background: 'rgba(0,0,0,0.2)', color: 'var(--text-base)', outline: 'none'
            }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Type</label>
              <select style={{
                width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)',
                background: 'rgba(0,0,0,0.2)', color: 'var(--text-base)', outline: 'none'
              }}>
                <option value="GYM">Gym</option>
                <option value="RUNNING">Running</option>
                <option value="CYCLING">Cycling</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Date</label>
              <input type="date" style={{
                width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)',
                background: 'rgba(0,0,0,0.2)', color: 'var(--text-base)', outline: 'none'
              }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Notes</label>
            <textarea rows={3} placeholder="How did you feel?" style={{
              width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)',
              background: 'rgba(0,0,0,0.2)', color: 'var(--text-base)', outline: 'none', resize: 'none'
            }}></textarea>
          </div>
          
          <button type="button" onClick={onClose} style={{
            background: 'var(--primary)', color: '#0f172a', padding: '0.75rem', borderRadius: 'var(--radius-md)',
            fontWeight: '600', marginTop: '1rem', boxShadow: 'var(--shadow-glow)'
          }}>
            Save to BioFlow & Google Calendar
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkoutFormModal;
