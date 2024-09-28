"use client";

import Loading from "@/app/loading";
import InvestigationInformation from "@/components/labelPrinting/InvestigationInformation";
import PatientInformation from "@/components/labelPrinting/PatientInformation";
import { useGetSingleOrderQuery } from "@/redux/api/order/orderSlice";
import React from "react";
import { Table } from "rsuite";

const TestsForLabel = ({ params }: { params: { oid: string } }) => {
  const {
    data: orderData,
    isLoading: OrderDataLoading,
    isFetching: orderDataFetching,
  } = useGetSingleOrderQuery(params.oid);

  if (orderDataFetching || OrderDataLoading) {
    return <Loading />;
  }
  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Patient Information
          </h2>
        </div>
        <div className="p-2">
          <PatientInformation order={orderData?.data[0]} />
        </div>
      </div>
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Investigation Information
          </h2>
        </div>
        <div className="p-2">
          <InvestigationInformation order={orderData?.data[0]} />
        </div>
      </div>
    </div>
  );
};

export default TestsForLabel;
