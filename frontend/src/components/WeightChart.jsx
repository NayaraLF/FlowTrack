import React from 'react';
import { LineChart, Line, XAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'JAN', val: 81 },
  { name: 'FEB', val: 80 },
  { name: 'MAR', val: 79 },
  { name: 'APR', val: 78 },
  { name: 'MAY', val: 76 },
  { name: 'JUN', val: 75 },
];

const CustomDot = (props) => {
  const { cx, cy } = props;
  return (
    <circle cx={cx} cy={cy} r={4} stroke="#9d4edd" strokeWidth={2} fill="white" />
  );
};

const WeightChart = () => {
  return (
    <div style={{ width: '100%', height: '140px', marginTop: '1rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.2)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            stroke="rgba(255,255,255,0.7)" 
            fontSize={10} 
            dy={10}
          />
          <Line 
            type="linear" 
            dataKey="val" 
            stroke="#ffffff" 
            strokeWidth={2} 
            dot={<CustomDot />} 
            activeDot={{ r: 6, fill: '#ffffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChart;
