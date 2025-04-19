import { baseApi } from "./baseApi";

const packageApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //  get all

    getAllPackage: build.query({
      query: (args) => ({
        url: "/packages",
        method: "GET",
        params: args,
      }),
      providesTags: ["packages"],
    }),

    createPackage: build.mutation({
      query: (data) => ({
        url: "/packages",
        method: "POST",
        contentType: "application/json",
        data: data,
        body: data,
      }),
      invalidatesTags: ["packages"],
    }),
    updatePackage: build.mutation({
      query: (options) => ({
        url: `/packages/${options.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: options.data,
        body: options.data,
      }),
      invalidatesTags: ["packages"],
    }),
    deletePackage: build.mutation({
      query: (id) => ({
        url: `/packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["packages"],
    }),

    //
  }),
});

export const {
  useCreatePackageMutation,
  useGetAllPackageQuery,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packageApi;
