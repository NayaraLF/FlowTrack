import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyData = [
  { name: 'Week 1', weight: 60, pace: 6.5 },
  { name: 'Week 2', weight: 62.5, pace: 6.3 },
  { name: 'Week 3', weight: 65, pace: 6.0 },
  { name: 'Week 4', weight: 65, pace: 5.8 },
  { name: 'Week 5', weight: 67.5, pace: 5.5 },
  { name: 'Week 6', weight: 70, pace: 5.2 },
];

const ChartEvolution = () => {
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dummyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis yAxisId="left" stroke="var(--primary)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis yAxisId="right" orientation="right" stroke="var(--accent)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
            itemStyle={{ color: 'var(--text-base)' }}
          />
          <Line yAxisId="left" type="monotone" dataKey="weight" name="Kg (Gym)" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-base)', strokeWidth: 2 }} activeDot={{ r: 6, fill: 'var(--primary)' }} />
          <Line yAxisId="right" type="monotone" dataKey="pace" name="Pace (Cardio)" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-base)', strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartEvolution;
