interface IEmployeePerformanceMain {
  _id: string;
  totalPrice: number;
  totalDiscount: number;
  paid: number;
  doctor: string;
  patient: string;
  marketingExecutive: string;
  createdAt: string;
  oid: string;
  MEId: string;
  totalVat: number;
}

interface IEmployeePerformanceTotal {
  _id: string | null;
  totalPrice: number;
  totalDiscount: number;
  paid: number;
  totalVat: number;
  patient: number;
  oid: string;
}

interface IEmployeePerformanceData {
  mainDocs: IEmployeePerformanceMain[];
  totalDocs: IEmployeePerformanceTotal[];
}
