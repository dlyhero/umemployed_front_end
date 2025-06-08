'use client'
import { useSettings } from '@/src/context/SettingsContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { LogOut } from 'lucide-react'
import { Separator } from '@radix-ui/react-dropdown-menu'

export default function AccountSettings() {
  const { settings, updateSettings } = useSettings()

  const handleChange = (key, value) => {
    updateSettings('account', { [key]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Account</h2>
        <p className="text-sm text-muted-foreground">
          Update your account settings
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            value={settings.account.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>

        <div>
          <Label>Language</Label>
          <Select 
            value={settings.account.language}
            onValueChange={(value) => handleChange('language', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label>Dark Mode</Label>
            <p className="text-sm text-muted-foreground">
              Switch between light and dark theme
            </p>
          </div>
          <Switch 
            checked={settings.account.darkMode}
            onCheckedChange={(checked) => handleChange('darkMode', checked)}
          />
        </div>

        <div className="flex justify-end">
          <Button variant={`brand`} className={`w-fit`}>Save Changes</Button>
        </div>
        {/* Danger Zone - Like LinkedIn's account closure */}
      <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <LogOut className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-semibold text-red-600">Account Actions</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Deactivate Account</Label>
            <p className="text-sm text-gray-500">Temporarily disable your account</p>
            <Button variant="outline" className="mt-2 text-red-600 border-red-200 hover:bg-red-50">
              Deactivate
            </Button>
          </div>
          <Separator />
          <div>
            <Label>Delete Account</Label>
            <p className="text-sm text-gray-500">Permanently remove your account</p>
            <Button variant="outline" className="mt-2 text-red-600 border-red-200 hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}