import { Schema } from "rsuite";
const { NumberType, StringType, DateType } = Schema.Types;
export type IPropsForNewUserModel = {
  open: boolean;
  setOpen: (prop: boolean) => void;
  mode: string;
  setMode: (prop: string) => void;
};

export type IInitilFormDataForNewUser = {
  name: string;
  fatherName: string;
  motherName: string;
  age: number;
  dateOfBirth: Date;
  gender: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  role: string;
};

export const initialFormDataForNewUser: IInitilFormDataForNewUser = {
  name: "",
  fatherName: "",
  motherName: "",
  age: 0,
  dateOfBirth: new Date(),
  gender: "",
  address: "",
  email: "",
  phone: "",
  password: "",
  role: "",
};

export const newUserFormModel = Schema.Model({
  name: StringType().isRequired("This field is required"),
  fatherName: StringType().isRequired("This field is required"),
  motherName: StringType().isRequired("This field is required"),
  age: NumberType().isRequired("This field is required"),
  dateOfBirth: DateType().isRequired("This field is required"),
  gender: StringType().isRequired("This field is required"),
  address: StringType().isRequired("This field is required"),
  email: StringType().isRequired("This field is required"),
  phone: StringType().isRequired("This field is required"),
  password: StringType().isRequired("This field is required"),
  role: StringType().isRequired("This field is required"),
});

export type INewUserData = {
  password: string;
  profile: Partial<IInitilFormDataForNewUser>;
};

export const profileDispalyableFields = [
  "uuid",
  "name",
  "age",
  "gender",
  "address",
  "email",
  "phone",
  "fatherName",
  "motherName",
  "dateOfBirth",
  "role",
];

export type IProfile = {
  name: string;
  fatherName: string;
  motherName: string;
  phone: string;
  email: string;
  address: string;
  uuid?: string;
};

export const patchProfileModel = Schema.Model({
  name: StringType().isRequired("This field is required"),
  fatherName: StringType().isRequired("This field is required"),
  motherName: StringType().isRequired("This field is required"),
  age: NumberType().isRequired("This field is required"),
  dateOfBirth: DateType().isRequired("This field is required"),
  gender: StringType().isRequired("This field is required"),
  address: StringType().isRequired("This field is required"),
  email: StringType().isRequired("This field is required"),
  phone: StringType().isRequired("This field is required"),
});

export type IUserData = {
  profile: IProfile;
  uuid: string;
  needsPasswordChange: boolean;
  _id: string;
  role: string;
};

export type IPatchProfileProps = {
  mode: string;
  setMode: (prop: string) => void;
  defaultValue: IProfile;
};
