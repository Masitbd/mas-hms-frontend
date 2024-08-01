import { SyntheticEvent } from "react";

export type IComment = {
  _id?: string;
  title: string;
  comment: string;
};
export type IPropsForNewAndUpdate = {
  data: IComment;
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
  comment: "",
};

export type IPropsForCommentTable = {
  setModalOpen: (modalOpen: boolean) => void;
  setData: (data: IComment) => void;
  setMode: (mode: string) => void;
};
