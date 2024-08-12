import { baseApi } from "../baseApi";

const comment = baseApi.injectEndpoints({
  endpoints: (build) => ({
    post: build.mutation({
      query: (data: any) => ({
        url: "/comment",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["condition"],
    }),
    patch: build.mutation({
      query: ({ data, id }) => ({
        url: `/comment/${id}`,
        method: "PATCH",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["condition"],
    }),
    delete: build.mutation({
      query: (data) => ({
        url: `/comment/${data}`,
        method: "delete",
        contentType: "application/json",
      }),
      invalidatesTags: ["condition"],
    }),
    get: build.query({
      query: () => ({
        url: "/comment",
        method: "get",
        contentType: "application/json",
      }),
      providesTags: ["condition"],
    }),
    getSingle: build.mutation({
      query: (data: any) => ({
        url: `/comment/${data}`,
        method: "get",
        contentType: "application/json",
      }),
    }),
  }),
});

export const {
  useGetQuery,
  useDeleteMutation,
  usePatchMutation,
  usePostMutation,
  useGetSingleMutation,
} = comment;
