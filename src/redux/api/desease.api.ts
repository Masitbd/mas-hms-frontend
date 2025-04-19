import { baseApi } from "./baseApi";

const deseaseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //  get all

    getAllDesease: build.query({
      query: (args) => ({
        url: "/desease",
        method: "GET",
        params: args,
      }),
      providesTags: ["desease"],
    }),

    createDesease: build.mutation({
      query: (data) => ({
        url: "/desease",
        method: "POST",
        contentType: "application/json",
        data: data,
        body: data,
      }),
      invalidatesTags: ["desease"],
    }),
    updateDesease: build.mutation({
      query: (options) => ({
        url: `/desease/${options.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: options.data,
        body: options.data,
      }),
      invalidatesTags: ["desease"],
    }),
    deleteDesease: build.mutation({
      query: (id) => ({
        url: `/desease/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["desease"],
    }),

    //
  }),
});

export const {
  useCreateDeseaseMutation,
  useGetAllDeseaseQuery,
  useUpdateDeseaseMutation,
  useDeleteDeseaseMutation,
} = deseaseApi;
