import { baseApi } from "../baseApi";

const profile = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query({
      query: () => ({
        url: "/user/single",
        method: "GET",
        contentType: "application/json",
      }),
    }),
  }),
});

export const { useGetProfileQuery, useLazyGetProfileQuery } = profile;
