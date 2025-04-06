// PremiumCTA.jsx
'use client'
import { Zap } from 'lucide-react'

export const PremiumCTA = () => (
  <div className="mt-8 p-6 bg-gradient-to-r from-[#1e90ff] to-purple-500 rounded-xl shadow-lg text-white relative overflow-hidden">
    {/* Decorative Background Circle */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
    
    {/* Content */}
    <div className="relative z-10">
      {/* Icon with Background */}
      <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
        <Zap className="w-6 h-6 text-white animate-pulse" />
      </div>

      {/* Heading */}
      <h3 className="text-xl font-bold mb-2 tracking-tight">Go Premium</h3>

      {/* Description */}
      <p className="text-sm opacity-90 mb-4 leading-relaxed">
        Supercharge your hiring with exclusive recruiter features
      </p>

      {/* Features List */}
      <ul className="text-sm mb-6 space-y-3">
        {[
          { emoji: "📊", text: "Advanced hiring analytics & insights" },
          { emoji: "🚀", text: "Priority job postings for faster visibility" },

        ].map((feature, index) => (
          <li
            key={index}
            className="flex items-center gap-3 p-2 bg-white/10 rounded-md transition-all duration-300 hover:bg-white/20"
          >
            <span className="text-lg">{feature.emoji}</span>
            <span className="text-sm font-medium opacity-90">{feature.text}</span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <button className="w-full bg-gradient-to-r from-white to-gray-100 text-[#1e90ff] py-3 px-4 rounded-md text-sm font-semibold shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-gray-100 hover:to-white transition-all duration-300">
        Upgrade Now
      </button>
    </div>
  </div>
)