'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { Euro, TrendingUp, TrendingDown, ChevronDown, Trophy, Award, Medal } from 'lucide-react'
import { SpaceBackground } from './SpaceBackground'

interface ComparisonViewProps {
  categories: any[]
  products: any[]
  salaryMap: Record<string, number>
  pensionMap: Record<string, number>
  serbiaSalary: number
  serbiaPension: number
}

function MouseFollowCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"])

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

const categoryIcons: Record<string, string> = {
  'food': '🍔',
  'transport': '⛽',
  'housing': '🏠',
  'clothing': '👕',
  'tech': '💻',
  'entertainment': '🎬',
  'services': '🔧'
}

const countryFlags: Record<string, string> = {
  'RS': '🇷🇸', 'DE': '🇩🇪', 'AT': '🇦🇹', 'FR': '🇫🇷', 'IT': '🇮🇹',
  'HR': '🇭🇷', 'HU': '🇭🇺', 'RO': '🇷🇴', 'BG': '🇧🇬', 'GR': '🇬🇷', 'SI': '🇸🇮'
}

export function ComparisonView({ 
  categories, 
  products, 
  salaryMap, 
  pensionMap, 
  serbiaSalary, 
  serbiaPension 
}: ComparisonViewProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

  const toggleCategory = (catId: number) => {
    setOpenCategories(prev => ({ ...prev, [catId]: !prev[catId] }))
  }

  const productsByCategory = categories.map((cat: any) => ({
    ...cat,
    products: products.filter((p: any) => p.categoryId === cat.id)
  }))

  const filteredProducts = selectedCategory
    ? products.filter((p: any) => {
        const category = categories.find((c: any) => c.id === p.categoryId)
        return category?.slug === selectedCategory
      })
    : products

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">
      <SpaceBackground />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="border-b border-white/10 backdrop-blur-xl bg-black/30"
        >
          <div className="max-w-7xl mx-auto px-4 py-20">
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-8"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-full backdrop-blur-md cursor-pointer"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                />
                <span className="text-sm font-medium text-cyan-300">Live Data • Decembar 2025</span>
              </motion.div>
              
              <div>
                <h1 className="text-6xl sm:text-8xl font-black mb-4">
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="inline-block bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
                  >
                    Srbija
                  </motion.span>
                  <span className="text-white/90 mx-4">⚡</span>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="inline-block bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent"
                  >
                    Evropa
                  </motion.span>
                </h1>
                <motion.div 
                  animate={{ width: ["30%", "35%", "30%"] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="h-1 mx-auto bg-gradient-to-r from-cyan-500 via-blue-500 to-orange-500 rounded-full shadow-lg shadow-blue-500/50"
                />
              </div>
              
              <p className="text-xl text-white/70 max-w-2xl mx-auto font-light">
                💰 Stvarna kupovna moć | 🎯 Real-time analiza | 📊 11 zemalja
              </p>
            </motion.div>

            {/* Interactive Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto">
              <MouseFollowCard className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 p-6 backdrop-blur-xl hover:border-cyan-400/60 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                <motion.div 
                  style={{ transformStyle: "preserve-3d", transform: "translateZ(50px)" }}
                  className="relative z-10"
                >
                  <Euro className="w-10 h-10 text-cyan-400 mb-4 drop-shadow-lg" />
                  <div className="text-4xl font-black text-white mb-2">{serbiaSalary}€</div>
                  <div className="text-sm text-white/60 font-medium">Prosečna plata</div>
                </motion.div>
              </MouseFollowCard>

              <MouseFollowCard className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-400/30 p-6 backdrop-blur-xl hover:border-emerald-400/60 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-teal-600/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                <motion.div 
                  style={{ transformStyle: "preserve-3d", transform: "translateZ(50px)" }}
                  className="relative z-10"
                >
                  <TrendingDown className="w-10 h-10 text-emerald-400 mb-4 drop-shadow-lg" />
                  <div className="text-4xl font-black text-white mb-2">{serbiaPension}€</div>
                  <div className="text-sm text-white/60 font-medium">Prosečna penzija</div>
                </motion.div>
              </MouseFollowCard>

              <MouseFollowCard className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-400/30 p-6 backdrop-blur-xl hover:border-orange-400/60 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 to-red-600/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                <motion.div 
                  style={{ transformStyle: "preserve-3d", transform: "translateZ(50px)" }}
                  className="relative z-10"
                >
                  <div className="text-4xl mb-4">🌍</div>
                  <div className="text-4xl font-black text-white mb-2">11</div>
                  <div className="text-sm text-white/60 font-medium">Država</div>
                </motion.div>
              </MouseFollowCard>

              <MouseFollowCard className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-400/30 p-6 backdrop-blur-xl hover:border-blue-400/60 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-indigo-600/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                <motion.div 
                  style={{ transformStyle: "preserve-3d", transform: "translateZ(50px)" }}
                  className="relative z-10"
                >
                  <TrendingUp className="w-10 h-10 text-blue-400 mb-4 drop-shadow-lg" />
                  <div className="text-4xl font-black text-white mb-2">{products.length}</div>
                  <div className="text-sm text-white/60 font-medium">Proizvoda</div>
                </motion.div>
              </MouseFollowCard>
            </div>
          </div>
        </motion.div>

        {/* Categories Filter */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            {categories.map((cat: any) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)}
                className={`px-6 py-3 rounded-xl font-semibold text-lg backdrop-blur-xl border-2 transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/30'
                    : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/40'
                }`}
              >
                <span className="mr-2">{cat.slug === 'food' ? '🍔' : '⛽'}</span>
                {cat.name}
                <span className="ml-2 text-sm opacity-60">({cat.products.length})</span>
              </motion.button>
            ))}
            {selectedCategory && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(null)}
                className="px-6 py-3 rounded-xl font-semibold text-lg backdrop-blur-xl border-2 bg-red-500/20 border-red-400 text-red-300"
              >
                ✕ Očisti filter
              </motion.button>
            )}
          </motion.div>

          {/* Products Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {filteredProducts.map((product: any, index: number) => {
              const serbiaRecord = product.priceRecords.find((r: any) => r.country.code === 'RS')
              if (!serbiaRecord) return null

              const serbiaPrice = Number(serbiaRecord.valueEur)
              const serbiaAfford = serbiaSalary / serbiaPrice

              const countriesData = product.priceRecords
                .filter((r: any) => r.country.code !== 'RS')
                .map((r: any) => {
                  const price = Number(r.valueEur)
                  const salary = salaryMap[r.country.code] || 2000
                  const afford = salary / price
                  const diff = ((afford / serbiaAfford - 1) * 100)
                  return { ...r, price, salary, afford, diff }
                })
                .sort((a: any, b: any) => b.afford - a.afford)

              const bestCountry = countriesData[0]
              const worstCountry = countriesData[countriesData.length - 1]

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => setHoveredProduct(product.id)}
                  onHoverEnd={() => setHoveredProduct(null)}
                  className="group"
                >
                  <MouseFollowCard className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-cyan-400/50 transition-all duration-300">
                    <motion.div 
                      style={{ transformStyle: "preserve-3d" }}
                      className="p-6"
                    >
                      {/* Product Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                            {product.name}
                            {hoveredProduct === product.id && (
                              <motion.span
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="text-cyan-400"
                              >
                                ✨
                              </motion.span>
                            )}
                          </h3>
                          <p className="text-sm text-white/50">po {product.unit}</p>
                        </div>
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="text-right bg-gradient-to-br from-cyan-500/20 to-blue-600/20 px-4 py-3 rounded-xl border border-cyan-400/30"
                        >
                          <div className="text-3xl font-black text-white">
                            {Number(serbiaRecord.value).toFixed(0)}
                            <span className="text-sm text-white/50 ml-1">RSD</span>
                          </div>
                          <div className="text-cyan-400 font-mono text-sm">≈ {serbiaPrice.toFixed(2)}€</div>
                        </motion.div>
                      </div>

                      {/* Serbia Stats */}
                      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 mb-4 border border-cyan-400/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">🇷🇸</div>
                            <div>
                              <div className="text-sm text-white/60">Srbija - Kupovna moć</div>
                              <div className="text-2xl font-bold text-white">{serbiaAfford.toFixed(0)} {product.unit}</div>
                            </div>
                          </div>
                          {bestCountry && (
                            <div className="text-right">
                              <div className="text-xs text-white/50">Najbolji: {bestCountry.country.name}</div>
                              <div className="text-xl font-bold text-emerald-400">
                                {bestCountry.afford.toFixed(0)} {product.unit}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Countries Comparison */}
                      <div className="space-y-2">
                        {countriesData.map((country: any, i: number) => {
                          const isTop = i < 3
                          const isBottom = i >= countriesData.length - 3
                          
                          return (
                            <motion.div
                              key={country.id}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: i * 0.05 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                              className={`relative overflow-hidden rounded-lg p-4 border transition-all ${
                                isTop
                                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-400/40'
                                  : isBottom
                                  ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-400/40'
                                  : 'bg-white/5 border-white/10'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="text-xl font-bold text-white/30">#{i + 1}</div>
                                  <div>
                                    <div className="font-semibold text-white">{country.country.name}</div>
                                    <div className="text-sm text-white/50">{country.price.toFixed(2)}€ • {country.afford.toFixed(0)} {product.unit}</div>
                                  </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full font-bold text-sm ${
                                  country.diff > 20
                                    ? 'bg-red-500/30 text-red-300'
                                    : country.diff < -20
                                    ? 'bg-emerald-500/30 text-emerald-300'
                                    : 'bg-white/10 text-white/70'
                                }`}>
                                  {country.diff > 0 ? '+' : ''}{country.diff.toFixed(0)}%
                                </div>
                              </div>
                              {isTop && (
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: "100%" }}
                                  transition={{ delay: i * 0.1, duration: 0.5 }}
                                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400"
                                />
                              )}
                            </motion.div>
                          )
                        })}
                      </div>
                    </motion.div>
                  </MouseFollowCard>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </main>
  )
}
