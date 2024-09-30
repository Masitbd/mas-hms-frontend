"use client";
import OrderTable from "@/components/testReport/OrderTable";
import React from "react";

const TestReport = () => {
  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">Test Reports</h2>
        </div>
        <div className="p-2">
          <OrderTable />
        </div>
      </div>
    </div>
  );
};

export default TestReport;
