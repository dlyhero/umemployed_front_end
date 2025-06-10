'use client'
import { Logo } from '@/src/components/common/Header/Logo'
import { PremiumCTA } from './PremiumCTA'
import { SidebarNav } from './SidebarNav'

export const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="hidden md:block w-70 shrink-0 md:fixed left-0 top-0 bottom-0  bg-white rounded-xl">
    <div className=" rounded-xl  p-4 sticky ">
      <div className='mb-12'>
        <Logo />
      </div>
      <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <PremiumCTA />
    </div>
  </aside>
)