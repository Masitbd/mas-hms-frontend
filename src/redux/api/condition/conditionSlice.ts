import { baseApi } from "../baseApi";

const conditioin = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postCondition: build.mutation({
      query: (data: any) => ({
        url: "/condition",
        method: "post",
        body: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["condition"],
    }),
    patchCondition: build.mutation({
      query: ({ data, id }) => ({
        url: "/condition",
        method: "patch",
        body: data,
        data: data,
        params: { id },
        contentType: "application/json",
      }),
    }),
    deleteCondition: build.mutation({
      query: (data) => ({
        url: `/condition/${data}`,
        method: "delete",
        contentType: "application/json",
      }),
      invalidatesTags: ["condition"],
    }),
    getCondition: build.query({
      query: () => ({
        url: "/condition",
        method: "get",
        contentType: "application/json",
      }),
      providesTags: ["condition"],
    }),
    getSingleCondition: build.mutation({
      query: (data: any) => ({
        url: "/condition",
        method: "get",
        body: data,
        data: data,
        contentType: "application/json",
      }),
    }),
  }),
});

export const {
  usePostConditionMutation,
  useGetConditionQuery,
  useDeleteConditionMutation,
} = conditioin;
