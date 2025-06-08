'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TransactionStatusBadge from './TransactionStatusBadge';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';

const TransactionTable = ({ transactions }) => {
  const handleCopy = (text) => {
    navigator.clipboard.write(text);
    toast.success('Transaction ID copied to clipboard!');
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden sm:table-cell">Transaction ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden md:table-cell">Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx, index) => (
            <motion.tr
              key={tx.transaction_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TableCell className="hidden sm:table-cell">
                <button
                  onClick={() => handleCopy(tx.transaction_id)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <Copy className="h-4 w-4" />
                  <span className="truncate max-w-[100px]">{tx.transaction_id}</span>
                </button>
              </TableCell>
              <TableCell>${tx.amount.toFixed(2)}</TableCell>
              <TableCell className="hidden md:table-cell capitalize">
                {tx.payment_method}
              </TableCell>
              <TableCell>
                <TransactionStatusBadge status={tx.status} />
              </TableCell>
              <TableCell>
                {new Date(tx.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </TableCell>
              <TableCell className="truncate max-w-[150px] sm:max-w-[200px]">
                {tx.description}
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;