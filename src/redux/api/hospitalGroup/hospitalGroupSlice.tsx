import { IHospitalGroup } from "@/types/allDepartmentInterfaces";
import { baseApi } from "../baseApi";

const hospitalGroup = baseApi.injectEndpoints({
    endpoints: (build) => ({
      postHospitalGroup: build.mutation({
        query: (data: IHospitalGroup) => ({
          url: "/hospitalGroup",
          method: "POST",
          body: data,
          contentType: "application/json",
        }),
        invalidatesTags: ["hospitalGroup"],
      }),
      patchHospitalGroup: build.mutation({
        query: ({ data, id }) => ({
          url: `/hospitalGroup/${id}`,
          method: "PATCH",
          body: data,
          contentType: "application/json",
        }),
        invalidatesTags: ["hospitalGroup"],
      }),
      deleteHospitalGroup: build.mutation({
        query: (id: string) => ({
          url: `/hospitalGroup/${id}`,
          method: "DELETE",
          contentType: "application/json",
        }),
        invalidatesTags: ["hospitalGroup"],
      }),
      getHospitalGroup: build.query({
        query: () => ({
          url: "/hospitalGroup",
          method: "GET",
          contentType: "application/json",
        }),
        providesTags: ["hospitalGroup"],
      }),
      getSingleHospitalGroup: build.mutation({
        query: (id: string) => ({
          url: `/hospitalGroup/${id}`,
          method: "GET",
          contentType: "application/json",
        }),
      }),
    }),
  });

  export const {
    usePostHospitalGroupMutation,
    useGetHospitalGroupQuery,
    useDeleteHospitalGroupMutation,
    usePatchHospitalGroupMutation,
  } = hospitalGroup;