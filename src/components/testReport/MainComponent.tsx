"use client";
import Loading from "@/app/loading";
import OrderAndPatientInfo from "@/components/testReport/OrderAndPatientInfo";
import TestTableForReport from "@/components/testReport/TestTableForReport";
import {
  useGetOrderQuery,
  useGetSingleOrderQuery,
} from "@/redux/api/order/orderSlice";
import { NavLink } from "@/utils/Navlink";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { Button, Divider } from "rsuite";

const MainComponent = () => {
  const oid = useSearchParams().get("oid");
  const {
    data: orderData,
    isLoading: orderDataLoading,
    isError: orderDataError,
    isFetching,
    refetch,
  } = useGetSingleOrderQuery(oid as string, {
    refetchOnMountOrArgChange: true,
  });
  useEffect(() => {
    refetch();
  }, []);

  if (orderDataLoading || isFetching) return <Loading />;

  if (orderData?.data.length < 0) {
    return (
      <div className="">
        <div className="my-5 border  shadow-lg mx-5">
          <div className="bg-[#3498ff] text-white px-2 py-2">
            <h2 className="text-center text-xl font-semibold">
              Order and Patient Info
            </h2>
          </div>
          <div>
            <div className="text-center">Order not found</div>
          </div>
        </div>
      </div>
    );
  }
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
            <OrderAndPatientInfo data={orderData?.data} />
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
        <div className="p-2 flex items-end justify-end">
          <NavLink href={`/testReport`}>
            <Button
              className="mb-5 col-span-4 mx-2"
              appearance="primary"
              color="red"
              size="lg"
            >
              Back
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
