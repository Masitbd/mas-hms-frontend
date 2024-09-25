import { baseApi } from "../baseApi";

const companyInfo = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postCompanyInfo: build.mutation({
      query: (data: any) => ({
        url: "/company-info",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["companyInfo", "default-company-info"],
    }),
    patchCompanyInfo: build.mutation({
      query: ({ data, id }) => ({
        url: `/company-info/${id}`,
        method: "PATCH",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: [
        "companyInfo",
        "singleCompanyInfo",
        "default-company-info",
      ],
    }),
    deleteCompanyInfo: build.mutation({
      query: (data) => ({
        url: `/company-info/${data}`,
        method: "delete",
        contentType: "application/json",
      }),
      invalidatesTags: ["companyInfo", "default-company-info"],
    }),
    getCompnayInof: build.query({
      query: () => ({
        url: "/company-info",
        method: "get",
        contentType: "application/json",
      }),
      providesTags: ["companyInfo"],
    }),
    getSingleCompanyInfo: build.query({
      query: (data: any) => ({
        url: `/company-info/${data}`,
        method: "get",
        contentType: "application/json",
      }),
      providesTags: ["singleCompanyInfo"],
    }),
    getCloudinarySecret: build.query({
      query: () => ({
        url: `/company-info/couldianry-sercet`,
        method: "get",
        contentType: "application/json",
      }),
      providesTags: ["cloudinary-secret"],
    }),
    getCreatable: build.query({
      query: () => ({
        url: `/company-info/creatable`,
        method: "get",
        contentType: "application/json",
      }),
      providesTags: ["cloudinary-secret"],
    }),
    getDefault: build.query({
      query: () => ({
        url: `/company-info/default`,
        method: "get",
        contentType: "application/json",
      }),
      providesTags: ["default-company-info"],
    }),
  }),
});

export const {
  usePostCompanyInfoMutation,
  useGetCloudinarySecretQuery,
  useLazyGetCloudinarySecretQuery,
  useGetCompnayInofQuery,
  usePatchCompanyInfoMutation,
  useGetCreatableQuery,
  useLazyGetCreatableQuery,
  useDeleteCompanyInfoMutation,
  useGetDefaultQuery,
} = companyInfo;
