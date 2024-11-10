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
    changeUserPasswordByAdmin: build.mutation({
      query: (data: { id: string; password: string }) => ({
        url: "/auth/change-password-by-admin",
        method: "POST",
        body: data,
        data: data,
        contentType: "application/json",
      }),
    }),
    resetPassword: build.mutation({
      query: (data: { newPassword: string; token: string }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
        data: data,
        contentType: "application/json",
      }),
    }),
    forgetPassword: build.mutation({
      query: (data: { uuid: string }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
        data: data,
        contentType: "application/json",
      }),
    }),
    rusticateUser: build.mutation({
      query: (data: { id: string }) => ({
        url: "/auth/rusticate-user",
        method: "POST",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["users"],
    }),
    activateUser: build.mutation({
      query: (data: { id: string }) => ({
        url: "/auth/activate-user",
        method: "POST",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useLoginMutation,
  useChangePasswordMutation,
  useChangeUserPasswordByAdminMutation,
  useResetPasswordMutation,
  useForgetPasswordMutation,
  useRusticateUserMutation,
  useActivateUserMutation,
} = authenticaiton;
