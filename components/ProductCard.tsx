'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface ProductCardProps {
  product: any
  serbiaRecord: any
  serbiaPrice: number
  serbiaSalary: number
  salaryMap: Record<string, number>
  index: number
}

export function ProductCard({ 
  product, 
  serbiaRecord, 
  serbiaPrice, 
  serbiaSalary, 
  salaryMap,
  index 
}: ProductCardProps) {
  const serbiaAffordability = serbiaSalary / serbiaPrice

  const bestCountry = product.priceRecords.reduce((best: any, r: any) => {
    if (r.country.code === 'RS') return best
    const salary = salaryMap[r.country.code] || 2000
    const afford = salary / Number(r.valueEur)
    const bestAfford = salaryMap[best?.country?.code] / Number(best?.valueEur || 999999)
    return afford > bestAfford ? r : best
  }, product.priceRecords[0])

  const bestAffordability = salaryMap[bestCountry?.country?.code] / Number(bestCountry?.valueEur)
  const difference = ((bestAffordability / serbiaAffordability - 1) * 100).toFixed(0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      {/* Glassmorphism card */}
      <div className="relative bg-slate-900/30 backdrop-blur-2xl rounded-3xl border border-slate-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-300">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.15), transparent)'
          }}
        />

        {/* Header */}
        <div className="relative z-10 p-6 border-b border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-black text-white mb-1">{product.name}</h3>
              <p className="text-sm text-slate-400">po {product.unit}</p>
            </div>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30"
            >
              <span className="text-2xl">🛒</span>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6">
          {/* Serbia main display */}
          <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/30">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🇷🇸</span>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Srbija</span>
              </div>
              <div className="text-4xl font-black text-white mb-1">
                {Number(serbiaRecord.value).toFixed(0)}
                <span className="text-xl text-slate-500 ml-2">RSD</span>
              </div>
              <div className="text-sm text-slate-400">≈ {serbiaPrice.toFixed(2)} €</div>
            </div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-center px-6 py-4 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl border border-blue-400/30"
            >
              <div className="text-xs text-blue-300 mb-1">Za platu</div>
              <div className="text-3xl font-black text-blue-200">{serbiaAffordability.toFixed(0)}</div>
              <div className="text-xs text-slate-400">{product.unit}</div>
            </motion.div>
          </div>

          {/* Alert */}
          {parseFloat(difference) > 20 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 backdrop-blur-sm"
            >
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-red-300">{bestCountry?.country?.name}</div>
                <div className="text-xs text-red-400">+{difference}% bolja kupovna moć</div>
              </div>
            </motion.div>
          )}

          {/* Countries list */}
          <div className="space-y-2">
            {product.priceRecords
              .filter((r: any) => r.country.code !== 'RS')
              .sort((a: any, b: any) => {
                const affordA = salaryMap[a.country.code] / Number(a.valueEur)
                const affordB = salaryMap[b.country.code] / Number(b.valueEur)
                return affordB - affordA
              })
              .slice(0, 5)
              .map((record: any, idx: number) => {
                const price = Number(record.valueEur)
                const salary = salaryMap[record.country.code] || 2000
                const affordability = salary / price
                const ratio = affordability / serbiaAffordability
                const isBetter = ratio > 1.1

                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-3 bg-slate-800/30 hover:bg-slate-700/40 rounded-xl transition-all backdrop-blur-sm border border-slate-700/20"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{record.country.code === 'DE' ? '🇩🇪' : record.country.code === 'AT' ? '🇦🇹' : record.country.code === 'FR' ? '🇫🇷' : '🇪🇺'}</span>
                      <div>
                        <div className="font-semibold text-slate-100 text-sm">{record.country.name}</div>
                        <div className="text-xs text-slate-400">{price.toFixed(2)} €</div>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                        isBetter
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : ratio < 0.9
                          ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                      }`}
                    >
                      {isBetter ? (
                        <>
                          <TrendingUp className="w-3 h-3" />
                          +{((ratio - 1) * 100).toFixed(0)}%
                        </>
                      ) : ratio < 0.9 ? (
                        <>
                          <TrendingDown className="w-3 h-3" />
                          -{((1 - ratio) * 100).toFixed(0)}%
                        </>
                      ) : (
                        '≈'
                      )}
                    </motion.div>
                  </motion.div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity -z-10"
      />
    </motion.div>
  )
}
