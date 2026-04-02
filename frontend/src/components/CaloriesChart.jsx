import React from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'SUN', val: 30 },
  { name: 'MON', val: 50 },
  { name: 'TUE', val: 90 },
  { name: 'WED', val: 40 },
  { name: 'THURS', val: 60 },
  { name: 'FRI', val: 80 },
  { name: 'SAT', val: 70 },
];

const CaloriesChart = () => {
  return (
    <div style={{ width: '100%', height: '140px', marginTop: '1rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            stroke="#e0aaff" 
            fontSize={10} 
            dy={10}
          />
          <Bar dataKey="val" radius={[4, 4, 4, 4]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.name === 'TUE' ? '#ffffff' : '#c77dff'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CaloriesChart;
