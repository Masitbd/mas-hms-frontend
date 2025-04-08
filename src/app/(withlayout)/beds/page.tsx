"use client";
import AddBedModal from "@/components/beds/AddBedModal";
import BedsTable from "@/components/beds/BedTable";
import { useGetAllBedQuery } from "@/redux/api/bed.api";

const BedPage = () => {
  const { data, isLoading } = useGetAllBedQuery(undefined);

  // console.log(data, ":datea");

  return (
    <div>
      <div className="bg-[#3498ff] text-white px-2 py-2 my-10">
        <h2 className="text-center text-xl font-semibold">Bed Management</h2>
      </div>
      <div className="px-10">
        <AddBedModal />
        <BedsTable worldData={data} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default BedPage;
