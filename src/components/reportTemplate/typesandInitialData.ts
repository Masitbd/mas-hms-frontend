import { SyntheticEvent } from "react";

export type ITemplate = {
  _id?: string;
  title: string;
  template: string;
};
export type IPropsForNewAndUpdate = {
  data: ITemplate;
  setData: (
    formValue: any,
    event?: SyntheticEvent<Element, Event> | undefined
  ) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: string;
  setMode: (mode: string) => void;
};

export const InitalTemplateData: ITemplate = {
  title: "",
  template: "",
};

export type IPropsForTemplateTable = {
  setModalOpen: (modalOpen: boolean) => void;
  setData: (data: ITemplate) => void;
  setMode: (mode: string) => void;
};
