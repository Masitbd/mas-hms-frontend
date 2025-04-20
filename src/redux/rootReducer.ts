import { baseApi } from "./api/baseApi";
import idSlice from "./features/IdStore/idSlice";
import authSlice from "./features/authentication/authSlice";
import conditionSlice from "./features/condition/conditionSlice";
import delpopuo from "./features/delpopup/delpopuo";
import docxTemSlice from "./features/discriptiveTem/docxTemSlice";
import loading from "./features/loading/loading";
import serviceReducer from "./features/services/serviceSlice";

export const reducer = {
  docxContent: docxTemSlice,
  id: idSlice,
  condition: conditionSlice,
  loading: loading,
  del: delpopuo,
  auth: authSlice,
  service: serviceReducer,
  [baseApi.reducerPath]: baseApi.reducer,
};
