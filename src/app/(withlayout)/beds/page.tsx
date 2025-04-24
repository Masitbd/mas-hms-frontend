"use client";
import AddBedModal from "@/components/beds/AddBedModal";
import BedsTable from "@/components/beds/BedTable";
import { useGetBedForAdminQuery } from "@/redux/api/bed.api";
import { useGetAllWorldsQuery } from "@/redux/api/world.api";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, SelectPicker } from "rsuite";

const BedPage = () => {
  const { watch, control, reset } = useForm();
  const searchValue = watch("search");

  const queryParams: Record<string, any> = {};

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [worldId, setWorld] = useState("");

  const { data: worlds, isLoading: worldLoading } =
    useGetAllWorldsQuery(undefined);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);

    return () => clearTimeout(delay); // cleanup
  }, [searchValue]);

  if (debouncedSearch) queryParams.searchTerm = debouncedSearch;
  if (worldId) queryParams.worldId = worldId;

  const { data, isLoading } = useGetBedForAdminQuery(queryParams);

  const handleClear = () => {
    setWorld("");

    reset({ search: "", bedType: "" });
  };

  return (
    <div>
      <div className="bg-[#3498ff] text-white px-2 py-2 my-10">
        <h2 className="text-center text-xl font-semibold">Bed Management</h2>
      </div>
      <div className="px-10">
        <AddBedModal />
        <div className="my-5">
          <form className="flex items-center gap-10">
            <Controller
              name="search"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Search beds..."
                  className="w-full"
                />
              )}
            />

            <Controller
              name="bedType"
              control={control}
              render={({ field }) => (
                <SelectPicker
                  {...field}
                  data={worlds?.data?.map(
                    (item: { worldName: string; _id: string }) => ({
                      label: item.worldName,
                      value: item._id,
                    })
                  )}
                  searchable={false}
                  placeholder="Select bed type"
                  className="w-full"
                  value={field.value}
                  onChange={(value) => setWorld(value)}
                  cleanable
                />
              )}
            />
            {Object.keys(queryParams)?.length > 0 && (
              <Button onClick={handleClear} color="red" appearance="ghost">
                {" "}
                Clear{" "}
              </Button>
            )}
          </form>
        </div>
        <BedsTable worldData={data} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default BedPage;
