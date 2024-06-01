export type NewFormType<T> = {
  open: boolean;
  setPostModelOpen: (postModelOpen: boolean) => void;
  defaultData: T;
  setMode: (mode: string) => void;
  mode: string;
};

export type TableType<T> = {
  setPostModelOpen: (postModelOpen: boolean) => void;
  open: boolean;
  setPatchData: (patchData: T) => void;
  setMode: (mode: string) => void;
};
