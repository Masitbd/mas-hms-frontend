import { baseApi } from "../baseApi";

const account = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSingleAccount: build.query({
      query: (id: string) => ({
        url: `/account/${id}`,
        method: "GET",
        contentType: "application/json"
      }),
      providesTags: ["account"]
    })
  })
});

export const { useGetSingleAccountQuery } = account;
