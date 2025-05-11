"use client";
import Loading from "@/app/loading";
import { useGetSingleOrderQuery } from "@/redux/api/order/orderSlice";
import { useGetSingleReportGroupQuery } from "@/redux/api/reportGroup/reportGroupSlice";
import { useSearchParams } from "next/navigation";
import React from "react";

const DeliverReport = (props: {
  searchParams: { reportGroup: string; oid: string; test: string };
}) => {
  const searchParam = useSearchParams();
  props.searchParams = {
    oid: searchParam.get("oid") as string,
    reportGroup: searchParam.get("reportGroup") as string,
    test: searchParam.get("test") as string,
  };
  const {
    data: orderData,
    isLoading: OrderDataLoading,
    refetch,
  } = useGetSingleOrderQuery(props.searchParams.oid, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { data: reportGroupData, isLoading: reportGroupDataLoading } =
    useGetSingleReportGroupQuery(props.searchParams.reportGroup);
  if (OrderDataLoading || reportGroupDataLoading) {
    return <Loading />;
  }
};

export default DeliverReport;
