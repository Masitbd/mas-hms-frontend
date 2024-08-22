import { baseApi } from "../baseApi";

const refund = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postRefund: build.mutation({
      query: (data: any) => ({
        url: "/refund",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["refund", "order", "singleOrder"],
    }),

    getRefund: build.query({
      query: () => ({
        url: "/refund",
        method: "get",
        contentType: "application/json",
      }),
      providesTags: ["refund"],
    }),
    getSingle: build.mutation({
      query: (data: any) => ({
        url: `/refund/${data}`,
        method: "get",
        contentType: "application/json",
      }),
    }),
  }),
});

export const { usePostRefundMutation, useGetRefundQuery } = refund;
