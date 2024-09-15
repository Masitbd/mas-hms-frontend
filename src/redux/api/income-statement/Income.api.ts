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

    // get due details

    getDueDetails: build.query({
      query: (args) => ({
        url: "/order/due-details",
        method: "GET",
        params: args,
      }),
    }),
  }),
});

export const {
  useGetIncomeStatementMutation,
  useGetEmployeeIncomeStatementQuery,
  useGetEmployeeIncomeStatementSummeryQuery,
  useGetDueDetailsQuery,
} = incomeApi;
