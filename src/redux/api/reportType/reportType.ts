import { ISensitivity } from "@/types/allDepartmentInterfaces";
import { baseApi } from "../baseApi";
import { IReportGroupFormData } from "@/components/reportGroup/initialDataAndTypes";

const reportType = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postReportType: build.mutation({
      query: (data: IReportGroupFormData) => ({
        url: "/reportType",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["reportType"],
    }),
    patchReportType: build.mutation({
      query: ({ data, id }) => ({
        url: `/reportType/${id}`,
        method: "PATCH",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["reportType"],
    }),

    getReportType: build.query({
      query: (data: {
        department?: string;
        reportGroup?: string;
        reportTypeGroup?: string;
      }) => ({
        url: "/reportType",
        method: "GET",
        params: data,
        contentType: "application/json",
      }),
      providesTags: ["reportType"],
    }),
    getSingleReportType: build.query({
      query: (id: string) => ({
        url: `/reportType/${id}`,
        method: "GET",
        contentType: "application/json",
      }),
    }),
  }),
});

export const {
  usePostReportTypeMutation,
  usePatchReportTypeMutation,
  useGetReportTypeQuery,
  useGetSingleReportTypeQuery,
  useLazyGetReportTypeQuery,
} = reportType;
