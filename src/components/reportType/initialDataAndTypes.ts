import { IBacteria } from "@/app/(withlayout)/bacteria/page";
import {
  ICondition,
  IDepartment,
  IReportGroup,
  ISensitivity,
} from "@/types/allDepartmentInterfaces";
import { Schema } from "rsuite";
const { StringType } = Schema.Types;
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
  _id?: string;
  title?: string;
  label?: string;
  testResultType?: string;
  deleted?: boolean;
  resultType: string;
  group: string;
  department?: IDepartment;
  reportGroup?: IReportGroup;
  resultFields?:
    | IResultFieldForParameterBasedTest[]
    | IResultFieldForDescriptveTest[]
    | IResultFieldForMicrobiologyTest;
};

export const initialFormData: IReportGroupFormData = {
  _id: "",
  title: "",
  label: "",

  testResultType: "",
  resultType: "",
  deleted: false,
  resultFields: [],

  group: "",
};

export type IReportGroupFormParam = {
  mode: string;
  hanlderFunction: (
    props: React.SetStateAction<Partial<IReportGroupFormData>>
  ) => void;
  formData: IReportGroupFormData;
  model: any;
  forwordedRef: React.MutableRefObject<any>;
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

export const dummyReprtGroupData = [
  { label: "Report Group 1" },
  { label: "Report Group 2" },
  ,
  { label: "Report Group 3" },
  ,
  { label: "Report Group 4" },
  ,
  { label: "Report Group 5" },
  ,
  { label: "Report Group 6" },
  { label: "Report Group 7" },
  { label: "Report Group 8" },
  ,
  { label: "Report Group 9" },
];

export const reportType = [
  {
    reportGroup: {
      title: "Some Title",
      label: "Report Group 1",
    },
    group: "some Group 1",
    test: "some test",
    investation: "some investation",
    unit: "dd/dl",
    normalValue: "some",
  },
  {
    reportGroup: {
      title: "Some Title",
      label: "Report Group 1",
    },
    group: "some Group 2",
    test: "some test",
    investation: "some investation",
    unit: "dd/dl",
    normalValue: "some",
  },
  {
    reportGroup: {
      title: "Some Title",
      label: "Report Group 1",
    },
    group: "some Group 3",
    test: "some test",
    investation: "some investation",
    unit: "dd/dl",
    normalValue: "some",
  },
  {
    reportGroup: {
      title: "Some Title",
      label: "Report Group 2",
    },
    group: "some Group",
    test: "some test",
    investation: "some investation",
    unit: "dd/dl",
    normalValue: "some",
  },
  {
    reportGroup: {
      title: "Some Title",
      label: "Report Group 2",
    },
    group: "some Group 4",
    test: "some test",
    investation: "some investation",
    unit: "dd/dl",
    normalValue: "some",
  },
];

export type INewReportGroupProps = {
  formData: IReportGroupFormData;
  setFormData: (
    props: React.SetStateAction<Partial<IReportGroupFormData>>
  ) => void;
  mode: string;
};

export const newGroupModel = Schema.Model({
  group: StringType().isRequired("This field is required."),
  resultType: StringType().isRequired("This field is required."),
  reportGroup: StringType().isRequired("This field is required."),
  department: StringType().isRequired("This field is required."),
});

export type EmptyTableData = {
  test: string;
  investigation: string;
  normalValue: string;
  unit: string;
  remark: string;
  status: string;
  SL: number;
  reportTypeGroup: string;
};
