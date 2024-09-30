"use client";
import Loading from "@/app/loading";
import OrderAndPatientInfo from "@/components/testReport/OrderAndPatientInfo";
import TestTableForReport from "@/components/testReport/TestTableForReport";
import {
  useGetOrderQuery,
  useGetSingleOrderQuery,
} from "@/redux/api/order/orderSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { Divider } from "rsuite";

const Page = ({ params }: { params: { oid: string } }) => {
  const {
    data: orderData,
    isLoading: orderDataLoading,
    isError: orderDataError,
    isFetching,
    refetch,
  } = useGetSingleOrderQuery(params.oid, { refetchOnMountOrArgChange: true });

  if (orderDataLoading || isFetching) return <Loading />;

  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Order and Patient Info
          </h2>
        </div>
        <div className="p-2">
          <div>
            <OrderAndPatientInfo data={orderData.data} />
          </div>
        </div>
      </div>
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">Reports&apos;s</h2>
        </div>
        <div className="p-2">
          <div>
            <TestTableForReport data={orderData?.data[0]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
