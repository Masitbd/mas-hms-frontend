"use client";

import AddPackageModal from "@/components/packageItem/AddPackageModal";
import PackageTable from "@/components/packageItem/PackageTable";
import { useGetAllPackageQuery } from "@/redux/api/package.api";
import React from "react";

const PackagePage = () => {
  const { data, isLoading } = useGetAllPackageQuery(undefined);

  return (
    <div>
      <div className="bg-[#3498ff] text-white px-2 py-2 my-10">
        <h2 className="text-center text-xl font-semibold">Bed Management</h2>
      </div>
      <div className="px-10">
        <AddPackageModal />
        <PackageTable item={data} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default PackagePage;
