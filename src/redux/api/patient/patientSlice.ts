import { baseApi } from "../baseApi";

const patient = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postPatient: build.mutation({
      query: (data: any) => ({
        url: "/patient",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["patient"],
    }),
    patchPatient: build.mutation({
      query: (data) => ({
        url: `/patient`,
        method: "PATCH",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["patient"],
    }),

    getPatient: build.query({
      query: (query: any) => ({
        url: "/patient",
        method: "get",
        contentType: "application/json",

        params: query,
      }),
      providesTags: ["patient"],
    }),
    getSinglePatient: build.query({
      query: (data: any) => ({
        url: `/patient/${data}`,
        method: "get",
        contentType: "application/json",
      }),
    }),
  }),
});

export const {
  usePostPatientMutation,
  useGetPatientQuery,
  useGetSinglePatientQuery,
  usePatchPatientMutation,
  useLazyGetSinglePatientQuery,
} = patient;
