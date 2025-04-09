"use client";

import AddWorldModal from "@/components/worlds/AddWorldModal";
import WoroldTable from "@/components/worlds/WoroldTable";
import { useGetAllWorldsQuery } from "@/redux/api/world.api";

const WorldPage = () => {
  const { data: worlds, isLoading } = useGetAllWorldsQuery(undefined);

  return (
    <div>
      <div className="bg-[#3498ff] text-white px-2 py-2 my-10">
        <h2 className="text-center text-xl font-semibold">
          Bed Category Management
        </h2>
      </div>
      <div className="px-10">
        <AddWorldModal />

        <WoroldTable worldData={worlds} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default WorldPage;
