import {
  IDoctor,
  IPatient,
  ITest,
  IVacuumTube,
} from "@/types/allDepartmentInterfaces";
import React, { SetStateAction } from "react";
import { Schema } from "rsuite";
import { ITestsFromOrder } from "../generateReport/initialDataAndTypes";
const { StringType, NumberType } = Schema.Types;
export type IRefund = {
  id: number;
  oid: string;
  grossAmount: number;
  discount: number;
  vat: number;
  netAmount: number;
  refundApplied: number;
  remainingRefund?: number;
  refundedBy: string;
};

export type ItestInformaiton = {
  discount: string;
  ramark: string;
  test: ITest;
  deliveryTime: Date;
  remark: string;
  SL: number;
  status?: string;
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
  dueAmount?: number;
  consultant?: string;
  discountedBy: string;
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
  createdAt?: string | number | Date;
  oid?: string;
  _id?: string;
  uuid?: string;
  patient?: Partial<IPatient>;
  refBy?: string | IDoctor;
  status: string;
  deliveryTime: Date;
  tests: {
    SL: number;
    status: string;
    discount: number;
    test: string | undefined | ITest;
    remark?: string;
  }[];
  totalPrice: number;
  cashDiscount: number;
  parcentDiscount: number;
  dueAmount: number;
  patientType: string;
  paid: number;
  vat: number;
  consultant?: string | IDoctor;
  discountedBy: string;
  postedBy?: string;
  refundData?: Partial<IRefund>;
};

export const initialData: InitialData = {
  totalPrice: 0,
  parcentDiscount: 0,
  cashDiscount: 0,
  vat: 0,
  paid: 0,
  tests: [],
  discountedBy: "system",
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
  setRModalOpen?: React.Dispatch<SetStateAction<boolean>>;
  setRTest?: React.Dispatch<SetStateAction<ITestsFromOrder | undefined>>;
};

export type IDewCollectionProps = {
  dewModalOpen: boolean;
  setDewModalOpen(data: boolean): void;
  data: IOrderData;
  setFormData: (props: IOrderData) => void;
};

export type IPriceSectionProps = {
  totalPrice: number;
  data: any;
  discountAmount: number;
  vatAmount: number;
  tubePrice: number;
  order: IOrderData;
};

export const unreagisteredPatientProfileDataPropertyNames = [
  "name",
  "age",
  "gender",
  "address",
  "phone",
  "email",
];
