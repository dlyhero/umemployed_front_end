'use client'
import { PremiumCTA } from './PremiumCTA'
import { SidebarNav } from './SidebarNav'

export const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="hidden lg:block w-64 shrink-0">
    <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
      <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <PremiumCTA />
    </div>
  </aside>
)