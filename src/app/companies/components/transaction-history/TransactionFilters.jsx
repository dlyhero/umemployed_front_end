'use client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const TransactionFilters = ({ statusFilter, setStatusFilter, tierFilter, setTierFilter }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-4">
      <div className="flex-1">
        <Label htmlFor="status-filter" className="block text-sm font-medium mb-1">
          Status
        </Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger id="status-filter">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <Label htmlFor="tier-filter" className="block text-sm font-medium mb-1">
          Subscription Tier
        </Label>
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger id="tier-filter">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TransactionFilters;