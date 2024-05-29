import { baseApi } from "./api/baseApi";
import idSlice from "./features/IdStore/idSlice";
import conditionSlice from "./features/condition/conditionSlice";
import delpopuo from "./features/delpopup/delpopuo";
import docxTemSlice from "./features/discriptiveTem/docxTemSlice";
import loading from "./features/loading/loading";

export const reducer = {
  docxContent: docxTemSlice,
  id: idSlice,
  condition: conditionSlice,
  loading: loading,
  del: delpopuo,
  [baseApi.reducerPath]: baseApi.reducer
};
