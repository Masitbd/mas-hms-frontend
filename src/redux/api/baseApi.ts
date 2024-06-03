import { Middleware } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { axiosBaseQuery } from "@/shared/axios/axiosBaseQuery";
//import { tagTypes } from "../tagTypes";
//import { getFromLocalStorage } from "@/utils/local-storage";

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: axiosBaseQuery({ baseUrl: "http://localhost:7000/api/v1" }),

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
    "patient",
    "order",
    "permission",
    "users",
    "user",
    "profile",
  ],

  // tagTypes: tagTypes,
});
