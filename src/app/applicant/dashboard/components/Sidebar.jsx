'use client'
import { Logo } from '@/src/components/common/Header/Logo'
import { PremiumCTA } from './PremiumCTA'
import { SidebarNav } from './SidebarNav'

export const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="hidden md:block w-70 shrink-0 md:fixed left-0 top-0 bottom-0  bg-white border-r overflow-y-auto [&::-webkit-scrollbar]:hidden
">
    <div className="p-4">
      <div className='mb-8'>
        <Logo />
      </div>
      <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <PremiumCTA />
    </div>
  </aside>
)