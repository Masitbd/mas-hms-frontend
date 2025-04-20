import { baseApi } from "../baseApi";

const journal = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postJournalEntry: build.mutation({
      query: (data) => ({
        url: `/journal-entry`,
        method: "POST",
        contentType: "application/json",
        body: data,
        data: data,
      }),
    }),
  }),
});

export const { usePostJournalEntryMutation } = journal;
