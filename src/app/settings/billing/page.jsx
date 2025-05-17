import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function BillingSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Billing</h2>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and payment methods
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Premium Plan</p>
                <p className="text-sm text-muted-foreground">
                  $9.99/month • Next billing date: Jan 30, 2024
                </p>
              </div>
              <Button variant="outline">Change Plan</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">
                  Expires 12/2025
                </p>
              </div>
              <Button variant="outline">Update</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p className="text-sm">Receipts are sent to billing@example.com</p>
              <Button variant="outline">Update</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label>Auto-Renewal</Label>
            <p className="text-sm text-muted-foreground">
              Automatically renew your subscription
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex justify-end">
          <Button variant="destructive">Cancel Subscription</Button>
        </div>
      </div>
    </div>
  )
}