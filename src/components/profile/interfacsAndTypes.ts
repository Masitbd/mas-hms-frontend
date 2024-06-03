import { ENUM_MODE } from "@/enum/Mode";
import { IUserData } from "../users/interfacesAndInitalData";

export type IPatchProfileProps = {
  mode: string;
  setMode: (prop: ENUM_MODE) => void;
  userData: IUserData;
};

export type IChangePassword = {
  mode: string;
  setMode: (prop: ENUM_MODE) => void;
  userData: IUserData;
};

export type IChangePasswordFromdata = {
  oldPassword: string;
  newPassword: string;
};

export const ChangePasswordFromInitialData: IChangePasswordFromdata = {
  oldPassword: "",
  newPassword: "",
};
