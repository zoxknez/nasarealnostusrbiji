'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CategoryCardProps {
  icon: ReactNode
  title: string
  count: number
  color: string
  onClick: () => void
  isActive: boolean
}

export function CategoryCard({ icon, title, count, color, onClick, isActive }: CategoryCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`relative group overflow-hidden rounded-2xl p-6 transition-all ${
        isActive 
          ? 'bg-gradient-to-br from-blue-600 to-cyan-600 shadow-2xl shadow-blue-500/50' 
          : 'bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/50'
      }`}
    >
      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(circle at center, ${color}20, transparent)`
        }}
      />
      
      <div className="relative z-10">
        <div className={`inline-flex p-4 rounded-xl mb-4 ${
          isActive ? 'bg-white/20' : 'bg-blue-500/10'
        }`}>
          {icon}
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${
          isActive ? 'text-white' : 'text-slate-100'
        }`}>
          {title}
        </h3>
        <p className={`text-sm ${
          isActive ? 'text-blue-100' : 'text-slate-400'
        }`}>
          {count} proizvoda
        </p>
      </div>

      {/* Glow effect */}
      {isActive && (
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-50"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ zIndex: -1 }}
        />
      )}
    </motion.button>
  )
}
