import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { theme } from '@/constants/theme';
import { getRoadmapById } from '@/components/exploreRoadmaps/roadmapsData';

const SalaryComparison = ({ roadmapId }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [chartData, setChartData] = useState([]);
  const [roadmapData, setRoadmapData] = useState(null);
  const [regions, setRegions] = useState([]);

  const EXCHANGE_RATES = {
    'EUR': 1,
    'USD': 1.08
  };

  const LEVELS = [
    { key: 'junior', label: 'Junior' },
    { key: 'mid', label: 'Mid-level' },
    { key: 'senior', label: 'Senior' },
    { key: 'lead', label: 'Lead' }
  ];

  const REGION_NAMES = {
    'spain': 'España',
    'europe': 'Europa',
    'usa': 'EE.UU.'
  };

  const getRegionColor = (region) => {
    const colorMap = {
      'spain': theme.palette.primary.hex,
      'europe': theme.palette.secondary.hex,
      'usa': theme.palette.purple.hex,
      'lead': theme.palette.complementary.hex
    };

    return colorMap[region] || theme.palette.gray.hex;
  };

  const formatCurrency = (value) => 
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: selectedCurrency,
      maximumFractionDigits: 0
    }).format(value);

  const prepareChartData = (salaryData, currency) => {
    const newChartData = LEVELS.map(level => {
      const levelData = { name: level.label };

      regions.forEach(region => {
        const regionData = salaryData[region]?.[level.key];
        if (regionData) {
          const regionCurrency = regionData.currency || 'EUR';
          const conversionRate = currency === regionCurrency ? 1 : (EXCHANGE_RATES[currency] / EXCHANGE_RATES[regionCurrency]);
          levelData[`${region}_median`] = Math.round(regionData.median * conversionRate);
        }
      });

      return levelData;
    });

    setChartData(newChartData);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const regionData = {};
    
    payload.forEach((entry) => {
      const [region, type] = entry.dataKey.split('_');
      if (type === 'median') regionData[region] = { median: entry.value };
    });

    return (
      <div className="bg-white p-3 border rounded-lg shadow-md" style={{ fontFamily: 'Montserrat', fontSize: '0.8rem' }}>
        <p className="font-semibold mb-2" style={{ color: theme.palette.primary.hex }}> {label} </p>
        <div className="space-y-2">
          {Object.entries(regionData).map(([region, data]) => (
            <p key={region} className="font-medium" style={{ color: theme.palette.secondary.hex }}>
              {REGION_NAMES[region] || region.toUpperCase()}:
              <span className="font-bold ml-2"> {formatCurrency(data.median)} </span>
            </p>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const roadmap = getRoadmapById(roadmapId);
    if (roadmap?.salaryData) {
      setRoadmapData(roadmap);
      const availableRegions = Object.keys(roadmap.salaryData);
      setRegions(availableRegions);
      prepareChartData(roadmap.salaryData, selectedCurrency);
    }
  }, [roadmapId]);

  useEffect(() => {
    if (roadmapData?.salaryData) prepareChartData(roadmapData.salaryData, selectedCurrency);
  }, [selectedCurrency, roadmapData]);

  if (!roadmapData) {
    return (
      <div className="text-center py-4">
        <p style={{ color: theme.palette.text.hex }}>Cargando datos salariales...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
            <h2 className="text-xl font-bold" style={{ color: theme.palette.primary.hex }}>
              Comparativa Salarial
            </h2>
          </div>

          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }} >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: theme.palette.text.hex, fontSize: 11 }}
                  axisLine={{ stroke: theme.palette.lightGray.hex }}
                />

                <YAxis
                  tickFormatter={formatCurrency}
                  tick={{ fill: theme.palette.text.hex, fontSize: 11 }}
                  axisLine={{ stroke: theme.palette.lightGray.hex }}
                />
                
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                {regions.map(region => (
                  <Bar
                    key={region}
                    dataKey={`${region}_median`}
                    name={REGION_NAMES[region] || region}
                    fill={getRegionColor(region)}
                    barSize={20}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryComparison;