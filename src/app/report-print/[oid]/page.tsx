"use client";
import Loading from "@/app/loading";
import ForMicrobiology from "@/components/generateReport/ForMicrobiology";
import ForMicrobiologyPrint from "@/components/generateReport/ForMicrobiologyPrint";
import ForParameterBased from "@/components/generateReport/ForParameterBased";
import ForParameterBasedPrint from "@/components/generateReport/ForParameterBasedPrint";
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
import React, { useEffect, useState } from "react";

const GenerateReport = (props: IPropsForGenerateReport) => {
  const {
    data: marginData,
    isLoading: marginDataLoading,
    isFetching: marginDataFetching,
  } = useGetReportMarginQuery(undefined);
  const {
    data: orderData,
    isLoading: OrderDataLoading,
    refetch,
  } = useGetSingleOrderQuery(props.params.oid, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { data: reportGroupData, isLoading: reportGroupDataLoading } =
    useGetSingleReportGroupQuery(props.searchParams.reportGroup);

  const [testresultType, setTestResultType] = useState("");
  const [testsAccordingResultType, setTestAccordignResultType] = useState([]);
  const [margins, setMargins] = useState([0, 0, 0, 0]);

  let resultGeneratorComponent;
  switch (testresultType) {
    case "parameter":
      resultGeneratorComponent = (
        <ForParameterBasedPrint
          oid={orderData?.data[0]?.oid}
          tests={testsAccordingResultType}
          reportGroup={reportGroupData?.data as IReportGroup}
          order={JSON.parse(JSON.stringify(orderData?.data[0]))}
          mode={props.searchParams.mode}
          refeatch={refetch}
          testIds={props.searchParams.test?.split(",")}
          margins={margins}
        />
      );
      break;

    case "descriptive":
      resultGeneratorComponent = (
        <ForParameterBasedPrint
          oid={orderData?.data[0]?.oid}
          tests={testsAccordingResultType}
          reportGroup={reportGroupData?.data as IReportGroup}
          order={JSON.parse(JSON.stringify(orderData?.data[0]))}
          mode={props.searchParams.mode}
          refeatch={refetch}
          testIds={props.searchParams.test?.split(",")}
          margins={margins}
        />
      );
      break;

    case "bacterial":
      resultGeneratorComponent = (
        <ForMicrobiologyPrint
          mode={props.searchParams.mode}
          oid={orderData?.data[0]?.oid}
          reportGroup={reportGroupData?.data as IReportGroup}
          order={orderData?.data[0]}
          test={props.searchParams?.test as string}
          tests={testsAccordingResultType}
          margins={margins}
        />
      );
      break;

    default:
      resultGeneratorComponent = <Loading />;
      break;
  }

  useEffect(() => {
    if (orderData?.data?.length > 0 && reportGroupData?.data?._id) {
      const testDataForParameter = props?.searchParams?.test?.split(",");

      const filteredTest = orderData?.data[0]?.tests.filter(
        (test: { test: ITest; status: string }) => {
          if (props?.searchParams?.reportType == ENUM_REPORT_TYPE.PARAMETER) {
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
            test.test?._id == props?.searchParams?.test &&
            test.status !== "tube" &&
            test.status !== ENUM_TEST_STATUS.REFUNDED
          );
        }
      );
      setTestAccordignResultType(filteredTest);
      setTestResultType(reportGroupData?.data?.testResultType);
    }

    if (marginData?.data?.length && marginData?.data[0]) {
      const storedMargins = [
        Number(marginData?.data[0]?.top ?? 0) * 96,
        Number(marginData?.data[0]?.right ?? 0) * 96,
        Number(marginData?.data[0]?.bottom ?? 0) * 96,
        Number(marginData?.data[0]?.left ?? 0) * 96,
      ];
      setMargins(storedMargins);
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

export default GenerateReport;
