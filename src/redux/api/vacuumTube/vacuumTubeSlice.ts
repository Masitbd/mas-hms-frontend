import { IVacuumTube } from "@/types/allDepartmentInterfaces";
import { baseApi } from "../baseApi";

const vacuumTube = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postVacuumTube: build.mutation({
      query: (data: IVacuumTube) => ({
        url: "/test-tube",
        method: "POST",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["vacuumTube"],
    }),
    patchVacuumTube: build.mutation({
      query: ({ data, id }) => ({
        url: `/test-tube/${id}`,
        method: "PATCH",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["vacuumTube"],
    }),
    deleteVacuumTube: build.mutation({
      query: (id: string) => ({
        url: `/test-tube/${id}`,
        method: "DELETE",
        contentType: "application/json",
      }),
      invalidatesTags: ["vacuumTube"],
    }),
    getVacuumTube: build.query({
      query: () => ({
        url: "/test-tube",
        method: "GET",
        contentType: "application/json",
      }),
      providesTags: ["vacuumTube"],
    }),
    getSingleVacuumTube: build.mutation({
      query: (id: string) => ({
        url: `/test-tube/${id}`,
        method: "GET",
        contentType: "application/json",
      }),
    }),
  }),
});

export const {
  usePostVacuumTubeMutation,
  useGetVacuumTubeQuery,
  useDeleteVacuumTubeMutation,
  usePatchVacuumTubeMutation,
} = vacuumTube;
