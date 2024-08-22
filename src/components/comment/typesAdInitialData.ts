import { SyntheticEvent } from "react";
import { ITemplate } from "../reportTemplate/typesandInitialData";

export type IComment = {
  _id?: string;
  title: string;
  comment: string;
};
export type IDoctorSeal = {
  _id?: string;
  title: string;
  seal: string;
};
export type IPropsForNewAndUpdate<T> = {
  data: T;
  setData: (
    formValue: any,
    event?: SyntheticEvent<Element, Event> | undefined
  ) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: string;
  setMode: (mode: string) => void;
};

export const InitalCommentData: IComment = {
  title: "",
  comment: ""
};
export const InitialDoctorSealData: IDoctorSeal = {
  title: "",
  seal: ""
};

export type IPropsForTable<T> = {
  setModalOpen: (modalOpen: boolean) => void;
  setData: (data: T) => void;
  setMode: (mode: string) => void;
};
