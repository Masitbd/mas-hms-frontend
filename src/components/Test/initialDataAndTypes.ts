import { ITest } from "@/types/allDepartmentInterfaces";
import React from "react";
import { FormInstance } from "rsuite";
import { Schema } from "schema-typed";
import { Schema as ReactSuiteSchema } from "rsuite";
const { StringType, NumberType, ArrayType } = ReactSuiteSchema.Types;

export type ITestFormProps = {
  defaultValue: ITest;
  forwardedRef: React.MutableRefObject<FormInstance>;
  formData: ITest;
  setfromData: (props: Partial<ITest>) => void;
  mode: string;
  model: Schema;
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
  {
    label: "Other",
    value: "other",
  },
];

export const testType = [
  {
    label: "Signle",
    value: "single",
  },
  {
    label: "Group",
    value: "group",
  },
];

export const modelForTestForm = ReactSuiteSchema.Model({
  label: StringType().isRequired("This field is required."),
  type: StringType().isRequired("This field is required."),
  testResultType: StringType().isRequired("This field is required."),
  department: StringType().isRequired("This field is required."),
  price: NumberType().isRequired("This field is required."),
  processTime: NumberType().isRequired("This field is required."),
  specimen: ArrayType().isRequired("This field is required."),
  hospitalGroup: StringType().isRequired("This field is required."),
  reportGroup: StringType().isRequired("This field is required."),
});

export const initialDataForTestForm = {
  label: "",
  department: "",
  testCode: "",
  specimen: [],
  testType: "",
  hasTestTube: false,
  testTube: [],
  reportGroup: "",
  hospitalGroup: "",
  price: 0,
  vatRate: 0,
  processTime: 0,
  resultFields: [],
  groupTests: [],
  isGroupTest: false,
  testResulType: "",
  type: "",
  value: "",
};
