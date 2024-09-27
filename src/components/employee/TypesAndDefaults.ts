import { Dispatch } from "@reduxjs/toolkit";
import React, { SetStateAction } from "react";
import { Schema } from "rsuite";

export type IEmployeeRegistration = {
  _id?: string;
  name: string;
  fatherName: string;
  motherName: string;
  gender: string;
  dateOfBirth: Date;
  age: number;
  religion: string;
  nationality: string;
  maritalStatus: string;
  presentAddress: string;
  parmanentAddress: string;
  district: string;
  phoneNo: string;
  email: string;
  image?: string;
  defaultImage?: string;
};

export const defaultEmployeeRegistration: IEmployeeRegistration = {
  name: "",
  fatherName: "",
  motherName: "",
  gender: "",
  dateOfBirth: new Date(),
  age: 0,
  religion: "",
  nationality: "",
  maritalStatus: "",
  presentAddress: "",
  parmanentAddress: "",
  district: "",
  phoneNo: "",
  email: "",
};

export type IPropsForEmployeeRegistration = {
  data: IEmployeeRegistration;
  setData: React.Dispatch<SetStateAction<IEmployeeRegistration>>;
  setModalOpen: React.Dispatch<SetStateAction<boolean>>;
  setMode: React.Dispatch<SetStateAction<string>>;
  mode: string;
  modalOpen: boolean;
};

export const genderConstant = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Not Specified", value: "notSpecified" },
];

export const maritalStatus = [
  { label: "Married", value: "married" },
  { label: "Unmarried", value: "unmarried" },
];

export const model = Schema.Model({
  name: Schema.Types.StringType().isRequired("Name is required"),
  fatherName: Schema.Types.StringType().isRequired("Father's Name is required"),
  motherName: Schema.Types.StringType().isRequired("Mother's Name is required"),
  gender: Schema.Types.StringType().isRequired("Gender is required"),
  dateOfBirth: Schema.Types.DateType().isRequired("Date of Birth is required"),

  religion: Schema.Types.StringType().isRequired("Religion is required"),
  nationality: Schema.Types.StringType().isRequired("Nationality is required"),
  maritalStatus: Schema.Types.StringType().isRequired(
    "Marital Status is required"
  ),
  presentAddress: Schema.Types.StringType().isRequired(
    "Present Address is required"
  ),
  parmanentAddress: Schema.Types.StringType().isRequired(
    "Parmanent Address is required"
  ),
  district: Schema.Types.StringType().isRequired("District is required"),
  email: Schema.Types.StringType().isRequired("Email is required"),
  phoneNo: Schema.Types.NumberType().isRequired("Phone Number is required"),
});
