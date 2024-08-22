import { ISensitivity } from "@/components/bactrologicalInfo/typesAndInitialData";
import { baseApi } from "../baseApi";

const sensitivity = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postSensitivity: build.mutation({
      query: (data: ISensitivity) => ({
        url: "/sensitivity",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["sensitivity"],
    }),
    patchSensitivity: build.mutation({
      query: ({ data, id }) => ({
        url: `/sensitivity/${id}`,
        method: "PATCH",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["sensitivity"],
    }),
    deleteSensitivity: build.mutation({
      query: (id: string) => ({
        url: `/sensitivity/${id}`,
        method: "DELETE",
        contentType: "application/json",
      }),
      invalidatesTags: ["sensitivity"],
    }),
    getSensitivity: build.query({
      query: () => ({
        url: "/sensitivity",
        method: "GET",
        contentType: "application/json",
      }),
      providesTags: ["sensitivity"],
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

export const {
  useGetSensitivityQuery,
  usePostSensitivityMutation,
  usePatchSensitivityMutation,
  useDeleteSensitivityMutation,
} = sensitivity;
