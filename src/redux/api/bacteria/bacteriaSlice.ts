import { baseApi } from "../baseApi";

const bacteria = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postBacteria: build.mutation({
      query: (data: any) => ({
        url: "/bacteria",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["bacteria"],
    }),
    patchBacteria: build.mutation({
      query: ({ data, id }) => ({
        url: `/bacteria/${id}`,
        method: "PATCH",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["bacteria"],
    }),
    deleteBacteria: build.mutation({
      query: (data) => ({
        url: `/bacteria/${data}`,
        method: "delete",
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["bacteria"],
    }),
    getBacteria: build.query({
      query: () => ({
        url: "/bacteria",
        method: "get",

        contentType: "application/json",
      }),
      providesTags: ["bacteria"],
    }),
    getSingleBacteria: build.mutation({
      query: (data: any) => ({
        url: `/bacteria/${data}`,
        method: "get",
        data: data,
        contentType: "application/json",
      }),
    }),
  }),
});

export const {
  usePostBacteriaMutation,
  useGetBacteriaQuery,
  useDeleteBacteriaMutation,
  usePatchBacteriaMutation,
} = bacteria;
