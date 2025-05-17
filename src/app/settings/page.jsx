'use client'
import { Settings, User, Lock, Bell, Mail, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/src/context/SettingsContext'

export default function SettingsPage() {
  const { settings } = useSettings()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Settings Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SettingsCard 
          icon={<User />}
          title="Profile"
          description="Update your personal information"
          href="/settings/profile"
          preview={`${settings.profile.firstName} ${settings.profile.lastName}`}
        />

        <SettingsCard 
          icon={<Settings />}
          title="Account"
          description="Manage account preferences"
          href="/settings/account"
          preview={settings.account.email}
        />

        <SettingsCard 
          icon={<Lock />}
          title="Security"
          description="Security and privacy settings"
          href="/settings/security"
          preview={settings.security.twoFactorAuth ? "2FA Enabled" : "2FA Disabled"}
        />

        <SettingsCard 
          icon={<Bell />}
          title="Notifications"
          description="Configure notifications"
          href="/settings/notifications"
          preview={`${settings.notifications.jobAlerts ? "Alerts ON" : "Alerts OFF"}`}
        />

        <SettingsCard 
          icon={<Mail />}
          title="Emails"
          description="Email preferences"
          href="/settings/emails"
          preview="Primary: john@example.com"
        />

        <SettingsCard 
          icon={<CreditCard />}
          title="Billing"
          description="Subscription and payments"
          href="/settings/billing"
          preview={settings.billing.plan}
        />
      </div>
    </div>
  )
}

function SettingsCard({ icon, title, description, href, preview }) {
  return (
    <Link href={href}>
      <div className="border rounded-lg p-6 hover:bg-muted/50 transition cursor-pointer h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-full">
            {icon}
          </div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <p className="text-sm font-medium">{preview}</p>
        <Button variant="link" className="mt-4 px-0">
          Configure →
        </Button>
      </div>
    </Link>
  )
}