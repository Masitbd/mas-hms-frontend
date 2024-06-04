import { baseApi } from "../baseApi";

const testReportSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postTestReport: build.mutation({
      query: (data) => ({
        url: "/testReport",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json"
      }),
      invalidatesTags: ["testReport"]
    }),
    patchTestReport: build.mutation({
      query: ({ data, id }) => ({
        url: `/testReport/${id}`,
        method: "patch",
        body: data,
        data: data,
        contentType: "application/json"
      }),
      invalidatesTags: ["testReport"]
    }),
    deleteTestReport: build.mutation({
      query: (id) => ({
        url: `/testReport/${id}`,
        method: "delete",
        contentType: "application/json"
      }),
      invalidatesTags: ["testReport"]
    }),
    getSingleTestReport: build.query({
      query: (id) => ({
        url: `/testReport/${id}`,
        method: "get",
        contentType: "application/json"
      }),
      providesTags: ["testReport"]
    }),
    getTestReports: build.query({
      query: (data?: any) => ({
        url: `/testReport`,
        params: data,
        method: "get",
        contentType: "application/json"
      }),
      providesTags: ["testReport"]
    })
  })
});

export const {
  usePostTestReportMutation,
  usePatchTestReportMutation,
  useGetSingleTestReportQuery,
  useGetTestReportsQuery,
  useDeleteTestReportMutation
} = testReportSlice;
