'use client';
import { Badge } from '@/components/ui/badge';

const TransactionStatusBadge = ({ status }) => {
  const statusStyles = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };

  return (
    <Badge className={statusStyles[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default TransactionStatusBadge;