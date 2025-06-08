'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import TransactionTable from '../components/transaction-history/TransactionTable';
import TransactionFilters from '../components/transaction-history/TransactionFilters';
import { fetchTransactionHistory } from '../../api/companies/transaction-history';

export default function TransactionHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      if (status === 'loading') return;
      if (status === 'unauthenticated') {
        toast.error('Please sign in to view transaction history.');
        router.push('/auth/signin');
        return;
      }
      if (!session?.accessToken || !session?.user?.user_id) {
        setError('Invalid session. Please sign in again.');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchTransactionHistory(session.accessToken);
        setTransactions(data);
        setFilteredTransactions(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load transaction history. Please try again.');
        setLoading(false);
      }
    };
    fetchData();
  }, [status, session, router]);

  useEffect(() => {
    let filtered = transactions;
    if (statusFilter !== 'all') {
      filtered = filtered.filter((tx) => tx.status.toLowerCase() === statusFilter);
    }
    if (tierFilter !== 'all') {
      filtered = filtered.filter((tx) =>
        tx.description.toLowerCase().includes(tierFilter.toLowerCase())
      );
    }
    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [statusFilter, tierFilter, transactions]);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#1e90ff]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="flex flex-col justify-center items-center h-64">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TransactionFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            tierFilter={tierFilter}
            setTierFilter={setTierFilter}
          />
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No transactions found for the selected filters.
              </p>
            </div>
          ) : (
            <>
              <TransactionTable transactions={currentTransactions} />
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}