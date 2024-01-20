import { baseApi } from "./api/baseApi";
import conditionSlice from "./features/condition/conditionSlice";
import delpopuo from "./features/delpopup/delpopuo";
import loading from "./features/loading/loading";

export const reducer = {
  condition: conditionSlice,
  loading: loading,
  del: delpopuo,
  [baseApi.reducerPath]: baseApi.reducer,
};
