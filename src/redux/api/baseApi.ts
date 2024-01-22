import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
//import { tagTypes } from "../tagTypes";
//import { getFromLocalStorage } from "@/utils/local-storage";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    //baseUrl: "https://city-clean-aps.vercel.app/api/v1",
    baseUrl: "http://localhost:5000/api/v1",
    // prepareHeaders: (headers, { getState }) => {
    //   /*  const accessToken = getFromLocalStorage("accessToken");
    //   if (accessToken) {
    //     headers.set("Authorization", accessToken);
    //   }
    //   return headers; */
    // },
  }),
  endpoints: () => ({}),
  tagTypes: ["condition", "pdrv", "bacteria"],

  // tagTypes: tagTypes,
});
