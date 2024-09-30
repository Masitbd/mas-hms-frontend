import { IHospitalGroup } from "@/types/allDepartmentInterfaces";
import { baseApi } from "../baseApi";
import { IMiscellaneous } from "@/components/bactrologicalInfo/typesAndInitialData";

const miscellaneous = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postMisc: build.mutation({
      query: (data: IMiscellaneous) => ({
        url: "/miscellaneous",
        method: "POST",
        data: data,
        body: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["miscellaneous"],
    }),
    patchMisc: build.mutation({
      query: ({ data, id }) => ({
        url: `/miscellaneous/${id}`,
        method: "PATCH",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["miscellaneous"],
    }),
    deleteMisc: build.mutation({
      query: (id: string) => ({
        url: `/miscellaneous/${id}`,
        method: "DELETE",
        contentType: "application/json",
      }),
      invalidatesTags: ["miscellaneous"],
    }),
    getMisc: build.query({
      query: (param: { title: string }) => ({
        url: "/miscellaneous",
        method: "GET",
        contentType: "application/json",
        params: param,
      }),
      providesTags: ["miscellaneous"],
    }),
    getSIngleMisc: build.mutation({
      query: (id: string) => ({
        url: `/miscellaneous/${id}`,
        method: "GET",
        contentType: "application/json",
      }),
    }),
    // margin
    getMarginData: build.query({
      query: () => ({
        url: "/miscellaneous/page/margin-data",
        method: "GET",
        contentType: "application/json",
      }),
    }),
  }),
});

export const {
  usePostMiscMutation,
  usePatchMiscMutation,
  useDeleteMiscMutation,
  useGetMiscQuery,
  useGetSIngleMiscMutation,
  useGetMarginDataQuery,
} = miscellaneous;
