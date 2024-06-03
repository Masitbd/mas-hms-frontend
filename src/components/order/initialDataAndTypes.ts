import { IDoctor, IPatient, ITest } from "@/types/allDepartmentInterfaces";
import React from "react";
import { Schema } from "rsuite";
const { StringType, NumberType } = Schema.Types;

export type ItestInformaiton = {
  discount: string;
  ramark: string;
  test: ITest;
  deliveryTime: Date;
  remark: string;
  SL: number;
};
export type InitialData = {
  oid?: string;
  totalPrice: number;
  parcentDiscount: number;
  cashDiscount: number;
  vat: number;
  paid: number;
  tests: ItestInformaiton[]; // Define the appropriate type for tests
  patientType: string;
  patient: IPatient;
  refBy?: string; // Make refBy optional
  deliveryTime: Date;
};

export type IInitialData = {
  oid?: string;
  totalPrice: number;
  parcentDiscount: number;
  cashDiscount: number;
  vat: number;
  paid: number;
  tests: ItestInformaiton[]; // Define the appropriate type for tests
  patientType: string;
  patient: IPatient;
  refBy?: string; // Make refBy optional
  deliveryTime: Date;
};

export type IOrderData = {
  _id?: string;
  uuid?: string;
  patient?: Partial<IPatient>;
  refBy?: string;
  status: string;
  deliveryTime: Date;
  tests: {
    SL: number;
    status: string;
    discount: number;
    test: string | undefined;
  }[];
  totalPrice: number;
  cashDiscount: number;
  parcentDiscount: number;
  dueAmount: number;
  patientType: string;
  paid: number;
  vat: number;
};

export const initialData: InitialData = {
  totalPrice: 0,
  parcentDiscount: 0,
  cashDiscount: 0,
  vat: 0,
  paid: 0,
  tests: [],
  patientType: "notRegistered",
  patient: {
    _id: "",
    name: "",
    uuid: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
    image: "",
  },
  deliveryTime: new Date(),
};

export type IpatientInforMationProps = {
  data: InitialData;
  mode: string;
  setFormData: (props: React.SetStateAction<Partial<IInitialData>>) => void;
  forwardedRefForUnregisterd: React.MutableRefObject<any>;
  forwardedRefForPatientType: React.MutableRefObject<any>;
};

export const patientType = [
  { label: "Registered", value: "registered" },
  { label: "Not Registered", value: "notRegistered" },
];
export type IRegisteredPatient = {
  patient: IPatient;
  doctors: IDoctor[];
  setFormData: (data: React.SetStateAction<Partial<IInitialData>>) => void;
  formData: any;
};

export const modelForRegisteredPatient = Schema.Model({
  name: StringType().isRequired("This field is required."),
  fatherName: StringType().isRequired("This field is required."),
  email: StringType()
    .isEmail("This field is Required for email")
    .isRequired("This field is required."),
  designation: StringType().isRequired("This field is required."),
  phone: NumberType()
    .isRequired("This field is required.")
    .addRule((value: string | number): boolean => {
      const phoneNumber = value.toString();
      if (phoneNumber.length <= 10 && phoneNumber.length >= 10) {
        return false;
      }
      return true;
    }, "Phone number must be 11 digits."),
});

export type IParamsForTestInformation = {
  formData: any;
  setFormData: (params: any) => void;
  mode: string;
};

export type IDewCollectionProps = {
  dewModalOpen: boolean;
  setDewModalOpen(data: boolean): void;
  data: IOrderData;
};

export type IPriceSectionProps = {
  totalPrice: number;
  data: any;
  discountAmount: number;
  vatAmount: number;
};

export const unreagisteredPatientProfileDataPropertyNames = [
  "name",
  "age",
  "gender",
  "address",
  "phone",
  "email",
];
