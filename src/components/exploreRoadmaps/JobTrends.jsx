import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { theme } from '@/constants/theme';

const JobTrends = ({ roadmap }) => {
  const [region, setRegion] = useState('spain');

  if (!roadmap || !roadmap.trendGraph) return null;

  const lineChartData = roadmap.trendGraph.years.map((year, index) => ({
    year,
    España: roadmap.trendGraph.spainDemand[index],
    Global: roadmap.trendGraph.globalDemand[index]
  }));

  const pieChartData = roadmap.jobProfiles.map(profile => ({
    name: profile.name,
    value: profile.percentage
  }));

  const COLORS = [
    theme.palette.primary.hex,
    theme.palette.secondary.hex,
    theme.palette.complementary.hex,
    theme.palette.accent.hex,
    theme.palette.success.hex,
    theme.palette.warning.hex
  ];

  const LineChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="bg-white p-3 rounded-lg shadow-lg"
          style={{ 
            fontFamily: 'Montserrat',
            borderColor: theme.palette.light.hex 
          }}
        >
          <p 
            className="font-semibold mb-1"
            style={{ color: theme.palette.primary.hex }}
          >
            Año {label}
          </p>
          {payload.map((entry, index) => (
            <p 
              key={index} 
              className="text-xs"
              style={{ color: theme.palette.text.hex }}
            >
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto py-2">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <h3 
                    className="text-sm font-semibold"
                    style={{ color: theme.palette.primary.hex }}
                  >
                    Evolución de la Demanda
                  </h3>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      region === 'spain'  ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={{ 
                      backgroundColor: region === 'spain' ? theme.palette.primary.hex : 'transparent'
                    }}
                    onClick={() => setRegion('spain')}
                  >
                    España
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      region === 'global' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={{ 
                      backgroundColor: region === 'global' ? theme.palette.primary.hex : 'transparent'
                    }}
                    onClick={() => setRegion('global')}
                  >
                    Global
                  </button>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={lineChartData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={theme.palette.lightGray.hex} 
                    />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fill: theme.palette.text.hex, fontSize: 11 }}
                    />
                    <YAxis 
                      tick={{ fill: theme.palette.text.hex, fontSize: 11 }}
                    />
                    <Tooltip content={<LineChartTooltip />} />
                    <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                    <Line
                      type="monotone"
                      dataKey={region === 'spain' ? 'España' : 'Global'}
                      stroke={theme.palette.primary.hex}
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-3">
                <h3 
                  className="text-sm font-semibold"
                  style={{ color: theme.palette.primary.hex }}
                >
                  Perfiles Profesionales
                </h3>
              </div>
              <div className="h-52 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => 
                        `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `${value}%`} 
                      contentStyle={{ 
                        fontFamily: 'Montserrat',
                        borderRadius: '0.25rem',
                        fontSize: '11px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobTrends;