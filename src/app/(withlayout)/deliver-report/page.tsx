"use client";
import Loading from "@/app/loading";
import { useGetSingleOrderQuery } from "@/redux/api/order/orderSlice";
import { useGetSingleReportGroupQuery } from "@/redux/api/reportGroup/reportGroupSlice";
import React from "react";

const DeliverReport = (props: {
  searchParams: { reportGroup: string; oid: string; test: string };
}) => {
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
  console.log(reportGroupData, orderData);
  if (OrderDataLoading || reportGroupDataLoading) {
    return <Loading />;
  }
};

export default DeliverReport;
