import { ITransaction } from "@/types/allDepartmentInterfaces";
import { baseApi } from "../baseApi";

const transaction = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postTransaction: build.mutation({
      query: (data: ITransaction) => ({
        url: "/transaction",
        method: "post",
        body: data,
        contentType: "application/json"
      }),
      invalidatesTags: ["transaction"]
    }),
    getSingleTransaction: build.mutation({
      query: (id: string) => ({
        url: `/transaction/${id}`,
        method: "get",
        contentType: "application/json"
      })
    }),
    getSingleByUuidTransaction: build.query({
      query: (uuid: string) => ({
        url: `/transaction/uuid/${uuid}`,
        method: "get",
        contentType: "application/json"
      })
    })
  })
});

export const {
  usePostTransactionMutation,
  useGetSingleByUuidTransactionQuery,
  useGetSingleTransactionMutation
} = transaction;
