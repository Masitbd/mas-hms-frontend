"use client";

import AddDeseaseModal from "@/components/desease/AddDeseaseModal";
import DeseaseTable from "@/components/desease/DeseaseTable";
import { useGetAllDeseaseQuery } from "@/redux/api/desease.api";
import React from "react";

const DeseasePage = () => {
  const { data, isLoading } = useGetAllDeseaseQuery(undefined);

  return (
    <div>
      <div className="bg-[#3498ff] text-white px-2 py-2 my-10">
        <h2 className="text-center text-xl font-semibold">
          Desease Management
        </h2>
      </div>
      <div className="px-10">
        <AddDeseaseModal />
        <DeseaseTable item={data} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default DeseasePage;
