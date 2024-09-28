import {
  IReportGroup,
  IResultField,
  ITest,
} from "@/types/allDepartmentInterfaces";
import { Dispatch, SetStateAction } from "react";
import { IOrderData } from "../order/initialDataAndTypes";
import { ISensitivity } from "../bactrologicalInfo/typesAndInitialData";

export type IPropsForGenerateReport = {
  params: { oid: string };
  searchParams: { reportGroup: string; mode: string };
};

export type ITestsFromOrder = {
  SL: number;
  test: ITest;
  status: string;
  discount: number;
  remark?: string;
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

export type Isensitivity = {
  _id?: string;
  id: string;
  value: string;
  A?: string;
  B?: string;
  C?: string;
};
export type ITEstREsultForMicroBio = {
  [key: string]: string | number | Isensitivity | boolean | IReportGroup | any;
  conductedBy: string;
  oid: string;
  reportGroup: IReportGroup;
  specimen: string;
  duration: string;
  temperatre: string;
  condition: string;
  growth: boolean;
  colonyCount?: {
    base: string;
    power: string;
  };
  bacteria?: string;
  sensivityOptions?: ISensitivity[];
  comment?: string;
  seal?: string;
  _id?: string;
};

export const InitialValueForMicro: ITEstREsultForMicroBio = {
  conductedBy: "",
  oid: "",
  reportGroup: {} as IReportGroup,
  specimen: "",
  duration: "",
  temperatre: "",
  condition: "",
  growth: false,
  colonyCount: { base: "", power: "" },
  bacteria: "",
  sensivityOptions: [],
  comment: "",
  seal: "",
};

export type IPropsForMicroBiology = {
  oid: string;
  reportGroup: IReportGroup;
  order: IOrderData;
  mode: string;
};
