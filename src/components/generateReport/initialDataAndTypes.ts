import {
  IReportGroup,
  IResultField,
  ITest,
} from "@/types/allDepartmentInterfaces";
import { IOrderData } from "../order/initialDataAndTypes";
import { ENUM_MODE } from "@/enum/Mode";

export type IPropsForGenerateReport = {
  params: { oid: string };
  searchParams: { reportGroup: string; mode: string };
};

export type ITestsFromOrder = {
  SL: number;
  test: ITest;
  status: string;
  discount: number;
  ramark: string;
};

export type IPropsForParameter = {
  tests: ITestsFromOrder[];
  oid: string;
  reportGroup: IReportGroup;
  order: IOrderData;
  mode: string;
};

export type ITestResultForParameter = {
  oid: string;
  reportGroup: IReportGroup;
  testResult: IResultField[];
  comment: string;
  createdAt?: string;
  conductedBy: string;
};
