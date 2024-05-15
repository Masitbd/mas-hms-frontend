import { baseApi } from "./api/baseApi";
import idSlice from "./features/IdStore/idSlice";
import conditionSlice from "./features/condition/conditionSlice";
import delpopuo from "./features/delpopup/delpopuo";
import loading from "./features/loading/loading";

export const reducer = {
  id: idSlice,
  condition: conditionSlice,
  loading: loading,
  del: delpopuo,
  [baseApi.reducerPath]: baseApi.reducer
};
