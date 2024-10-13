import { Schema } from "rsuite";

const { StringType, NumberType, ArrayType } = Schema.Types;
export const genderType = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "other" },
];
export const matarialType = [
  { label: "Married", value: "married" },
  { label: "Unmarried", value: "unmarried" },
];
export const religionType = [
  { label: "Islam", value: "islam" },
  { label: "Christan", value: "christan" },
  { label: "Hindus", value: "hindus" },
  { label: "Buddis", value: "buddis" },
  { label: "Jews", value: "jews" },
  { label: "Atheist", value: "atheist" },
];
export const bloodType = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

export const initialPatientData = {
  name: "",
  fatherName: "",
  motherName: "",
  age: "",
  gender: "",
  presentAddress: "",
  permanentAddress: "",
  maritalStatus: "",
  dateOfBirth: new Date(),
  district: "",
  religion: "",
  nationality: "",
  admissionDate: new Date(),
  bloodGroup: "",
  passportNo: "",
  courseDuration: "",
  typeOfDisease: "",
  nationalID: "",
  totalAmount: "",
  ref_by: "",
  consultant: "",
  phone: "",
  email: "",
  image: "",
  publicId: "",
};

export type IPatient1 = {
  name: string;
  fatherName: string;
  motherName?: string;
  age: string;
  gender: string;
  presentAddress: string;
  permanentAddress?: string;
  maritalStatus?: string;
  dateOfBirth?: {};
  district?: string;
  religion?: string;
  nationality?: string;
  admissionDate?: {};
  bloodGroup?: string;
  passportNo?: string;
  courseDuration?: string;
  typeOfDisease?: string;
  nationalID?: string;
  totalAmount?: string;
  ref_by?: string;
  consultant?: string;
  phone: string;
  email?: string;
  image?: string;
  publicId: string;
};

export const model = Schema.Model({
  name: StringType().isRequired("This field is required."),
  age: StringType().isRequired("This field is required."),
  gender: StringType().isRequired("This field is required."),
  presentAddress: StringType().isRequired("This field is required."),
  phone: StringType().isRequired("This field is required."),
  email: StringType().isRequired("This field is required."),
});
