import React, { useState, useEffect } from "react";

import TransactionCard from "./TransactionCard";

import { DollarSign, Printer } from "lucide-react";
import TransactionSkeleton from "./TransactionSkeleton";
import { TransactionRecord } from "./Types";
import { printOrderSummery } from "./Functions";
import { IPatient } from "@/types/allDepartmentInterfaces";

interface TransactionListProps {
  data?: TransactionRecord[];
  isLoading?: boolean;
  error?: string;
  patientInfo: IPatient;
}

const TransactionList: React.FC<TransactionListProps> = ({
  data = [],
  isLoading = false,
  error = "",
  patientInfo,
}) => {
  // Calculate totals across all records
  const totalValue = data.reduce((sum, record) => sum + record.netPayable, 0);
  const totalPaid = data.reduce(
    (sum, record) =>
      sum +
      record.transactions.reduce(
        (tSum, t) => (t.transactionType === "debit" ? tSum + t.amount : tSum),
        0
      ),
    0
  );
  const totalDue = data.reduceRight((s, c) => s + (c.dueAmount ?? 0), 0);
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  const handlePrint = () => {
    printOrderSummery({ orders: data, patientInfo });
  };

  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200 mb-6">
        <h3 className="font-semibold mb-2">Error Loading Transactions</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 mx-auto">
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Transaction Records
        </h2>

        {data.length ? (
          <button
            onClick={handlePrint}
            className="print:hidden ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <Printer size={18} className="mr-2" />
            Print
          </button>
        ) : (
          ""
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            {/* <DollarSign className="text-blue-600 mr-2" size={20} /> */}
            <div className="text-sm text-blue-600 font-medium">Total Value</div>
          </div>
          <div className="text-xl font-bold text-blue-700">
            {isLoading ? (
              <div className="h-6 bg-blue-100 animate-pulse rounded w-24"></div>
            ) : (
              formatCurrency(totalValue)
            )}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            {/* <DollarSign className="text-green-600 mr-2" size={20} /> */}
            <div className="text-sm text-green-600 font-medium">Total Paid</div>
          </div>
          <div className="text-xl font-bold text-green-700">
            {isLoading ? (
              <div className="h-6 bg-green-100 animate-pulse rounded w-24"></div>
            ) : (
              formatCurrency(totalPaid)
            )}
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            {/* <DollarSign className="text-red-600 mr-2" size={20} /> */}
            <div className="text-sm text-red-600 font-medium">Total Due</div>
          </div>
          <div className="text-xl font-bold text-red-700">
            {isLoading ? (
              <div className="h-6 bg-red-100 animate-pulse rounded w-24"></div>
            ) : (
              formatCurrency(totalDue)
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <TransactionSkeleton />
      ) : data.length > 0 ? (
        <>
          {data.map((record) => (
            <TransactionCard key={record._id} record={record} />
          ))}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
          <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No Transactions Found
          </h3>
          <p className="text-gray-500">
            There are no transaction records to display.
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
