// Type for individual test wise documents
export interface TestWiseIncomeStatementTestWiseDoc {
  _id: string;
  sell: number;
  quantity: number;
  price: number;
  discount: number;
  vat: number;
  pa: number;
  rg: string; // Report Group
}

// Type for report group wise data
export interface TestWiseIncomeStatementReportGroupWiseData {
  _id: string;
  sell: number;
  quantity: number;
  price: number;
  discount: number;
  vat: number;
  pa: number;
  rg: string; // Report Group
}

// Type for total summary
export interface TestWiseIncomeStatementTotal {
  _id: string | null; // Can be null
  sell: number;
  quantity: number;
  discount: number;
  vat: number;
  pa: number;
}

// Type for tube price items
export interface TestWiseIncomeStatementTubePrice {
  _id: string;
  sell: number;
  price: number;
  vat: number;
  pa: number;
  quantity: number;
}

// Main type encompassing all data
export interface TestWiseIncomeStatementData {
  testWiseDocs: TestWiseIncomeStatementTestWiseDoc[];
  reportGroupWiseData: TestWiseIncomeStatementReportGroupWiseData[];
  total: TestWiseIncomeStatementTotal[];
  tubePrice: TestWiseIncomeStatementTubePrice[];
}
