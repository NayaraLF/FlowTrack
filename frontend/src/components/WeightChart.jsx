import React from 'react';
import { LineChart, Line, XAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

const CustomDot = (props) => {
  const { cx, cy, index, payload } = props;
  const isTarget = payload && payload.name === 'Meta';
  return (
    <circle cx={cx} cy={cy} r={isTarget ? 5 : 4} stroke={isTarget ? "#CCFF00" : "#9d4edd"} strokeWidth={2} fill={isTarget ? "#CCFF00" : "white"} />
  );
};

const WeightChart = ({ currentWeight, targetWeight }) => {
  // If no data is available
  if (!currentWeight && !targetWeight) {
    return <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '2rem', fontSize: '0.8rem' }}>Sem dados de peso</div>;
  }

  const cw = currentWeight || 0;
  const tw = targetWeight || cw;
  
  // Create a minimal trend chart since we only have current and target
  // In a real app we'd fetch historical weight entries
  const isLoss = cw > tw;
  const simulatedStart = cw + (isLoss ? 2 : -2); // Fake previous data point just to show trend

  const data = [
    { name: 'Anterior', val: simulatedStart },
    { name: 'Atual', val: cw },
    { name: 'Meta', val: tw }
  ];

  // Adjust Y axis domain to make the line visible and centered
  const minVal = Math.min(simulatedStart, cw, tw) - 2;
  const maxVal = Math.max(simulatedStart, cw, tw) + 2;

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
            type="monotone" 
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
