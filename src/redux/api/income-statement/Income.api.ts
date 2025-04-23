import { baseApi } from "../baseApi";

const incomeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get income

    getIncomeStatement: build.mutation({
      query: (data) => ({
        url: "/order/income-statement",
        method: "POST",
        body: data,
        data: data,
        contentType: "application/json",
      }),
    }),

    //  get employee income

    getEmployeeIncomeStatement: build.query({
      query: (args) => ({
        url: "/income-statemnet",
        method: "GET",
        params: args,
      }),
    }),

    // get employee summery

    getEmployeeIncomeStatementSummery: build.query({
      query: (args) => ({
        url: "/income-statemnet/summery",
        method: "GET",
        params: args,
      }),
    }),
    //?gett last income 28
    getLastTEDaysIncome: build.query({
      query: () => ({
        url: "/income-statemnet/last-paid",
        method: "GET",
      }),
    }),

    // get due details

    getDueDetails: build.query({
      query: (args) => ({
        url: "/order/due-details",
        method: "GET",
        params: args,
      }),
    }),

    // ! Indoor statement

    getIndoorIncomeLedger: build.query({
      query: (args) => ({
        url: "/indoor-finance",
        method: "GET",
        params: args,
      }),
    }),
    getIndoorDueLedger: build.query({
      query: (args) => ({
        url: "/indoor-finance/due-collection",
        method: "GET",
        params: args,
      }),
    }),
    getIndoorDuecollectionLedger: build.query({
      query: (args) => ({
        url: "/indoor-finance/due-collection-statement",
        method: "GET",
        params: args,
      }),
    }),
    getIndoorEmpDetailsLedger: build.query({
      query: (args) => ({
        url: "/indoor-finance/daily-collection-details",
        method: "GET",
        params: args,
      }),
    }),
    getIndoorPateintHospitalBillsummery: build.query({
      query: (id) => ({
        url: `/indoor-finance/hospital-bill-summery/${id}`,
        method: "GET",
      }),
    }),
    getIndoorPateintHospitalBillDetails: build.query({
      query: (id) => ({
        url: `/indoor-finance/hospital-bill-details/${id}`,
        method: "GET",
      }),
    }),
    getIndoorPateintDoctors: build.query({
      query: (id) => ({
        url: `/indoor-finance/doctor-bills/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetIncomeStatementMutation,
  useGetEmployeeIncomeStatementQuery,
  useGetEmployeeIncomeStatementSummeryQuery,
  useGetDueDetailsQuery,
  useGetLastTEDaysIncomeQuery,
  useGetIndoorIncomeLedgerQuery,
  useGetIndoorDueLedgerQuery,
  useGetIndoorEmpDetailsLedgerQuery,
  useGetIndoorDuecollectionLedgerQuery,
  useGetIndoorPateintHospitalBillsummeryQuery,
  useGetIndoorPateintHospitalBillDetailsQuery,
  useGetIndoorPateintDoctorsQuery,
} = incomeApi;
