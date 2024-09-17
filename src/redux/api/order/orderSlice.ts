import { IOrderData } from "@/components/order/initialDataAndTypes";
import { baseApi } from "../baseApi";

const order = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postOrder: build.mutation({
      query: (data: any) => ({
        url: "/order",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["order", "singleOrder"],
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
    getSingleOrder: build.query({
      query: (data: string) => ({
        url: `/order/${data}`,
        method: "GET",

        contentType: "application/json",
      }),
      providesTags: ["singleOrder"],
    }),
    patchOrder: build.mutation({
      query: (data: { id: string; data: Partial<IOrderData> }) => ({
        url: `/order/${data.id}`,
        method: "PATCH",
        body: data.data,
        data: data.data,
        contentType: "application/json",
      }),
      invalidatesTags: ["order", "singleOrder"],
    }),
    getInvoice: build.query({
      query: (data) => ({
        url: `/order/invoice/${data}`,
        method: "GET",

        contentType: "application/json",
      }),
      providesTags: ["order"],
    }),

    dewColletcion: build.mutation({
      query: (data: { amount: number; oid: string }) => ({
        url: `/order/dewCollection/${data.oid}`,
        method: "PATCH",
        body: data,
        data: { amount: data.amount },
        contentType: "application/json",
      }),
      invalidatesTags: ["order", "singleOrder"],
    }),
    singleStatusChanger: build.mutation({
      query: (data: { oid: string; status: string; reportGroup: string }) => ({
        url: `/order/statusChange/${data.oid}`,
        method: "POST",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["order", "singleOrder"],
    }),
  }),
});

export const {
  useGetSingleOrderQuery,
  useLazyGetSingleOrderQuery,
  usePostOrderMutation,
  useGetOrderQuery,
  usePatchOrderMutation,
  useLazyGetInvoiceQuery,
  useLazyGetOrderQuery,
  useDewColletcionMutation,
  useSingleStatusChangerMutation,
} = order;
