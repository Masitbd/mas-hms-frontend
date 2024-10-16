import config from "@/config";
import { axiosBaseQuery } from "@/shared/axios/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
//import { tagTypes } from "../tagTypes";
//import { getFromLocalStorage } from "@/utils/local-storage";

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: axiosBaseQuery({
    baseUrl: config.api_url as string,
  }),

  endpoints: () => ({}),
  tagTypes: [
    "condition",
    "pdrv",
    "bacteria",
    "specimen",
    "vacuumTube",
    "department",
    "doctor",
    "hospitalGroup",
    "test",
    "permission",
    "users",
    "user",
    "profile",
    "testReport",
    "account",
    "transaction",
    "patient",
    "order",
    "reportGroup",
    "sensitivity",
    "group",
    "reportType",
    "reportTypeGroup",
    "reportTest",
    "seal",
    "miscellaneous",
    "refund",
    "singleOrder",
    "allCommission",
    "singleCompanyInfo",
    "companyInfo",
    "cloudinary-secret",
    "default-company-info",
    "employee",
    "singleEmployee",
    "report-margin",
    "order-posted-by",
  ],

  // tagTypes: tagTypes,
});
