'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings, User, Lock, Bell, Mail, CreditCard } from 'lucide-react';
import { checkSubscriptionStatus } from '../../../../lib/api/recruiter_subscribe';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscription = async () => {
    setLoading(true);
    setError(null);

    if (status === 'loading') return;
    if (status === 'unauthenticated' || !session?.accessToken || !session?.user?.user_id) {
      setError('Please log in to view settings');
      setLoading(false);
      return;
    }

    try {
      const subscriptionData = await checkSubscriptionStatus(
        session.user.user_id,
        'recruiter',
        session.accessToken
      );
      setSubscription(subscriptionData);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load subscription information');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [status, session]);

  const formatTier = (tier) => {
    if (!tier || tier.toLowerCase() === 'basic') return 'No Subscription';
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  const settings = {
    account: { email: session?.user?.email || 'N/A' },
    security: { twoFactorAuth: false }, // Placeholder
    notifications: { jobAlerts: false }, // Placeholder
    billing: { plan: subscription ? formatTier(subscription.tier) : 'No Subscription' },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Button onClick={fetchSubscription} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Settings Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SettingsCard
          icon={<Settings />}
          title="Account"
          description="Manage account preferences"
          href="/companies/settings/account"
          preview={settings.account.email}
        />

        <SettingsCard
          icon={<Lock />}
          title="Security"
          description="Security and privacy settings"
          href="/companies/settings/security"
          preview={settings.security.twoFactorAuth ? '2FA Enabled' : '2FA Disabled'}
        />

        <SettingsCard
          icon={<Bell />}
          title="Notifications"
          description="Configure notifications"
          href="/companies/settings/notifications"
          preview={`${settings.notifications.jobAlerts ? 'Alerts ON' : 'Alerts OFF'}`}
        />

        <SettingsCard
          icon={<Mail />}
          title="Emails"
          description="Email preferences"
          href="/companies/settings/emails"
          preview={`Primary: ${settings.account.email}`}
        />

        <SettingsCard
          icon={<CreditCard />}
          title="Billing"
          description="Subscription and payments"
          href="/companies/settings/billing"
          preview={settings.billing.plan}
        />
      </div>
    </div>
  );
}

function SettingsCard({ icon, title, description, href, preview }) {
  return (
    <Link href={href}>
      <div className="border rounded-lg p-6 hover:bg-muted/50 transition cursor-pointer h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full">{icon}</div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <p className="text-sm font-medium">{preview}</p>
        <Button variant="link" className="text-gray-600 font-semibold mt-4 px-0">
          Configure →
        </Button>
      </div>
    </Link>
  );
}