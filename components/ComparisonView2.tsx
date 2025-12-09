'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { Euro, TrendingDown, ChevronDown, Trophy, Award, Medal } from 'lucide-react'
import { SpaceBackground } from './SpaceBackground'
import { SerbiaHistoryChart } from './SerbiaHistoryChart'

interface ComparisonViewProps {
  categories: any[]
  products: any[]
  salaryMap: Record<string, number>
  serbiaSalary: number
  serbiaPension: number
  serbiaHistoricalData?: any[]
}

const categoryIcons: Record<string, string> = {
  'food': '🍔',
  'transport': '⛽',
  'housing': '🏠',
  'healthcare': '🏥',
  'education': '🎓',
  'taxes': '💰',
  'economic-indicators': '📊'
}

const countryFlags: Record<string, string> = {
  'RS': '🇷🇸', 'DE': '🇩🇪', 'AT': '🇦🇹', 'FR': '🇫🇷', 'IT': '🇮🇹',
  'HR': '🇭🇷', 'HU': '🇭🇺', 'RO': '🇷🇴', 'BG': '🇧🇬', 'GR': '🇬🇷', 'SI': '🇸🇮'
}

function MouseFollowCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ComparisonView({
  categories,
  products,
  salaryMap,
  serbiaSalary,
  serbiaPension,
  serbiaHistoricalData = []
}: ComparisonViewProps) {
  const [openCategories, setOpenCategories] = useState<Record<number, boolean>>({})
  const [openProducts, setOpenProducts] = useState<Record<number, boolean>>({})
  const [openSerbiaHistory, setOpenSerbiaHistory] = useState(false)

  const toggleCategory = (catId: number) => {
    setOpenCategories(prev => ({ ...prev, [catId]: !prev[catId] }))
  }

  const toggleProduct = (productId: number) => {
    setOpenProducts(prev => ({ ...prev, [productId]: !prev[productId] }))
  }

  const productsByCategory = categories.map((cat: any) => ({
    ...cat,
    products: products.filter((p: any) => p.categoryId === cat.id)
  }))

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <SpaceBackground />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-white/10 backdrop-blur-xl bg-black/30"
        >
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center space-y-6">
              <motion.h1 
                className="text-6xl sm:text-8xl font-black"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Srbija
                </span>
                <span className="text-white/90 mx-4">⚡</span>
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Evropa
                </span>
              </motion.h1>
              <p className="text-xl text-white/70">Koliko vredi tvoja plata u drugim zemljama?</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              <MouseFollowCard className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl p-6 border border-cyan-400/30 backdrop-blur-xl">
                <Euro className="w-10 h-10 text-cyan-400 mb-3" />
                <div className="text-3xl font-black">~680€</div>
                <div className="text-sm text-white/60">Plata RS (~80k RSD)</div>
                <div className="text-xs text-orange-400 mt-2 italic">Državni prosek nije realan</div>
              </MouseFollowCard>

              <MouseFollowCard className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl p-6 border border-emerald-400/30 backdrop-blur-xl">
                <TrendingDown className="w-10 h-10 text-emerald-400 mb-3" />
                <div className="text-3xl font-black">{serbiaPension}€</div>
                <div className="text-sm text-white/60">Penzija RS</div>
              </MouseFollowCard>

              <MouseFollowCard className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-2xl p-6 border border-orange-400/30 backdrop-blur-xl">
                <div className="text-3xl mb-3">🌍</div>
                <div className="text-3xl font-black">11</div>
                <div className="text-sm text-white/60">Zemalja</div>
              </MouseFollowCard>

              <MouseFollowCard className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl p-6 border border-blue-400/30 backdrop-blur-xl">
                <div className="text-3xl mb-3">📊</div>
                <div className="text-3xl font-black">{products.length}</div>
                <div className="text-sm text-white/60">Proizvoda</div>
              </MouseFollowCard>
            </div>

          </div>
        </motion.div>

        {/* Srbija Istorija Section */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-red-900/30 to-blue-900/30 backdrop-blur-xl rounded-2xl border-2 border-red-400/50 overflow-hidden"
          >
            <motion.button
              onClick={() => setOpenSerbiaHistory(!openSerbiaHistory)}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              className="w-full p-6 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">🇷🇸</div>
                <div className="text-left">
                  <h2 className="text-4xl font-bold">Srbija: Istorija 2005-2025</h2>
                  <p className="text-sm text-white/50">Plata, kurs EUR/RSD, cena dizela kroz godine</p>
                  <p className="text-xs text-orange-400 italic mt-1">*2022-2025: Realno stanje (80k RSD), ne državni prosek</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: openSerbiaHistory ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-8 h-8 text-white/50" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {openSerbiaHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-white/10"
                >
                  <div className="p-6">
                    {/* Napomena o podacima */}
                    <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex gap-3 items-start">
                        <div className="text-2xl">⚠️</div>
                        <div className="flex-1">
                          <p className="text-yellow-200 text-sm leading-relaxed">
                            <span className="font-bold">Napomena o podacima:</span> Izvukao sam podatke, možda ima grešaka, ali je suština bitna. 
                            Dok sam sa <span className="font-bold text-yellow-300">1000 RSD 2009/10</span> mogao taksijem do grada, pojesti nešto i 10 piva u kaficu, 
                            danas mi za to isto treba <span className="font-bold text-yellow-300">4000-5000 RSD</span>, znači <span className="font-bold text-red-400">4-5x</span> su troškovi skočili. 
                            Da je prosečna plata pratila trend poskupljenja, realno <span className="font-bold text-green-400">1500€ minimum</span> bi trebala biti.
                          </p>
                        </div>
                      </div>
                    </div>

                    {serbiaHistoricalData.length > 0 ? (
                      <SerbiaHistoryChart data={serbiaHistoricalData.map((d: any) => ({
                        year: d.year,
                        plataRsd: Number(d.netSalaryRsd) || null,
                        kursEur: Number(d.eurRsdRate) || null,
                        dizelRsd: Number(d.dieselRsdPerLitre) || null,
                        plataEur: d.netSalaryRsd && d.eurRsdRate 
                          ? Number(d.netSalaryRsd) / Number(d.eurRsdRate) 
                          : null
                      }))} />
                    ) : (
                      <p className="text-white/50 text-center py-8">Nema istorijskih podataka</p>
                    )}

                    {/* Tabela */}
                    {serbiaHistoricalData.length > 0 && (
                      <div className="mt-8 bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-800/50">
                              <tr>
                                <th className="px-6 py-4 text-left font-bold">Godina</th>
                                <th className="px-6 py-4 text-right font-bold">Plata (RSD)</th>
                                <th className="px-6 py-4 text-right font-bold">Plata (EUR)</th>
                                <th className="px-6 py-4 text-right font-bold">Kurs EUR/RSD</th>
                                <th className="px-6 py-4 text-right font-bold">Dizel (RSD/L)</th>
                                <th className="px-6 py-4 text-right font-bold text-orange-400">Litara za platu</th>
                              </tr>
                            </thead>
                            <tbody>
                              {serbiaHistoricalData.map((row: any, index: number) => {
                                const netSalary = Number(row.netSalaryRsd) || 0
                                const eurRate = Number(row.eurRsdRate) || 0
                                const diesel = Number(row.dieselRsdPerLitre) || 0
                                const plataEur = netSalary && eurRate
                                  ? (netSalary / eurRate).toFixed(0)
                                  : 'N/A'
                                const litresPerSalary = netSalary && diesel
                                  ? (netSalary / diesel).toFixed(0)
                                  : 'N/A'
                                
                                return (
                                  <tr 
                                    key={row.year}
                                    className={`border-t border-white/10 hover:bg-white/5 transition-colors ${
                                      index === serbiaHistoricalData.length - 1 ? 'bg-cyan-500/10' : ''
                                    }`}
                                  >
                                    <td className="px-6 py-4 font-bold text-cyan-400">{row.year}</td>
                                    <td className="px-6 py-4 text-right">
                                      {netSalary ? `${netSalary.toLocaleString('sr-RS')} RSD` : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right text-emerald-400 font-bold">
                                      {plataEur !== 'N/A' ? `${plataEur}€` : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                      {eurRate ? eurRate.toFixed(2) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                      {diesel ? `${diesel.toFixed(2)} RSD` : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right text-orange-400 font-bold">
                                      {litresPerSalary !== 'N/A' ? `${litresPerSalary} L` : 'N/A'}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Categories Accordion */}
        <div className="max-w-7xl mx-auto px-4 pb-12 space-y-6">
          {productsByCategory.map((category: any) => {
            const isOpen = openCategories[category.id]
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
              >
                {/* Category Header */}
                <motion.button
                  onClick={() => toggleCategory(category.id)}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className="w-full p-6 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{categoryIcons[category.slug] || '📦'}</div>
                    <div className="text-left">
                      <h2 className="text-3xl font-bold">{category.name}</h2>
                      <p className="text-sm text-white/50">{category.products.length} proizvoda</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-8 h-8 text-white/50" />
                  </motion.div>
                </motion.button>

                {/* Category Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-6 space-y-4">
                        {category.products
                          .sort((a: any, b: any) => {
                            // Sort by affordability (highest first)
                            const serbiaA = a.priceRecords.find((r: any) => r.country.code === 'RS')
                            const serbiaB = b.priceRecords.find((r: any) => r.country.code === 'RS')
                            if (!serbiaA || !serbiaB) return 0
                            const priceA = Number(serbiaA.valueEur)
                            const priceB = Number(serbiaB.valueEur)
                            const salary = salaryMap['RS'] || 850
                            const affordA = salary / priceA
                            const affordB = salary / priceB
                            return affordB - affordA // Highest first
                          })
                          .map((product: any) => {
                          const isProductOpen = openProducts[product.id]
                          const serbiaRecord = product.priceRecords?.find((r: any) => r.country?.code === 'RS')
                          if (!serbiaRecord) return null

                          const serbiaPrice = Number(serbiaRecord.valueEur)
                          const serbiaAfford = serbiaSalary / serbiaPrice

                          // Prepare all countries data
                          const allCountriesData = product.priceRecords
                            .map((r: any) => {
                              const price = Number(r.valueEur)
                              const salary = salaryMap[r.country.code] || 2000
                              const afford = salary / price
                              const diff = ((afford / serbiaAfford - 1) * 100)
                              return {
                                ...r,
                                price,
                                salary,
                                afford,
                                diff,
                                isSerbia: r.country.code === 'RS'
                              }
                            })
                            .sort((a: any, b: any) => b.afford - a.afford)

                          const rank = allCountriesData.findIndex((c: any) => c.isSerbia) + 1
                          const totalCountries = allCountriesData.length

                          return (
                            <div key={product.id} className="bg-slate-800/50 rounded-xl border border-white/10 overflow-hidden">
                              {/* Product Header */}
                              <motion.button
                                onClick={() => toggleProduct(product.id)}
                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                                className="w-full p-4 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="text-left">
                                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="text-sm text-white/50">po {product.unit}</span>
                                      <span className="text-cyan-400 font-mono text-sm">{serbiaPrice.toFixed(2)}€</span>
                                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">
                                        #{rank} od {totalCountries}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="text-2xl font-bold">{serbiaAfford.toFixed(0)}</div>
                                    <div className="text-xs text-white/50">za platu</div>
                                  </div>
                                  <motion.div
                                    animate={{ rotate: isProductOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <ChevronDown className="w-6 h-6 text-white/50" />
                                  </motion.div>
                                </div>
                              </motion.button>

                              {/* All Countries Ranking */}
                              <AnimatePresence>
                                {isProductOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-t border-white/10"
                                  >
                                    <div className="p-4 space-y-2">
                                      {allCountriesData.map((country: any, index: number) => {
                                        const isTop3 = index < 3
                                        const isSerbia = country.isSerbia
                                        
                                        return (
                                          <motion.div
                                            key={country.id}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.03 }}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                                              isSerbia
                                                ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20'
                                                : isTop3
                                                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40'
                                                : 'bg-white/5 border border-white/10'
                                            }`}
                                          >
                                            <div className="flex items-center gap-4">
                                              {/* Rank */}
                                              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-black text-lg ${
                                                index === 0 ? 'bg-yellow-500/30 text-yellow-300' :
                                                index === 1 ? 'bg-gray-400/30 text-gray-300' :
                                                index === 2 ? 'bg-orange-600/30 text-orange-300' :
                                                'bg-white/10 text-white/50'
                                              }`}>
                                                {index === 0 && <Trophy className="w-5 h-5" />}
                                                {index === 1 && <Award className="w-5 h-5" />}
                                                {index === 2 && <Medal className="w-5 h-5" />}
                                                {index > 2 && `#${index + 1}`}
                                              </div>

                                              {/* Flag */}
                                              <div className="text-3xl">{countryFlags[country.country.code]}</div>

                                              {/* Country Info */}
                                              <div>
                                                <div className={`font-bold text-lg ${isSerbia ? 'text-cyan-300' : 'text-white'}`}>
                                                  {country.country.name}
                                                  {isSerbia && <span className="ml-2 text-cyan-400">⭐</span>}
                                                </div>
                                                <div className="text-sm text-white/60">
                                                  {country.price.toFixed(2)}€ • Plata {country.salary}€
                                                </div>
                                              </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center gap-4">
                                              <div className="text-right">
                                                <div className={`text-2xl font-black ${isSerbia ? 'text-cyan-300' : 'text-white'}`}>
                                                  {country.afford.toFixed(0)}
                                                </div>
                                                <div className="text-xs text-white/50">{product.unit}</div>
                                              </div>
                                              <div className={`px-3 py-1 rounded-full font-bold text-sm min-w-[80px] text-center ${
                                                country.diff > 20
                                                  ? 'bg-red-500/30 text-red-300'
                                                  : country.diff < -20
                                                  ? 'bg-emerald-500/30 text-emerald-300'
                                                  : 'bg-white/10 text-white/70'
                                              }`}>
                                                {country.diff > 0 ? '+' : ''}{country.diff.toFixed(0)}%
                                              </div>
                                            </div>
                                          </motion.div>
                                        )
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
