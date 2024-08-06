import {
  IReportGroup,
  IResultField,
  ITest,
} from "@/types/allDepartmentInterfaces";
import { Dispatch, SetStateAction } from "react";
import { IOrderData } from "../order/initialDataAndTypes";

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
  refeatch: any;
};

export type ITestResultForParameter = {
  oid: string;
  reportGroup: IReportGroup;
  testResult: IResultField[];
  comment: string;
  seal: string;
  createdAt?: string;
  conductedBy: string;
  analyzerMachine?: string;
};

export type IPropsForMargin = {
  setMargins: Dispatch<SetStateAction<number[]>>;
  margin: number[];
  marginTitle: string;
};
