import { baseApi } from "../baseApi";

const pdrv = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postPdrv: build.mutation({
      query: (data: any) => ({
        url: "/pdrv",
        method: "post",
        body: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["pdrv"],
    }),
    patchPdrv: build.mutation({
      query: ({ data, id }) => ({
        url: `/pdrv/${id}`,
        method: "PATCH",
        body: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["pdrv"],
    }),
    deletePdrv: build.mutation({
      query: (data) => ({
        url: `/pdrv/${data}`,
        method: "delete",
        contentType: "application/json",
      }),
      invalidatesTags: ["pdrv"],
    }),
    getPdrv: build.query({
      query: () => ({
        url: "/pdrv",
        method: "get",
        contentType: "application/json",
      }),
      providesTags: ["pdrv"],
    }),
    getSinglePdrv: build.mutation({
      query: (data: any) => ({
        url: `/pdrv/${data}`,
        method: "get",
        contentType: "application/json",
      }),
    }),
  }),
});

export const {
  usePostPdrvMutation,
  useGetPdrvQuery,
  useDeletePdrvMutation,
  usePatchPdrvMutation,
} = pdrv;
