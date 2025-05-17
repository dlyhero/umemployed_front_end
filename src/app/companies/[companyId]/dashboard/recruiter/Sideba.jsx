'use client';
import { PremiumCTA } from './PremiumCTA';
import { SidebarNav } from './SidebarNav';

export const Sideba = ({ companyId }) => (
  <aside className="hidden lg:block w-64 shrink-0">
    <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
      <SidebarNav companyId={companyId} />
      <PremiumCTA />
    </div>
  </aside>
);