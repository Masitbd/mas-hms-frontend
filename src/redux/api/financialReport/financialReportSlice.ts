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
    getDeptWiseCollectionSummery: build.query({
      query: (data: { from: Date; to: Date }) => ({
        url: `/financialReport/collectionStatement/deptWise`,
        method: "get",
        params: data,
        contentType: "application/json",
      }),
    }),
    getDeptWiseDoctorPerformance: build.query({
      query: (data: { from: Date; to: Date; refBy: string }) => ({
        url: `/financialReport/doctorsPerformance/deptWise/${data.refBy}`,
        method: "get",
        params: data,
        contentType: "application/json",
      }),
    }),
    getTestWiseDoctorPerformance: build.query({
      query: (data: { from: Date; to: Date; refBy: string }) => ({
        url: `/financialReport/doctorsPerformance/testWise/${data.refBy}`,
        method: "get",
        params: data,
        contentType: "application/json",
      }),
    }),
    getClientWiseIncomeStatement: build.query({
      query: (data) => ({
        url: `/financialReport/incomeStatement/clientWise`,
        method: "get",
        params: data,
        contentType: "application/json",
      }),
    }),
    //  get employee ledger
    getEmployeeLedger: build.query({
      query: (data) => ({
        url: `/financialReport/employeeLedger`,
        method: "get",
        params: data,
        contentType: "application/json",
      }),
    }),

    getRefByWiseIncomeStatement: build.query({
      query: (data) => ({
        url: `/financialReport/incomeStatement/refByWise`,
        method: "get",
        params: data,
        contentType: "application/json",
      }),
    }),
    getAllTests: build.query({
      query: () => ({
        url: `/financialReport/tests`,
        method: "get",

        contentType: "application/json",
      }),
    }),
    getAllDoctors: build.query({
      query: (data: { id: string }) => ({
        url: `/financialReport/doctors`,
        method: "get",
        params: data,

        contentType: "application/json",
      }),
    }),
    getEmployeePerformance: build.query({
      query: (params: { from: Date; to: Date; id?: string }) => ({
        url: `/financialReport/marketing-executive-performance`,
        method: "get",
        contentType: "application/json",
        params: params,
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
  useGetDeptWiseCollectionSummeryQuery,
  useGetDeptWiseDoctorPerformanceQuery,
  useGetTestWiseDoctorPerformanceQuery,
  useLazyGetTestWiseDoctorPerformanceQuery,
  useLazyGetDeptWiseDoctorPerformanceQuery,
  useGetClientWiseIncomeStatementQuery,
  useGetEmployeeLedgerQuery,
  useGetRefByWiseIncomeStatementQuery,
  useGetAllDoctorsQuery,
  useGetAllTestsQuery,
  useGetEmployeePerformanceQuery,
} = financialReport;
