'use client'

export const StatCard = ({ stat }) => (
  <div
    className="bg-white p-4 rounded-xl border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <h3 className="text-gray-900 text-lg font-bold">{stat.name}</h3>
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
  </div>
)