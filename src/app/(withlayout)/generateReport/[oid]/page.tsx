"use client";
import Loading from "@/app/loading";
import ForMicrobiology from "@/components/generateReport/ForMicrobiology";
import ForParameterBased from "@/components/generateReport/ForParameterBased";
import { IPropsForGenerateReport } from "@/components/generateReport/initialDataAndTypes";
import ForDescriptiveBased from "@/components/Test/TestForDescriptive";
import { ENUM_TEST_STATUS } from "@/enum/testStatusEnum";
import {
  useGetOrderQuery,
  useGetSingleOrderQuery,
} from "@/redux/api/order/orderSlice";
import { useGetSingleReportGroupQuery } from "@/redux/api/reportGroup/reportGroupSlice";
import { IReportGroup, ITest } from "@/types/allDepartmentInterfaces";
import React, { useEffect, useState } from "react";

const GenerateReport = (props: IPropsForGenerateReport) => {
  const {
    data: orderData,
    isLoading: OrderDataLoading,
    refetch,
  } = useGetSingleOrderQuery(props.params.oid);

  const { data: reportGroupData, isLoading: reportGroupDataLoading } =
    useGetSingleReportGroupQuery(props.searchParams.reportGroup);

  const [testresultType, setTestResultType] = useState("");
  const [testsAccordingResultType, setTestAccordignResultType] = useState([]);

  let resultGeneratorComponent;
  switch (testresultType) {
    case "parameter":
      resultGeneratorComponent = (
        <ForParameterBased
          oid={orderData?.data[0]?.oid}
          tests={testsAccordingResultType}
          reportGroup={reportGroupData?.data as IReportGroup}
          order={JSON.parse(JSON.stringify(orderData?.data[0]))}
          mode={props.searchParams.mode}
          refeatch={refetch}
        />
      );
      break;

    case "descriptive":
      resultGeneratorComponent = (
        <ForParameterBased
          oid={orderData?.data[0]?.oid}
          tests={testsAccordingResultType}
          reportGroup={reportGroupData?.data as IReportGroup}
          order={JSON.parse(JSON.stringify(orderData?.data[0]))}
          mode={props.searchParams.mode}
          refeatch={refetch}
        />
      );
      break;

    case "bacterial":
      resultGeneratorComponent = (
        <ForMicrobiology
          mode={props.searchParams.mode}
          oid={orderData?.data[0]?.oid}
          reportGroup={reportGroupData?.data as IReportGroup}
          order={orderData?.data[0]}
        />
      );
      break;

    default:
      resultGeneratorComponent = <Loading />;
      break;
  }

  useEffect(() => {
    if (orderData?.data?.length > 0 && reportGroupData?.data?._id) {
      const filteredTest = orderData?.data[0]?.tests.filter(
        (test: { test: ITest; status: string }) => {
          return (
            test.test.reportGroup == reportGroupData?.data?._id &&
            test.status !== "tube" &&
            test.status !== ENUM_TEST_STATUS.REFUNDED
          );
        }
      );
      setTestAccordignResultType(filteredTest);
      setTestResultType(reportGroupData?.data?.testResultType);
    }
  }, [orderData, reportGroupData, OrderDataLoading, reportGroupDataLoading]);

  if (OrderDataLoading || reportGroupDataLoading) {
    return <Loading />;
  } else {
    return resultGeneratorComponent;
  }
};

export default GenerateReport;
