import { baseApi } from "../baseApi";

const testSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postTest: build.mutation({
      query: (data) => ({
        url: "/test",
        method: "POST",
        contentType: "application/json",
        data: data,
        body: data,
      }),
      invalidatesTags: ["test"],
    }),
    patchTest: build.mutation({
      query: ({ data, id }) => ({
        url: `/test/${id}`,
        method: "PATCH",
        contentType: "application/json",
        data: data,
        body: data,
      }),
      invalidatesTags: ["test"],
    }),
    deleteTest: build.mutation({
      query: (id) => ({
        url: `/test/${id}`,
        method: "DELETE",
        contentType: "application/json",
      }),
      invalidatesTags: ["test"],
    }),
    getSingleTest: build.query({
      query: (id) => ({
        url: `/test/${id}`,
        method: "GET",
        contentType: "application/json",
      }),
    }),
    getTests: build.query({
      query: (data?: any) => ({
        url: `/test`,
        params: data,
        method: "GET",
        contentType: "application/json",
      }),
      providesTags: ["test"],
    }),
  }),
});

export const {
  usePostTestMutation,
  usePatchTestMutation,
  useGetSingleTestQuery,
  useGetTestsQuery,
  useDeleteTestMutation,
  useLazyGetSingleTestQuery,
  useLazyGetTestsQuery,
} = testSlice;
