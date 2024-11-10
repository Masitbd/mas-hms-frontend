import { baseApi } from "../baseApi";

const testReportSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postTestReport: build.mutation({
      query: (data) => ({
        url: "/testReport",
        method: "POST",
        contentType: "application/json",
        body: data
      }),
      invalidatesTags: ["testReport"]
    }),
    patchTestReport: build.mutation({
      query: ({ data, id }) => ({
        url: `/testReport/${id}`,
        method: "PATCH",
        contentType: "application/json",
        body: data
      }),
      invalidatesTags: ["testReport"]
    }),
    deleteTestReport: build.mutation({
      query: (id) => ({
        url: `/testReport/${id}`,
        method: "DELETE",
        contentType: "application/json"
      }),
      invalidatesTags: ["testReport"]
    }),
    getSingleTestReport: build.query({
      query: (id) => ({
        url: `/testReport/${id}`,
        method: "GET",
        contentType: "application/json"
      })
    }),
    getTestReports: build.query({
      query: (data?: any) => ({
        url: `/testReport`,
        params: data,
        method: "GET",
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
