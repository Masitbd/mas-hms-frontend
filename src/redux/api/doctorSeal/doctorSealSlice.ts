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
      invalidatesTags: ["doctor-seal"],
    }),
    patchSeal: build.mutation({
      query: ({ data, id }) => ({
        url: `/seal/${id}`,
        method: "PATCH",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["doctor-seal"],
    }),
    deleteSeal: build.mutation({
      query: (data) => ({
        url: `/seal/${data}`,
        method: "delete",
        contentType: "application/json",
      }),
      invalidatesTags: ["doctor-seal"],
    }),

    getSingleSeal: build.mutation({
      query: (data: any) => ({
        url: `/seal/${data}`,
        method: "get",
        contentType: "application/json",
      }),
    }),
    getSeal: build.query({
      query: (props?: { default?: boolean }) => ({
        url: "/seal",
        method: "get",
        contentType: "application/json",
        params: props,
      }),
      providesTags: ["doctor-seal"],
    }),
  }),
});

export const {
  useGetSealQuery,
  useLazyGetSealQuery,
  useDeleteSealMutation,
  usePatchSealMutation,
  usePostSealMutation,
  useGetSingleSealMutation,
} = DoctorSeal;
