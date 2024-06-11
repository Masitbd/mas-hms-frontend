import { IBacteria } from "@/app/(withlayout)/bacteria/page";
import {
  ICondition,
  IDepartment,
  ISensitivity,
} from "@/types/allDepartmentInterfaces";
export type IResultFieldForParameterBasedTest = {
  title: string;
  lable?: string;
  unit: string;
  normalValue: string;
};

export type IResultFieldForDescriptveTest = {
  title: string;
  lable?: string;
  description?: string;
};

export type IResultFieldForMicrobiologyTest = {
  sensitivityOptions: ISensitivity[];
  conditions: ICondition[];
  bacterias: IBacteria[];
};
export type IReportGroupFormData = {
  title: string;
  lable?: string;
  department: string | IDepartment;
  testResultType: string;
  deleted?: boolean;
  resultFields?:
    | IResultFieldForParameterBasedTest[]
    | IResultFieldForDescriptveTest[]
    | IResultFieldForMicrobiologyTest;
};

export const initialFormData: IReportGroupFormData = {
  title: "",
  lable: "",
  department: "",
  testResultType: "",
  deleted: false,
  resultFields: [],
};

export type IReportGroupFormParam = {
  mode: string;
  hanlderFunction: (
    props: React.SetStateAction<Partial<IReportGroupFormData>>
  ) => void;
  formData: IReportGroupFormData;
};

export const testResultType = [
  {
    label: "Parameter Based",
    value: "parameter",
  },
  {
    label: "Descriptive",
    value: "descriptive",
  },
  {
    label: "Bacterial",
    value: "bacterial",
  },
  {
    label: "Group",
    value: "group",
  },
];
