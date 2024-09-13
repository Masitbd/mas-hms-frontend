import { baseApi } from "../baseApi";

const financialReport = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOverAllComission: build.query({
      query: (params) => ({
        url: "/financialReport/commission/all",
        method: "get",
        params,
        contentType: "application/json",
      }),
      providesTags: ["allCommission"],
    }),
    getSingleDoctorPerformance: build.query({
      query: (data: { from: Date; to: Date; refBy: string }) => ({
        url: `/financialReport/commission/single/${data.refBy}`,
        method: "get",
        params: data,
        contentType: "application/json",
      }),
    }),
    getTestWiseIncomeStatement: build.query({
      query: (data: { from: Date; to: Date }) => ({
        url: `/financialReport/incomeStatement/testWise`,
        method: "get",
        params: data,
        contentType: "application/json",
      }),
    }),
    getDeptWiseIncomeStatement: build.query({
      query: (data: { from: Date; to: Date }) => ({
        url: `/financialReport/incomeStatement/deptWise`,
        method: "get",
        params: data,
        contentType: "application/json",
      }),
    }),
  }),
});

export const {
  useLazyGetOverAllComissionQuery,
  useGetOverAllComissionQuery,
  useLazyGetSingleDoctorPerformanceQuery,
  useGetTestWiseIncomeStatementQuery,
  useGetDeptWiseIncomeStatementQuery,
} = financialReport;
