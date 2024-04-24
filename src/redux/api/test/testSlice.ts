import { baseApi } from "../baseApi";

const testSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postTest: build.mutation({
      query: (data) => ({
        url: "/test",
        method: "POST",
        contentType: "application/json",
        body: data,
      }),
      invalidatesTags: ["test"],
    }),
    patchTest: build.mutation({
      query: ({ data, id }) => ({
        url: `/test/${id}`,
        method: "PATCH",
        contentType: "application/json",
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
    getTest: build.query({
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
  useGetTestQuery,
  useGetTestsQuery,
  useDeleteTestMutation,
  useLazyGetTestQuery,
  useLazyGetTestsQuery,
} = testSlice;
