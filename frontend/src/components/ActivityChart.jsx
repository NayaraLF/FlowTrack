import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Format a Date to 'YYYY-MM-DD' using UTC (server stores dates in UTC)
const toUTCDateKey = (date) => date.toISOString().split('T')[0];

// Build this week Sun→Sat template, using UTC dates to match server storage
const buildWeekTemplate = () => {
  // Build today's date at UTC noon so getUTCDay is correct for Brazil (-03:00)
  const now = new Date();
  // Work purely in local calendar so user sees their own timezone week
  const localToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayOfWeek = localToday.getDay(); // 0=Sun
  const sunday = new Date(localToday);
  sunday.setDate(localToday.getDate() - dayOfWeek);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    // Generate UTC key for both the template and API comparison:
    // Use local midnight + offset trick: build UTC string from local parts
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const localKey = `${y}-${m}-${day}`;
    return {
      name: DAYS_PT[i],
      count: 0,
      localKey,  // 'YYYY-MM-DD' in user's local timezone
      isToday: d.toDateString() === now.toDateString(),
    };
  });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(20,10,40,0.95)',
        border: '1px solid rgba(157,78,221,0.5)',
        borderRadius: '8px',
        padding: '0.5rem 0.75rem',
        fontSize: '0.75rem',
        color: '#fff'
      }}>
        <p style={{ margin: 0, fontWeight: '700' }}>{label}</p>
        <p style={{ margin: 0, color: '#c77dff' }}>{payload[0].value} atividade{payload[0].value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
};

const ActivityChart = () => {
  const [data, setData] = useState(buildWeekTemplate());
  const [totalWeek, setTotalWeek] = useState(0);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('http://localhost:3001/api/workouts', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const workouts = await res.json();
        const template = buildWeekTemplate();

        workouts.forEach((w) => {
          // Server stores dates in UTC. Use UTC accessors to get the calendar date
          // as it was intended when saving (the user selected a date, we sent T12:00:00 local
          // which resolves to a UTC date still on the same calendar day).
          const wUtc = new Date(w.date);
          const wKey = `${wUtc.getUTCFullYear()}-${String(wUtc.getUTCMonth() + 1).padStart(2, '0')}-${String(wUtc.getUTCDate()).padStart(2, '0')}`;

          const slot = template.find((d) => d.localKey === wKey);
          if (slot) slot.count += 1;
        });

        const total = template.reduce((acc, d) => acc + d.count, 0);
        setTotalWeek(total);
        setData(template);
      } catch (e) {
        // silently ignore – show empty chart
      }
    };

    fetchActivities();
  }, []);

  return (
    <div style={{ width: '100%', height: '160px', marginTop: '1rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            stroke="#e0aaff"
            fontSize={10}
            dy={10}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            stroke="#e0aaff"
            fontSize={10}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey="count" radius={[6, 6, 6, 6]} maxBarSize={32}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isToday ? '#ffffff' : entry.count > 0 ? '#c77dff' : 'rgba(199,125,255,0.25)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export { ActivityChart };
export default ActivityChart;
