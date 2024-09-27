import { baseApi } from "../baseApi";

const employee = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postEmployee: build.mutation({
      query: (data: any) => ({
        url: "/employeeRegistration/create-employee",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["employee", "singleEmployee"],
    }),
    patchEmployee: build.mutation({
      query: ({ data, id }) => ({
        url: `/employeeRegistration/${id}`,
        method: "PATCH",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["employee", "singleEmployee"],
    }),
    deleteEmployee: build.mutation({
      query: (data) => ({
        url: `/employeeRegistration/${data}`,
        method: "delete",
        contentType: "application/json",
      }),
      invalidatesTags: ["employee", "singleEmployee"],
    }),
    getEmployee: build.query({
      query: (query) => ({
        url: "/employeeRegistration",
        method: "get",
        contentType: "application/json",
        params: query,
      }),
      providesTags: ["employee"],
    }),
    getSingleEmployee: build.query({
      query: (data: any) => ({
        url: `/employeeRegistration/${data}`,
        method: "get",
        contentType: "application/json",
      }),
      providesTags: ["singleEmployee"],
    }),
  }),
});

export const {
  useGetEmployeeQuery,
  useDeleteEmployeeMutation,
  usePostEmployeeMutation,
  useGetSingleEmployeeQuery,
  usePatchEmployeeMutation,
} = employee;
