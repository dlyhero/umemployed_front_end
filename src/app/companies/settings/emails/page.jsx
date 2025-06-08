'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function EmailSettings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      console.log('Session loading...');
      return;
    }

    if (status === 'unauthenticated' || !session?.accessToken || !session?.user?.user_id) {
      setError('Please log in to view email settings');
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [status, session]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    if (status === 'unauthenticated' || !session?.accessToken || !session?.user?.user_id) {
      setError('Please log in to view email settings');
      setLoading(false);
      return;
    }

    setLoading(false);
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
        <Button onClick={fetchData} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

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
            <Input value={session?.user?.email || 'N/A'} readOnly />
            <Button variant="outline" disabled>Change</Button>
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
          <Button variant="brand" className="w-fit">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}