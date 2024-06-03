import { ISpecimen } from "@/types/allDepartmentInterfaces";
import { baseApi } from "../baseApi";

const specimen = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postSpecimen: build.mutation({
      query: (data: ISpecimen) => ({
        url: "/specimen",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["specimen"],
    }),
    patchSpecimen: build.mutation({
      query: ({ data, id }) => ({
        url: `/specimen/${id}`,
        method: "PATCH",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["specimen"],
    }),
    deleteSpecimen: build.mutation({
      query: (id: string) => ({
        url: `/specimen/${id}`,
        method: "DELETE",
        contentType: "application/json",
      }),
      invalidatesTags: ["specimen"],
    }),
    getSpecimen: build.query({
      query: () => ({
        url: "/specimen",
        method: "GET",
        contentType: "application/json",
      }),
      providesTags: ["specimen"],
    }),
    getSingleSpecimen: build.mutation({
      query: (id: string) => ({
        url: `/specimen/${id}`,
        method: "GET",
        contentType: "application/json",
      }),
    }),
  }),
});

export const {
  usePostSpecimenMutation,
  useGetSpecimenQuery,
  useDeleteSpecimenMutation,
  usePatchSpecimenMutation,
} = specimen;
