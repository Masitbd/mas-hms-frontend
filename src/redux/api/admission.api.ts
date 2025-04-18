import { baseApi } from "./baseApi";

const admissionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //  get all

    getAllAdmission: build.query({
      query: (args) => ({
        url: "/admission",
        method: "GET",
        params: args,
      }),
      providesTags: ["beds"],
    }),
    getDetailsAdmission: build.query({
      query: (id) => ({
        url: `/admission/${id}`,
        method: "GET",
      }),
      providesTags: ["admission"],
    }),
    createAdmission: build.mutation({
      query: (data) => ({
        url: "/admission",
        method: "POST",
        contentType: "application/json",
        data: data,
        body: data,
      }),
      invalidatesTags: ["admission"],
    }),
    updateAdmission: build.mutation({
      query: (options) => ({
        url: `/admission/${options.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: options.data,
        body: options.data,
      }),
      invalidatesTags: ["admission"],
    }),
    //
    transferAdmission: build.mutation({
      query: (data) => ({
        url: "/admission/transfer",
        method: "PATCH",
        contentType: "application/json",
        data: data,
        body: data,
      }),
      invalidatesTags: ["admission", "beds"],
    }),

    deleteAdmission: build.mutation({
      query: (id) => ({
        url: `/admission/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["beds"],
    }),

    // ? release

    releaseAdmittedPatient: build.mutation({
      query: (option) => ({
        url: "/admission/release",
        method: "POST",
        body: option,
        data: option,
      }),
      invalidatesTags: ["admission", "beds"],
    }),

    //
  }),
});

export const {
  useGetAllAdmissionQuery,
  useCreateAdmissionMutation,
  useGetDetailsAdmissionQuery,
  useTransferAdmissionMutation,
  useUpdateAdmissionMutation,
  useDeleteAdmissionMutation,
  useReleaseAdmittedPatientMutation,
} = admissionApi;
