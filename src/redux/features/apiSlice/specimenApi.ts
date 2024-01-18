import { baseApi } from "@/redux/api/baseApi";
import { ISpecimen } from "@/types/globalTypes";

export const specimen = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSpecimen: builder.query<ISpecimen[], void>({
      query: () => "/specimen/"
    }),
    getSingleSpecimen: builder.query<ISpecimen, void>({
      query: (id) => `/specimen/${id}`
    }),
    editSpecimen: builder.mutation<
      ISpecimen,
      { id: string; data: Partial<ISpecimen> }
    >({
      query: ({ id, data }) => ({
        url: `/specimen/${id}`,
        method: "PATCH",
        body: data
      })
    }),
    deleteSpecimen: builder.mutation({
      query: (id) => ({
        url: `/specimen/${id}`,
        method: "DELETE"
      })
    }),
    createSpecimen: builder.mutation({
      query: ({ data }) => ({
        url: `/specimen/`,
        method: "POST",
        body: data
      })
    })
  })
});
