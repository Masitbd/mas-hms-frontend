export const tabTitle = ["Condition", "Duration", "Temperature", "Bacteria"];

export type IMiscellaneous = {
  _id?: string;
  title: string;
  value: string;
};

export type ISensitivity = {
  id?: string;
  _id?: string;
  value: string;
  mic: string;
  breakPoint: string;
  interpretation?: string;
};

export const initialSensitiviry: ISensitivity = {
  value: "",
  mic: "",
  breakPoint: "",
};
export const initalData: IMiscellaneous = {
  title: "",
  value: "",
};
