import { baseApi } from "./baseApi";

const worldApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //  get all

    getAllWorlds: build.query({
      query: (args) => ({
        url: "/worlds",
        method: "GET",
        params: args,
      }),
      providesTags: ["worlds"],
    }),
    getSingleWorlds: build.query({
      query: (id) => ({
        url: `/worlds/${id}`,
        method: "GET",
      }),
      providesTags: ["worlds"],
    }),
    createWorlds: build.mutation({
      query: (data) => ({
        url: "/worlds",
        method: "POST",
        contentType: "application/json",
        data: data,
        body: data,
      }),
      invalidatesTags: ["worlds"],
    }),
    // !
    updateWorlds: build.mutation({
      query: (options) => ({
        url: `/worlds/${options.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: options.data,
        body: options.data,
      }),
      invalidatesTags: ["worlds"],
    }),
    // !
    deleteWorlds: build.mutation({
      query: (id) => ({
        url: `/worlds/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["worlds"],
    }),

    //
  }),
});

export const {
  useGetAllWorldsQuery,
  useCreateWorldsMutation,
  useGetSingleWorldsQuery,
  useUpdateWorldsMutation,
  useDeleteWorldsMutation,
} = worldApi;
