import { baseApi } from "../baseApi";

const userPermission = baseApi.injectEndpoints({
  endpoints: (build) => ({
    patchUserPermission: build.mutation({
      query: ({ data, uuid }) => ({
        url: `/userPermission/${uuid}`,
        method: "PATCH",
        body: data,
        data: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["permission", "users", "user"],
    }),
  }),
});

export const { usePatchUserPermissionMutation } = userPermission;
