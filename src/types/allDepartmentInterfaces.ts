import { IBacteria } from "@/app/(withlayout)/bacteria/page";
import { IPdrv } from "@/app/(withlayout)/pdrv/page";
import { IEmployeeRegistration } from "@/components/employee/TypesAndDefaults";

export type ICondition = {
  _id?: string;
  label: string;
  value: string;
  description: string;
};
export type ISpecimen = {
  _id?: string;
  label: string;
  value: string;
  description: string;
};
export type IReportGroup = {
  _id?: string;
  label: string;
  value: string;
  description: string;
  department: string;
  testResultType: string;
};
export type IVacuumTube = {
  _id?: string;
  label: string;
  value: string;
  price: number;
  description: string;
};
export type IDepartment = {
  _id?: string;
  label: string;
  value: string;
  commissionParcentage: number;
  fixedCommission: number;
  isCommissionFiexed: boolean;
  description?: string;
};
export type IDoctor = {
  _id?: string;
  title: string;
  code?: string;
  name: string;
  fatherName: string;
  email: string;
  designation: string;
  phone: string;
  image?: string;
  account_number?: string; // as account.uuid
  account_id?: IAccount; // as account_.id,
  address?: string;
  assignedME?: string | IEmployeeRegistration;
};
export type ITransaction = {
  _id?: string;
  ref?: string;
  amount: number;
  description: string;
  transactionType: string;
  uuid: string;
};
export type IHospitalGroup = {
  _id?: string;
  label: string;
  value: string;
  description?: string;
};
export type ISensitivity = {
  _id?: string;
  label: string;
  value: string;
  description?: string;
};

export type IResultField = {
  investigation: string;
  title?: string;
  test?: string;
  unit?: string;
  normalValue?: string;
  defaultValue?: string[];
  resultDescription?: string;
  sensitivityOptions?: ISensitivity[];
  conditons?: ICondition[];
  bacterias?: IBacteria[];
  hasPdrv: boolean;
  description?: string;
} & Record<string, any>;

export type ITest = {
  _id?: string;
  label: string;
  value: string;
  description?: string;
  testResultType: string;
  department: IDepartment;
  testCode: string;
  specimen: ISpecimen[];
  type: string;
  testType: string;
  hasTestTube: boolean;
  testTube: IVacuumTube[];
  reportGroup: string;
  hospitalGroup: IHospitalGroup;
  price: number;
  isGroupTest: boolean;
  groupTests: ITest[];
  vatRate: number;
  processTime: number;
  resultFields: IResultField[];
};

export type IAccount = {
  _id: string;
  uuid: string;
  balanceType: string;
  balance: number;
};
export type IPatient = {
  _id: any;
  name: string;
  age: string;
  gender: string;
  address: string;
  uuid: string;
  ref_by?: string;
  consultant?: string;
  phone: string;
  email?: string;
  image: string;
};
