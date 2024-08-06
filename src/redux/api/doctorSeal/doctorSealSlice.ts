import { baseApi } from "../baseApi";

const DoctorSeal = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postSeal: build.mutation({
      query: (data: any) => ({
        url: "/doctorSeal",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["doctorSeal"],
    }),
    patchSeal: build.mutation({
      query: ({ data, id }) => ({
        url: `/doctorSeal/${id}`,
        method: "PATCH",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["doctorSeal"],
    }),
    deleteSeal: build.mutation({
      query: (data) => ({
        url: `/doctorSeal/${data}`,
        method: "delete",
        contentType: "application/json",
      }),
      invalidatesTags: ["doctorSeal"],
    }),
    getSeal: build.query({
      query: () => ({
        url: "/doctorSeal",
        method: "get",
        contentType: "application/json",
      }),
      providesTags: ["doctorSeal"],
    }),
    getSingleSeal: build.mutation({
      query: (data: any) => ({
        url: `/doctorSeal/${data}`,
        method: "get",
        contentType: "application/json",
      }),
    }),
  }),
});

export const {
  useGetSealQuery,
  useDeleteSealMutation,
  usePatchSealMutation,
  usePostSealMutation,
  useGetSingleSealMutation,
} = DoctorSeal;