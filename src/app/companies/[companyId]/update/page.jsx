'use client';

import dynamic from 'next/dynamic';

const CompanyUpdatePage = dynamic(() => import('./CompanyUpdatePage'), {
  ssr: false,
});

export default function CompanyUpdate() {
  return <CompanyUpdatePage />;
}