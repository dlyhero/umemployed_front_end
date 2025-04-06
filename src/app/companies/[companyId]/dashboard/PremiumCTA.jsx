'use client'
import { Zap } from 'lucide-react'

export const PremiumCTA = () => (
  <div className="mt-8 p-4 bg-gradient-to-r from-brand to-purple-500 rounded-lg text-white">
    <Zap className="w-6 h-6 mb-2" />
    <h3 className="font-bold mb-1">Go Premium</h3>
    <p className="text-sm opacity-90 mb-3">Unlock exclusive features and job opportunities</p>
    <button className="w-full bg-white text-brand py-2 px-4 rounded-md text-sm font-medium hover:bg-opacity-90 transition">
      Upgrade Now
    </button>
  </div>
)