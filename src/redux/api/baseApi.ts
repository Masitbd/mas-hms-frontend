import { axiosBaseQuery } from "@/shared/axios/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
//import { tagTypes } from "../tagTypes";
//import { getFromLocalStorage } from "@/utils/local-storage";

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: axiosBaseQuery({
    baseUrl: "http://localhost:3001/api/v1",
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
  ],

  // tagTypes: tagTypes,
});
