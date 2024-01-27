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
    }),
    patchTest: build.mutation({
      query: ({ data, id }) => ({
        url: `/test/${id}`,
        method: "PATCH",
        contentType: "application/json",
        body: data,
      }),
    }),
    deleteTest: build.mutation({
      query: (id) => ({
        url: `/test/${id}`,
        method: "DELETE",
        contentType: "application/json",
      }),
    }),
    getTest: build.query({
      query: (id) => ({
        url: `/test/${id}`,
        method: "DELETE",
        contentType: "application/json",
      }),
    }),
    getTests: build.query({
      query: () => ({
        url: `/test`,
        method: "DELETE",
        contentType: "application/json",
      }),
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
} = testSlice;
