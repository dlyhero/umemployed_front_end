'use client';
import { PremiumCTA } from './PremiumCTA';
import { SidebarNav } from './SidebarNav';

export const Sideba = ({ activeTab, setActiveTab, companyId }) => (
  <aside className="hidden lg:block w-64 shrink-0">
    <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
      <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} companyId={companyId} />
      <PremiumCTA />
    </div>
  </aside>
);