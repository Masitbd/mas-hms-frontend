// Define the structure for transaction data
export interface Transaction {
  _id: string;
  amount: number;
  description: string;
  transactionType: string;
  ref: string;
  uuid: string;
  postedBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TransactionRecord {
  _id: string;
  uuid: string;
  totalPrice: number;
  transactions: Transaction[];
  oid: string;
  createdAt: string;
  netPayable: number;
  dueAmount: number;
}
