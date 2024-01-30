import { IDepartment } from "@/types/allDepartmentInterfaces";
import { baseApi } from "../baseApi";

const department = baseApi.injectEndpoints({
    endpoints: (build) => ({
      postDepartment: build.mutation({
        query: (data: IDepartment) => ({
          url: "/depertments",
          method: "POST",
          body: data,
          contentType: "application/json",
        }),
        invalidatesTags: ["department"],
      }),
      patchDepartment: build.mutation({
        query: ({ data, id }) => ({
          url: `/depertments/${id}`,
          method: "PATCH",
          body: data,
          contentType: "application/json",
        }),
        invalidatesTags: ["department"],
      }),
      deleteDepartment: build.mutation({
        query: (id: string) => ({
          url: `/depertments/${id}`,
          method: "DELETE",
          contentType: "application/json",
        }),
        invalidatesTags: ["department"],
      }),
      getDepartment: build.query({
        query: () => ({
          url: "/depertments",
          method: "GET",
          contentType: "application/json",
        }),
        providesTags: ["department"],
      }),
      getSingleDepartment: build.mutation({
        query: (id: string) => ({
          url: `/depertments/${id}`,
          method: "GET",
          contentType: "application/json",
        }),
      }),
    }),
  });

  export const {
    usePostDepartmentMutation,
    useGetDepartmentQuery,
    useDeleteDepartmentMutation,
    usePatchDepartmentMutation,
  } = department;