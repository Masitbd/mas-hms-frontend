export const reportType = [];
const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const defaultEndDate = new Date(Date.now());
export type IdefaultDate = {
  [x: string]: any;
  from: Date;
  to: Date;
};

export const defaultDate: IdefaultDate = {
  from: defaultStartDate,
  to: defaultEndDate,
};

interface SummaryItem {
  _id: string;
  total: number;
  commission: number;
  percent: number;
  totalPrice: number;
  discount: number;
}

export interface DepartmentItem {
  name: string;
  price: number;
}

interface OverallItem {
  discount: any;
  commission: any;
  total: any;
  percent: any;
  departments: DepartmentItem[];
  testNames: string[];
  oid: string;
  uuid: string;
  _id: string;
  name: string;
}

export interface OverALlPerformanceData {
  summery: SummaryItem[];
  overall: OverallItem[];
}
