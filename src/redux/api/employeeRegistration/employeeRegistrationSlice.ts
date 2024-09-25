import { IEmployeeRegistration } from "@/app/(withlayout)/employeeRegistration/page";
import { baseApi } from "../baseApi";

const employeeRegistration = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postEmployeeRegistration: build.mutation({
      query: (data: IEmployeeRegistration) => ({
        url: "/employeeRegistration/create-employee",
        method: "POST",
        body: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["employeeRegistration"],
    }),
    patchemployeeRegistration: build.mutation({
      query: ({ data, id }) => ({
        url: `/employeeRegistration/${id}`,
        method: "PATCH",
        body: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["employeeRegistration"],
    }),
    deleteemployeeRegistration: build.mutation({
      query: (id: string) => ({
        url: `/employeeRegistration/${id}`,
        method: "DELETE",
        contentType: "application/json",
      }),
      invalidatesTags: ["employeeRegistration"],
    }),
    getemployeeRegistration: build.query({
      query: (data?: any) => ({
        url: "/employeeRegistration",
        method: "GET",
        contentType: "application/json",
      }),
      providesTags: ["employeeRegistration"],
    }),
    getSingleemployeeRegistration: build.mutation({
      query: (id: string) => ({
        url: `/employeeRegistration/${id}`,
        method: "GET",
        contentType: "application/json",
      }),
    }),
  }),
});

export const {
  useGetSingleemployeeRegistrationMutation,
  useGetemployeeRegistrationQuery,
  useDeleteemployeeRegistrationMutation,
  usePatchemployeeRegistrationMutation,
  usePostEmployeeRegistrationMutation,
} = employeeRegistration;
