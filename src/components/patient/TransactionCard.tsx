import React, { useState } from "react";
import { ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import { Transaction, TransactionRecord } from "./Types";

interface TransactionCardProps {
  record: TransactionRecord;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ record }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate total paid and due for this record
  const totalPaid = record.transactions.reduce(
    (sum, t) => (t.transactionType === "debit" ? sum + t.amount : sum),
    0
  );
  const dueAmount = record.netPayable - totalPaid;

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Order ID: {record.oid}
          </h3>
          <div className="text-xl font-bold text-blue-600">
            {formatCurrency(record?.netPayable)}
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          Placed on: {formatDate(record?.createdAt)}
        </div>

        <div className="mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-200 font-medium"
          >
            {record.transactions.length > 0 ? (
              <>
                {isExpanded ? (
                  <>
                    <ChevronUp size={18} className="mr-1" />
                    Hide Transactions
                  </>
                ) : (
                  <>
                    <ChevronDown size={18} className="mr-1" />
                    Show Transactions ({record.transactions.length})
                  </>
                )}
              </>
            ) : (
              <span className="text-gray-400">No transactions</span>
            )}
          </button>

          {isExpanded && record.transactions.length > 0 && (
            <div className="mt-4 space-y-3 transition-all duration-300">
              {record.transactions.map((transaction: Transaction) => (
                <div
                  key={transaction._id}
                  className="flex justify-between items-center p-3 rounded-md bg-gray-50 border-l-4 border-green-500"
                >
                  <div>
                    <div className="font-medium text-gray-800">
                      {transaction.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(transaction.createdAt)} • By{" "}
                      {transaction.postedBy}
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${
                      transaction.transactionType === "debit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.transactionType === "debit" ? "+ " : "- "}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-600">Due Amount:</span>
            <span
              className={`font-semibold ${
                dueAmount > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {formatCurrency(dueAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
