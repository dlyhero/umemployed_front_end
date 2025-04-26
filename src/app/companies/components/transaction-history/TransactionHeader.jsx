
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TransactionHeader({ search, setSearch, filter, setFilter }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        <Input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-48 sm:w-64 px-4 py-2 rounded-full border-gray-300 focus:ring-2 focus:ring-blue-600"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="px-4 py-2 rounded-full border-gray-300 focus:ring-2 focus:ring-blue-600">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
