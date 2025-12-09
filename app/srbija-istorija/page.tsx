import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SerbiaHistoryChart } from '@/components/SerbiaHistoryChart'

export default async function SerbiaHistoryPage() {
  const historicalData = await prisma.serbiaHistoricalData.findMany({
    orderBy: { year: 'asc' }
  })

  const chartData = historicalData.map(d => ({
    year: d.year,
    plataRsd: Number(d.netSalaryRsd) || null,
    kursEur: Number(d.eurRsdRate) || null,
    dizelRsd: Number(d.dieselRsdPerLitre) || null,
    plataEur: d.netSalaryRsd && d.eurRsdRate 
      ? Number(d.netSalaryRsd) / Number(d.eurRsdRate) 
      : null
  }))

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Nazad na poređenje
        </Link>

        <div className="mb-12">
          <h1 className="text-6xl font-black mb-4">
            🇷🇸 Srbija <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">2005-2025</span>
          </h1>
          <p className="text-xl text-white/70">Istorijski podaci o platama, kursu evra i ceni dizela</p>
        </div>

        <SerbiaHistoryChart data={chartData} />

        {/* Tabela sa svim podacima */}
        <div className="mt-12 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Godina</th>
                  <th className="px-6 py-4 text-right font-bold">Plata (RSD)</th>
                  <th className="px-6 py-4 text-right font-bold">Plata (EUR)</th>
                  <th className="px-6 py-4 text-right font-bold">Kurs EUR/RSD</th>
                  <th className="px-6 py-4 text-right font-bold">Dizel (RSD/L)</th>
                </tr>
              </thead>
              <tbody>
                {historicalData.map((row, index) => {
                  const plataEur = row.netSalaryRsd && row.eurRsdRate
                    ? (Number(row.netSalaryRsd) / Number(row.eurRsdRate)).toFixed(0)
                    : 'N/A'
                  
                  return (
                    <tr 
                      key={row.year}
                      className={`border-t border-white/10 hover:bg-white/5 transition-colors ${
                        index === historicalData.length - 1 ? 'bg-cyan-500/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-cyan-400">{row.year}</td>
                      <td className="px-6 py-4 text-right">
                        {row.netSalaryRsd ? `${Number(row.netSalaryRsd).toLocaleString('sr-RS')} RSD` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right text-emerald-400 font-bold">
                        {plataEur !== 'N/A' ? `${plataEur}€` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {row.eurRsdRate ? `${Number(row.eurRsdRate).toFixed(2)}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {row.dieselRsdPerLitre ? `${Number(row.dieselRsdPerLitre).toFixed(2)} RSD` : 'N/A'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
