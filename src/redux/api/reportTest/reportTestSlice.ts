import { IReportGroup } from "@/types/allDepartmentInterfaces";
import { baseApi } from "../baseApi";
import {
  ITEstREsultForMicroBio,
  ITestResultForParameter,
} from "@/components/generateReport/initialDataAndTypes";

const reportTest = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postReport: build.mutation({
      query: (data: ITestResultForParameter | ITEstREsultForMicroBio) => ({
        url: "/report/test",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["singleOrder", "order"],
    }),
    patchRepor: build.mutation({
      query: (data) => ({
        url: `/report/test`,
        method: "PATCH",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["order", "singleOrder"],
    }),

    getReport: build.query({
      query: () => ({
        url: "/report/test",
        method: "GET",
        contentType: "application/json",
      }),
      providesTags: ["reportTest"],
    }),
    getSingleReport: build.query({
      query: (props: {
        oid: string;
        params: { reportGroup: string; resultType: string };
      }) => ({
        url: `/report/test/${props.oid}`,
        method: "GET",
        contentType: "application/json",
        params: props.params,
      }),
      providesTags: ["reportTest"],
    }),
  }),
});

export const {
  useGetReportQuery,
  useGetSingleReportQuery,
  usePatchReporMutation,
  usePostReportMutation,
  useLazyGetSingleReportQuery,
} = reportTest;
