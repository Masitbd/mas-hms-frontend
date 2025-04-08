import { baseApi } from "./baseApi";

const bedApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //  get all

    getAllBed: build.query({
      query: (args) => ({
        url: "/beds",
        method: "GET",
        params: args,
      }),
      providesTags: ["beds"],
    }),
    getSingleBed: build.query({
      query: (id) => ({
        url: `/beds/${id}`,
        method: "GET",
      }),
      providesTags: ["beds"],
    }),
    createBed: build.mutation({
      query: (data) => ({
        url: "/beds",
        method: "POST",
        contentType: "application/json",
        data: data,
        body: data,
      }),
      invalidatesTags: ["beds"],
    }),
    updateBed: build.mutation({
      query: (options) => ({
        url: `/beds/${options.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: options.data,
        body: options.data,
      }),
      invalidatesTags: ["beds"],
    }),
    deleteBed: build.mutation({
      query: (id) => ({
        url: `/beds/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["beds"],
    }),

    //
  }),
});

export const {
  useGetAllBedQuery,
  useCreateBedMutation,
  useGetSingleBedQuery,
  useUpdateBedMutation,
  useDeleteBedMutation,
} = bedApi;
