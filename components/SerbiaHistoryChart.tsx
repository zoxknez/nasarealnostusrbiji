'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface SerbiaHistoryChartProps {
  data: {
    year: number
    plataRsd: number | null
    kursEur: number | null
    dizelRsd: number | null
    plataEur: number | null
  }[]
}

export function SerbiaHistoryChart({ data }: SerbiaHistoryChartProps) {
  // Filter only years with data
  const plataData = data.filter(d => d.plataEur !== null)
  const kursData = data.filter(d => d.kursEur !== null)
  const dizelData = data.filter(d => d.dizelRsd !== null)

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Plata u EUR */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-cyan-400/30 p-3 sm:p-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-cyan-400">💶 Prosečna plata u EUR</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={plataData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="year" 
              stroke="#94a3b8"
              style={{ fontSize: '14px' }}
            />
            <YAxis 
              stroke="#94a3b8"
              style={{ fontSize: '14px' }}
              label={{ value: 'EUR', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid #22d3ee',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: any) => [`${value.toFixed(0)}€`, 'Plata']}
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Line 
              type="monotone" 
              dataKey="plataEur" 
              stroke="#22d3ee" 
              strokeWidth={3}
              name="Plata (EUR)"
              dot={{ fill: '#22d3ee', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Kurs EUR/RSD */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-emerald-400/30 p-3 sm:p-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-emerald-400">💱 Kurs EUR/RSD</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={kursData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="year" 
              stroke="#94a3b8"
              style={{ fontSize: '14px' }}
            />
            <YAxis 
              stroke="#94a3b8"
              style={{ fontSize: '14px' }}
              label={{ value: 'RSD', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
              domain={[70, 130]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid #10b981',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: any) => [`${value.toFixed(2)} RSD`, 'Kurs']}
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Line 
              type="monotone" 
              dataKey="kursEur" 
              stroke="#10b981" 
              strokeWidth={3}
              name="EUR/RSD"
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Dizel RSD */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-orange-400/30 p-3 sm:p-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-orange-400">⛽ Cena dizela (RSD/litar)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dizelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="year" 
              stroke="#94a3b8"
              style={{ fontSize: '14px' }}
            />
            <YAxis 
              stroke="#94a3b8"
              style={{ fontSize: '14px' }}
              label={{ value: 'RSD/L', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid #fb923c',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: any) => [`${value.toFixed(2)} RSD/L`, 'Dizel']}
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Line 
              type="monotone" 
              dataKey="dizelRsd" 
              stroke="#fb923c" 
              strokeWidth={3}
              name="Dizel (RSD/L)"
              dot={{ fill: '#fb923c', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
