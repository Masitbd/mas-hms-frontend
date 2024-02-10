import { IDoctor } from "@/types/allDepartmentInterfaces";
import { baseApi } from "../baseApi";

const doctor = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postDoctor: build.mutation({
      query: (data: IDoctor) => ({
        url: "/doctor",
        method: "POST",
        body: data,
        contentType: "application/json"
      }),
      invalidatesTags: ["doctor"]
    }),
    patchDoctor: build.mutation({
      query: ({ data, id }) => ({
        url: `/doctor/${id}`,
        method: "PATCH",
        body: data,
        contentType: "application/json"
      }),
      invalidatesTags: ["doctor"]
    }),
    deleteDoctor: build.mutation({
      query: (id: string) => ({
        url: `/doctor/${id}`,
        method: "DELETE",
        contentType: "application/json"
      }),
      invalidatesTags: ["doctor"]
    }),
    getDoctor: build.query({
      query: () => ({
        url: "/doctor",
        method: "GET",
        contentType: "application/json"
      }),
      providesTags: ["doctor"]
    }),
    getSingleDoctor: build.mutation({
      query: (id: string) => ({
        url: `/doctor/${id}`,
        method: "GET",
        contentType: "application/json"
      })
    })
  })
});

export const {
  usePostDoctorMutation,
  useGetDoctorQuery,
  useDeleteDoctorMutation,
  usePatchDoctorMutation
} = doctor;
