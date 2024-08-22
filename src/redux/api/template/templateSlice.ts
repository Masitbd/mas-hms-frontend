import { baseApi } from "../baseApi";

const template = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postTemplate: build.mutation({
      query: (data: any) => ({
        url: "/template",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["condition"],
    }),
    patchTemplate: build.mutation({
      query: ({ data, id }) => ({
        url: `/template/${id}`,
        method: "PATCH",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["condition"],
    }),
    deleteTemplate: build.mutation({
      query: (data) => ({
        url: `/template/${data}`,
        method: "delete",
        contentType: "application/json",
      }),
      invalidatesTags: ["condition"],
    }),
    getTemplate: build.query({
      query: () => ({
        url: "/template",
        method: "get",
        contentType: "application/json",
      }),
      providesTags: ["condition"],
    }),
    getSingleTemplate: build.mutation({
      query: (data: any) => ({
        url: `/template/${data}`,
        method: "get",
        contentType: "application/json",
      }),
    }),
  }),
});

export const {
  useGetTemplateQuery,
  useDeleteTemplateMutation,
  usePatchTemplateMutation,
  usePostTemplateMutation,
  useGetSingleTemplateMutation,
} = template;
