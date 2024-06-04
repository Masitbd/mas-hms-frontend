import { baseApi } from "../baseApi";

const permission = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postPermission: build.mutation({
      query: (data: any) => ({
        url: "/permission",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["permission"],
    }),
    patchpermission: build.mutation({
      query: ({ data, id }) => ({
        url: `/permission/${id}`,
        method: "PATCH",
        body: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["permission"],
    }),
    deletepermission: build.mutation({
      query: (data) => ({
        url: `/permission/${data}`,
        method: "delete",
        contentType: "application/json",
      }),
      invalidatesTags: ["permission"],
    }),
    getpermission: build.query({
      query: () => ({
        url: "/permission",
        method: "get",
        contentType: "application/json",
      }),
      providesTags: ["permission"],
    }),
    getSinglepermission: build.mutation({
      query: (data: any) => ({
        url: `/permission/${data}`,
        method: "get",
        contentType: "application/json",
      }),
    }),
  }),
});

export const {
  useDeletepermissionMutation,
  useGetpermissionQuery,
  useGetSinglepermissionMutation,
  usePatchpermissionMutation,
  usePostPermissionMutation,
} = permission;
