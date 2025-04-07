'use client'
import { StatCard } from './StatCard'

export const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {stats.map((stat) => (
      <StatCard key={stat.id} stat={stat} />
    ))}
  </div>
)