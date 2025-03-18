import { baseApi } from "./baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //  get all

    updateDuePayment: build.mutation({
      query: (options) => ({
        url: `/payments/${options.regno}`,
        method: "PATCH",
        contentType: "application/json",
        data: options.data,
        body: options.data,
      }),
      invalidatesTags: ["beds"],
    }),

    //
  }),
});

export const { useUpdateDuePaymentMutation } = paymentApi;
