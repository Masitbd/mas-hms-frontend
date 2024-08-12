"use client";
import Loading from "@/app/loading";
import OrderAndPatientInfo from "@/components/testReport/OrderAndPatientInfo";
import TestTableForReport from "@/components/testReport/TestTableForReport";
import { useGetOrderQuery } from "@/redux/api/order/orderSlice";
import React, { useEffect, useRef } from "react";
import { Divider } from "rsuite";

const Page = ({ params }: { params: { oid: string } }) => {
  const {
    data: orderData,
    isLoading: orderDataLoading,
    isError: orderDataError,
    isFetching,
    refetch,
  } = useGetOrderQuery(
    { oid: params.oid },
    { refetchOnFocus: true, refetchOnMountOrArgChange: true }
  );

  if (orderDataLoading || isFetching) return <Loading />;

  return (
    <div>
      <div>
        <OrderAndPatientInfo data={orderData.data} />
      </div>
      <div>
        <TestTableForReport data={orderData?.data[0]} />
      </div>
    </div>
  );
};

export default Page;
