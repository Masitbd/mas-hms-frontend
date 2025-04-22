"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const BedSearch = () => {
  const { register, watch } = useForm();
  const searchValue = watch("search");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500); // 500ms debounce

    return () => clearTimeout(delay); // cleanup
  }, [searchValue]);

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      console.log("Debounced Search Value:", debouncedSearch);
      // You can trigger API calls or Redux actions here
    }
  }, [debouncedSearch]);

  return (
    <form>
      <input
        {...register("search")}
        type="text"
        placeholder="Search beds..."
        className="border px-4 py-2 rounded w-full"
      />
    </form>
  );
};

export default BedSearch;
