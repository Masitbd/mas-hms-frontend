"use client";
import Loading from "@/app/loading";
import ForParameterBased from "@/components/generateReport/ForParameterBased";
import { IPropsForGenerateReport } from "@/components/generateReport/initialDataAndTypes";
import { useGetOrderQuery } from "@/redux/api/order/orderSlice";
import { useGetSingleReportGroupQuery } from "@/redux/api/reportGroup/reportGroupSlice";
import { IReportGroup, ITest } from "@/types/allDepartmentInterfaces";
import React, { useEffect, useState } from "react";

const GenerateReport = (props: IPropsForGenerateReport) => {
  const { data: orderData, isLoading: OrderDataLoading } = useGetOrderQuery({
    oid: props.params.oid,
  });
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
          order={orderData?.data[0]}
          mode={props.searchParams.mode}
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
        (test: { test: ITest }) => {
          return test.test.reportGroup == reportGroupData?.data?._id;
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
