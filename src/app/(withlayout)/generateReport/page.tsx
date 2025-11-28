"use client";
import Loading from "@/app/loading";
import ForMicrobiology from "@/components/generateReport/ForMicrobiology";
import ForParameterBased from "@/components/generateReport/ForParameterBased";
import { IPropsForGenerateReport } from "@/components/generateReport/initialDataAndTypes";
import ForDescriptiveBased from "@/components/Test/TestForDescriptive";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import { ENUM_REPORT_TYPE } from "@/enum/ENUMReportType";
import { ENUM_TEST_STATUS } from "@/enum/testStatusEnum";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import {
  useGetOrderQuery,
  useGetSingleOrderQuery,
} from "@/redux/api/order/orderSlice";
import { useGetSingleReportGroupQuery } from "@/redux/api/reportGroup/reportGroupSlice";
import { useGetReportMarginQuery } from "@/redux/api/reportMargin/reportMargin.api";
import { IReportGroup, ITest } from "@/types/allDepartmentInterfaces";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const MainComponent = () => {
  const reportGroup = useSearchParams().get("reportGroup") as string;
  const mode = useSearchParams().get("mode") as string;
  const test = useSearchParams().get("test") as string;
  const reportType: string = useSearchParams().get("reportType") as string;
  const oid: string = useSearchParams().get("oid") as string;
  const {
    data: marginData,
    isLoading: marginDataLoading,
    isFetching: marginDataFetching,
  } = useGetReportMarginQuery(undefined);
  const {
    data: orderData,
    isLoading: OrderDataLoading,
    refetch,
  } = useGetSingleOrderQuery(oid, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { data: reportGroupData, isLoading: reportGroupDataLoading } =
    useGetSingleReportGroupQuery(reportGroup);

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
          mode={mode}
          refeatch={refetch}
          testIds={test?.split(",")}
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
          mode={mode}
          refeatch={refetch}
          testIds={test?.split(",")}
        />
      );
      break;

    case "bacterial":
      resultGeneratorComponent = (
        <ForMicrobiology
          mode={mode}
          oid={orderData?.data[0]?.oid}
          reportGroup={reportGroupData?.data as IReportGroup}
          order={orderData?.data[0]}
          test={test as string}
          tests={testsAccordingResultType}
        />
      );
      break;

    default:
      resultGeneratorComponent = <Loading />;
      break;
  }

  useEffect(() => {
    if (orderData?.data?.length > 0 && reportGroupData?.data?._id) {
      const testDataForParameter = test?.split(",");

      const filteredTest = orderData?.data[0]?.tests.filter(
        (test: { test: ITest; status: string }) => {
          if (reportType == ENUM_REPORT_TYPE.PARAMETER) {
            return (
              testDataForParameter?.includes(
                test.test?._id?.toString() as string
              ) &&
              test.status !== "tube" &&
              test.status !== ENUM_TEST_STATUS.REFUNDED
            );
          } else {
          }
          return (
            test.test?._id == (test as unknown as string) &&
            test.status !== "tube" &&
            test.status !== ENUM_TEST_STATUS.REFUNDED
          );
        }
      );
      setTestAccordignResultType(filteredTest);
      setTestResultType(reportGroupData?.data?.testResultType);
    }
  }, [
    orderData,
    reportGroupData,
    OrderDataLoading,
    reportGroupDataLoading,
    marginData,
  ]);

  if (
    OrderDataLoading ||
    reportGroupDataLoading ||
    marginDataFetching ||
    marginDataLoading
  ) {
    return <Loading />;
  } else {
    return (
      <AuthCheckerForComponent
        requiredPermission={[
          ENUM_USER_PEMISSION.MANAGE_LAB_REPORTS,
          ENUM_USER_PEMISSION.GET_LAB_REPORTS,
        ]}
      >
        {resultGeneratorComponent}
      </AuthCheckerForComponent>
    );
  }
};

const GenerateReport = () => {
  return (
    <Suspense fallback={<Loading />}>
      <MainComponent />
    </Suspense>
  );
};

export default GenerateReport;
