'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Toaster, toast } from 'react-hot-toast';
import { fetchTransactionHistory } from '../../../api/companies/transaction-history';
import { checkSubscriptionStatus, cancelSubscription } from '../../../../../lib/api/recruiter_subscribe';

export default function BillingSettings() {
  const [transaction, setTransaction] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [autoRenewal, setAutoRenewal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated' || !session?.accessToken || !session?.user?.user_id) {
      setError('Please log in to view billing information');
      setLoading(false);
      return;
    }

    try {
      // Fetch subscription status
      const subscriptionData = await checkSubscriptionStatus(
        session.user.user_id,
        'recruiter',
        session.accessToken
      );
      setSubscription(subscriptionData);
      setAutoRenewal(subscriptionData.has_active_subscription);

      // Fetch transaction history
      const transactionData = await fetchTransactionHistory(session.accessToken);
      if (transactionData && Array.isArray(transactionData) && transactionData.length > 0) {
        setTransaction(transactionData[0]);
      } else if (subscriptionData.has_active_subscription && subscriptionData.tier.toLowerCase() !== 'basic') {
        setError('Subscription active but no transaction details available. Please contact support.');
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to load billing information. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [status, session]);

  const handleCancelSubscription = async () => {
    if (!session?.accessToken) {
      setError('Please log in to cancel subscription');
      toast.error('Please log in to cancel subscription');
      return;
    }

    try {
      await cancelSubscription('recruiter', session.accessToken);
      setSubscription({ has_active_subscription: false, tier: 'basic' });
      setAutoRenewal(false);
      toast.success('Subscription canceled successfully');
    } catch (err) {
      setError('Failed to cancel subscription');
      toast.error('Failed to cancel subscription');
    }
  };

  const handleToggleAutoRenewal = async () => {
    setAutoRenewal(!autoRenewal);
    toast.error('Auto-renewal toggle not implemented. Please provide an API endpoint to enable this feature.');
  };

  // Calculate next billing date (1 month from started_at)
  const getNextBillingDate = (startedAt) => {
    if (!startedAt) return 'N/A';
    const date = new Date(startedAt);
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format expiry date for payment method (1 year from now, as no API data provided)
  const getExpiryDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Capitalize subscription tier or payment method
  const formatTier = (tier) => {
    if (!tier) return 'No Subscription';
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  const isNoSubscription = !subscription?.has_active_subscription || subscription?.tier.toLowerCase() === 'basic';

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
      <Toaster position="top-right" />
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
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{isNoSubscription ? 'No Subscription' : `${formatTier(subscription.tier)} Plan`}</p>
                <p className="text-sm text-muted-foreground">
                  {isNoSubscription ? 'No Subscription' : `$${transaction?.amount ? transaction.amount.toFixed(2) : 'N/A'}/month`} • Next billing date: {isNoSubscription ? 'N/A' : getNextBillingDate(subscription.started_at)}
                  {!isNoSubscription && subscription.started_at && (
                    <span className="ml-2 text-xs">(One month from start date)</span>
                  )}
                </p>
                {!transaction && subscription.has_active_subscription && subscription.tier.toLowerCase() !== 'basic' && (
                  <p className="text-sm text-yellow-500 mt-2">
                    Warning: Transaction details unavailable. Amount may be inaccurate.
                  </p>
                )}
              </div>
              <Link href="/companies/pricing">
                <Button variant="outline">{isNoSubscription ? 'Choose Plan' : 'Change Plan'}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {transaction?.payment_method ? formatTier(transaction.payment_method) : 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Expires {getExpiryDate()}
                </p>
              </div>
              <Button variant="outline" disabled>Update</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing Name</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p className="text-sm">
                Receipts are sent to {transaction?.candidate?.full_name || 'N/A'}
              </p>
              <Button variant="outline" disabled>Update</Button>
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
          <Switch
            checked={autoRenewal}
            onCheckedChange={handleToggleAutoRenewal}
            disabled={isNoSubscription}
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={handleCancelSubscription}
            disabled={!subscription.has_active_subscription}
          >
            Cancel Subscription
          </Button>
        </div>
      </div>
    </div>
  );
}