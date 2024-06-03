import { ISpecimen } from "@/types/allDepartmentInterfaces";
import { baseApi } from "../baseApi";
import { INewUserData } from "@/components/users/interfacesAndInitalData";

const usersSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postUser: build.mutation({
      query: (data: INewUserData) => ({
        url: "/user",
        method: "post",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["users"],
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
      providesTags: ["users"],
    }),
    getSingleUser: build.query({
      query: (uuid: string) => ({
        url: `/user/${uuid}`,
        method: "GET",
        contentType: "application/json",
      }),
      providesTags: ["user"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  usePostUserMutation,
  usePatchUserMutation,
  useGetSingleUserQuery,
  useLazyGetSingleUserQuery,
} = usersSlice;
