import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function EmailSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Email Addresses</h2>
        <p className="text-sm text-muted-foreground">
          Manage your email addresses and preferences
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Primary Email</Label>
          <div className="flex items-center space-x-2">
            <Input value="john@example.com" readOnly />
            <Button variant="outline">Change</Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Add New Email</Label>
          <div className="flex items-center space-x-2">
            <Input placeholder="new-email@example.com" />
            <Button variant="outline">Add</Button>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing-emails">Marketing Emails</Label>
            <Switch id="marketing-emails" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="product-updates">Product Updates</Label>
            <Switch id="product-updates" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="newsletter">Newsletter</Label>
            <Switch id="newsletter" defaultChecked />
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant={`brand`} className={`w-fit`}>Save Changes</Button>
        </div>
      </div>
    </div>
  )
}