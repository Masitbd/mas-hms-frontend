import { baseApi } from "../baseApi";

const authenticaiton = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (data: any) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
        data: data,
        contentType: "application/json",
      }),
    }),
    changePassword: build.mutation({
      query: (data: any) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
        data: data,
        contentType: "application/json",
      }),
    }),
  }),
});

export const { useLoginMutation, useChangePasswordMutation } = authenticaiton;
