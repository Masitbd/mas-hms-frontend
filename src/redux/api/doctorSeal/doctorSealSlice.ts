import { baseApi } from "../baseApi";

const DoctorSeal = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postSeal: build.mutation({
      query: (data: any) => ({
        url: "/seal",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["seal"],
    }),
    patchSeal: build.mutation({
      query: ({ data, id }) => ({
        url: `/seal/${id}`,
        method: "PATCH",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["seal"],
    }),
    deleteSeal: build.mutation({
      query: (data) => ({
        url: `/seal/${data}`,
        method: "delete",
        contentType: "application/json",
      }),
      invalidatesTags: ["seal"],
    }),
    getSeal: build.query({
      query: () => ({
        url: "/seal",
        method: "get",
        contentType: "application/json",
      }),
      providesTags: ["seal"],
    }),
    getSingleSeal: build.mutation({
      query: (data: any) => ({
        url: `/seal/${data}`,
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