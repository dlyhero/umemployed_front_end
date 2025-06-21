'use client'
import { useSettings } from '@/src/context/SettingsContext'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function SecuritySettings() {
  const { settings, updateSettings } = useSettings()

  const handleChange = (key, value) => {
    updateSettings('security', { [key]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Security</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account security settings
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label>Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
          <Switch 
            checked={settings.security.twoFactorAuth}
            onCheckedChange={(checked) => handleChange('twoFactorAuth', checked)}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label>Login Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Get notified when someone logs into your account
            </p>
          </div>
          <Switch 
            checked={settings.security.loginAlerts}
            onCheckedChange={(checked) => handleChange('loginAlerts', checked)}
          />
        </div>

        <div className="flex justify-end">
          <Button variant={`brand`} className={"w-fit"}>Update Security Settings</Button>
        </div>
      </div>
    </div>
  )
}