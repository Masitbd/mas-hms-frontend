import { ISensitivity } from "@/types/allDepartmentInterfaces";
import { baseApi } from "../baseApi";
import { IReportGroupFormData } from "@/components/reportGroup/initialDataAndTypes";

const group = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postGroup: build.mutation({
      query: (data: IReportGroupFormData) => ({
        url: "/reportTypeGroup",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["group"],
    }),
    patchGroup: build.mutation({
      query: ({ data, id }) => ({
        url: `/reportTypeGroup/${id}`,
        method: "PATCH",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["group"],
    }),

    getGroup: build.query({
      query: (data: { department?: string; reportGroup?: string }) => ({
        url: "/reportTypeGroup",
        method: "GET",
        params: data,
        contentType: "application/json",
      }),
      providesTags: ["group"],
    }),
    getSingleGroup: build.mutation({
      query: (id: string) => ({
        url: `/reportTypeGroup/${id}`,
        method: "GET",
        contentType: "application/json",
      }),
    }),
  }),
});

export const {
  useGetGroupQuery,
  useGetSingleGroupMutation,
  usePostGroupMutation,
  usePatchGroupMutation,
  useLazyGetGroupQuery,
} = group;
