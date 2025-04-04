'use client'
import { motion } from 'framer-motion'

export const StatCard = ({ stat }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <h3 className="text-gray-600 text-sm font-medium">{stat.name}</h3>
      <div className="p-2 rounded-lg bg-indigo-50 text-brand">
        {stat.icon}
      </div>
    </div>
    <div className="mt-3 flex items-baseline">
      <p className="text-2xl font-bold">{stat.value}</p>
      <span className={`ml-2 text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
        {stat.change}
      </span>
    </div>
  </motion.div>
)