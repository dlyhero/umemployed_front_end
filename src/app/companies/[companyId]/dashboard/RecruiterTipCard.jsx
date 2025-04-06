// RecruiterTipCard.jsx
'use client'
import { motion } from 'framer-motion'

export const RecruiterTipCard = ({ tip }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="border border-gray-200 rounded-xl p-5 hover:border-[#1e90ff] transition-colors"
  >
    <div className="flex items-start space-x-4">
      <div className="p-3 bg-[#1e90ff]/10 rounded-lg">
        {tip.icon}
      </div>
      <div>
        <h3 className="font-bold text-lg mb-1">{tip.title}</h3>
        <p className="text-gray-600">{tip.description}</p>
      </div>
    </div>
  </motion.div>
)