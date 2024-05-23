import {
  INewUserData,
  IProfile,
} from "@/components/users/interfacesAndInitalData";
import { baseApi } from "../baseApi";

const profile = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query({
      query: () => ({
        url: "/profile",
        method: "GET",
        contentType: "application/json",
      }),
      providesTags: ["profile"],
    }),
    patchProfile: build.mutation({
      query: (data: { profileData: Partial<IProfile>; uuid: string }) => ({
        url: `/profile/${data.uuid}`,
        method: "PATCH",

        data: data.profileData,
        contentType: "application/json",
      }),
      invalidatesTags: ["users", "user"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  usePatchProfileMutation,
} = profile;
