import { IReportGroup } from "@/types/allDepartmentInterfaces";
import { baseApi } from "../baseApi";

const reportGroup = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postReportGroup: build.mutation({
      query: (data: IReportGroup) => ({
        url: "/reportGroup",
        method: "post",
        body: data,
        contentType: "application/json"
      }),
      invalidatesTags: ["reportGroup"]
    }),
    patchReportGroup: build.mutation({
      query: ({ data, id }) => ({
        url: `/reportGroup/${id}`,
        method: "PATCH",
        body: data,
        contentType: "application/json"
      }),
      invalidatesTags: ["reportGroup"]
    }),
    deleteReportGroup: build.mutation({
      query: (id: string) => ({
        url: `/reportGroup/${id}`,
        method: "DELETE",
        contentType: "application/json"
      }),
      invalidatesTags: ["reportGroup"]
    }),
    getReportGroup: build.query({
      query: () => ({
        url: "/reportGroup",
        method: "GET",
        contentType: "application/json"
      }),
      providesTags: ["reportGroup"]
    }),
    getSingleSpecimen: build.mutation({
      query: (id: string) => ({
        url: `/reportGroup/${id}`,
        method: "GET",
        contentType: "application/json"
      })
    })
  })
});

export const {
  usePostReportGroupMutation,
  useGetReportGroupQuery,
  useDeleteReportGroupMutation,
  usePatchReportGroupMutation
} = reportGroup;
