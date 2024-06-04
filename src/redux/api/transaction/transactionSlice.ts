import { ITransaction } from "@/types/allDepartmentInterfaces";
import { baseApi } from "../baseApi";

const transaction = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postTransaction: build.mutation({
      query: (data: ITransaction) => ({
        url: "/transaction/",
        method: "POST",
        body: data,
        contentType: "application/json"
      }),
      // refetchQueries: ['getSingleTransaction'],
      invalidatesTags: ["transaction", "account"]
    }),
    getSingleTransaction: build.mutation({
      query: (id: string) => ({
        url: `/transaction/${id}`,
        method: "GET",
        contentType: "application/json"
      })
    }),
    getSingleByUuidTransaction: build.query({
      query: (uuid: string) => ({
        url: `/transaction/uuid/${uuid}`,
        method: "GET",
        contentType: "application/json"
      }),
      providesTags: ["transaction", "account"]
    })
  })
});

export const {
  usePostTransactionMutation,
  useGetSingleByUuidTransactionQuery,
  useGetSingleTransactionMutation
} = transaction;
