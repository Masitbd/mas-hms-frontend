import { IOrderData } from "@/app/(withlayout)/order/page";
import { baseApi } from "../baseApi";

const order = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postOrder: build.mutation({
      query: (data: any) => ({
        url: "/order",
        method: "post",
        body: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["order"],
    }),

    getOrder: build.query({
      query: (data) => ({
        url: "/order",
        method: "GET",
        params: data,

        contentType: "application/json",
      }),
      providesTags: ["order"],
    }),
    patchOrder: build.mutation({
      query: (data: { id: string; data: Partial<IOrderData> }) => ({
        url: `/order/${data.id}`,
        method: "PATCH",
        body: data.data,
        contentType: "application/json",
      }),
      invalidatesTags: ["order"],
    }),
    getInvoice: build.query({
      query: (data) => ({
        url: `/order/invoice/${data}`,
        method: "GET",

        contentType: "application/json",
      }),
      providesTags: ["order"],
    }),
  }),
});

export const {
  usePostOrderMutation,
  useGetOrderQuery,
  usePatchOrderMutation,
  useLazyGetInvoiceQuery,
} = order;
