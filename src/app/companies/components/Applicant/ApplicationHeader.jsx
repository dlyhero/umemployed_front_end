'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { MobileMenu } from '../../[companyId]/dashboard/MobileMenu';
import { MobileSearch } from '../../[companyId]/jobs/listing/components/MobileSearch';

const ApplicationHeader = ({ companyId, activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <header className="flex justify-between items-center md:hidden mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
        <Button
          variant="ghost"
          className="p-2 text-gray-900 hover:bg-gray-100 rounded-full"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </Button>
      </header>
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        activeTab={`/companies/${companyId}/applications`}
        setActiveTab={setActiveTab}
        companyId={companyId}
      />
      <div className="md:hidden mb-6">
        <MobileSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} disabled />
      </div>
    </>
  );
};

export default ApplicationHeader;