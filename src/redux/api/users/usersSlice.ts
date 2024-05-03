import { ISpecimen } from "@/types/allDepartmentInterfaces";
import { baseApi } from "../baseApi";

const usersSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postUser: build.mutation({
      query: (data: ISpecimen) => ({
        url: "/user",
        method: "post",
        body: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["specimen"],
    }),
    patchUser: build.mutation({
      query: ({ data, uuid }) => ({
        url: `/user/${uuid}`,
        method: "PATCH",
        body: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["specimen"],
    }),

    getAllUsers: build.query({
      query: () => ({
        url: "/user",
        method: "GET",
        contentType: "application/json",
      }),
      providesTags: ["specimen"],
    }),
    getSingleUser: build.query({
      query: (uuid: string) => ({
        url: `/user/${uuid}`,
        method: "GET",
        contentType: "application/json",
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  usePostUserMutation,
  usePatchUserMutation,
  useGetSingleUserQuery,
} = usersSlice;
