import { IDepartment } from "@/types/allDepartmentInterfaces";
import { baseApi } from "../baseApi";

const department = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postDepartment: build.mutation({
      query: (data: IDepartment) => ({
        url: "/departments",
        method: "POST",
        body: data,
        contentType: "application/json"
      }),
      invalidatesTags: ["department"]
    }),
    patchDepartment: build.mutation({
      query: ({ data, id }) => ({
        url: `/departments/${id}`,
        method: "PATCH",
        body: data,
        contentType: "application/json"
      }),
      invalidatesTags: ["department"]
    }),
    deleteDepartment: build.mutation({
      query: (id: string) => ({
        url: `/departments/${id}`,
        method: "DELETE",
        contentType: "application/json"
      }),
      invalidatesTags: ["department"]
    }),
    getDepartment: build.query({
      query: () => ({
        url: "/departments",
        method: "GET",
        contentType: "application/json"
      }),
      providesTags: ["department"]
    }),
    getSingleDepartment: build.mutation({
      query: (id: string) => ({
        url: `/department/${id}`,
        method: "GET",
        contentType: "application/json"
      })
    })
  })
});

export const {
  usePostDepartmentMutation,
  useGetDepartmentQuery,
  useDeleteDepartmentMutation,
  usePatchDepartmentMutation
} = department;
