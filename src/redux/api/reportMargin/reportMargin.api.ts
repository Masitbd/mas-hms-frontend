import { baseApi } from "../baseApi";

const reportMargin = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postReportMargin: build.mutation({
      query: (data: any) => ({
        url: "/report-margin",
        method: "POST",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["report-margin"],
    }),

    getReportMargin: build.query({
      query: () => ({
        url: "/report-margin",
        method: "GET",
        contentType: "application/json",
      }),
      providesTags: ["report-margin"],
    }),
  }),
});

export const {
  usePostReportMarginMutation,
  useLazyGetReportMarginQuery,
  useGetReportMarginQuery,
} = reportMargin;
