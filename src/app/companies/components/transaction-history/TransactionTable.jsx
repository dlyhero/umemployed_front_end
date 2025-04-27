
import { Check, X } from "lucide-react";

export default function TransactionTable({ transactions }) {
  return (
    <div className="bg-white rounded-lg overflow-auto border">
      <table className="w-full">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Transaction ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Candidate Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Description
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr
                key={transaction.transaction_id}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-sm text-gray-600">
                  {transaction.transaction_id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {transaction.candidate.first_name}{" "}
                  {transaction.candidate.last_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {transaction.created_at}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">
                  To get endorsement details
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  ${transaction.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  {transaction.status === "completed" && (
                    <Check className="text-green-500 w-6 h-6" />
                  )}
                  {transaction.status === "pending" && (
                    <span className="text-xs font-semibold text-yellow-500">
                      Pending...
                    </span>
                  )}
                  {transaction.status === "failed" && (
                    <X className="text-red-500 w-6 h-6" />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="px-4 py-3 text-center text-sm text-gray-600"
              >
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
