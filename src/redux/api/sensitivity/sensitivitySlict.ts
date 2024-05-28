import { ISpecimen } from "@/types/allDepartmentInterfaces";
import { baseApi } from "../baseApi";

const sensitivity = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postSensitivity: build.mutation({
      query: (data: ISpecimen) => ({
        url: "/sensitivity",
        method: "post",
        body: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["specimen"],
    }),
    patchSensitivity: build.mutation({
      query: ({ data, id }) => ({
        url: `/sensitivity/${id}`,
        method: "PATCH",
        body: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["specimen"],
    }),
    deleteSensitivity: build.mutation({
      query: (id: string) => ({
        url: `/sensitivity/${id}`,
        method: "DELETE",
        contentType: "application/json",
      }),
      invalidatesTags: ["specimen"],
    }),
    getSensitivity: build.query({
      query: () => ({
        url: "/sensitivity",
        method: "GET",
        contentType: "application/json",
      }),
      providesTags: ["specimen"],
    }),
    getSingleSensitivity: build.mutation({
      query: (id: string) => ({
        url: `/sensitivity/${id}`,
        method: "GET",
        contentType: "application/json",
      }),
    }),
  }),
});

export const { useGetSensitivityQuery } = sensitivity;
