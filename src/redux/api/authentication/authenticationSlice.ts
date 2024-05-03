import { baseApi } from "../baseApi";

const authenticaiton = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (data: any) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
        contentType: "application/json",
      }),
    }),

    getSingleBacteria: build.mutation({
      query: (data: any) => ({
        url: `/bacteria/${data}`,
        method: "get",
        contentType: "application/json",
      }),
    }),
  }),
});

export const { useLoginMutation } = authenticaiton;
