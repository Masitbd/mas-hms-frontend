"use client";
import Loading from "@/app/loading";
import { ITestsFromOrder } from "@/components/generateReport/initialDataAndTypes";
import { reportType } from "@/components/reportType/initialDataAndTypes";
import TestStatusElement from "@/components/testReport/TestStatusElement";
import { ENUM_REPORT_TYPE } from "@/enum/ENUMReportType";
import {
  useGetSingleOrderQuery,
  useSingleStatusChangerMutation,
} from "@/redux/api/order/orderSlice";
import { useGetSingleReportGroupQuery } from "@/redux/api/reportGroup/reportGroupSlice";
import { ITest } from "@/types/allDepartmentInterfaces";
import { NavLink } from "@/utils/Navlink";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Table } from "rsuite";
import CheckIcon from "@rsuite/icons/Check";

import TestTable from "../../../components/TestTable";
import { ENUM_TEST_STATUS } from "@/enum/testStatusEnum";
import { ENUM_MODE } from "@/enum/Mode";
import swal from "sweetalert";

const TestReportSelector = ({
  searchParams,
}: {
  params: {};
  searchParams: {
    oid: string;
    reportGroup: string;
    mode: string;
    page: "delivery" | "generateReport";
  };
}) => {
  const searchParam = useSearchParams();
  searchParams = {
    oid: searchParam.get("oid") as string,
    mode: searchParam.get("mode") as string,
    reportGroup: searchParam.get("reportGroup") as string,
    page: searchParam.get("page") as "delivery" | "generateReport",
  };
  // For status change
  const [changeStatus, { isLoading: statusLoading }] =
    useSingleStatusChangerMutation();
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;

  const router = useRouter();
  const {
    data: reportGroupData,
    isLoading: reportGroupLoading,
    isFetching: reportGroupFetching,
  } = useGetSingleReportGroupQuery(searchParams?.reportGroup);

  const {
    data: orderData,
    isLoading: orderDataLoading,
    isFetching: orderDataFetching,
  } = useGetSingleOrderQuery(searchParams?.oid);

  useEffect(() => {
    if (
      reportGroupData?.data?.testResultType == ENUM_REPORT_TYPE.PARAMETER &&
      searchParams?.page !== "delivery"
    ) {
      router.push(
        `/generateReport/${searchParams.oid}?reportGroup=${searchParams.reportGroup}&mode=${searchParams.mode}&reportType=${reportGroupData?.data?.testResultType}`
      );
    }
  }, [reportGroupData, reportGroupFetching, reportGroupLoading]);

  // for updating the delivery status
  const [test, setTest] = useState();
  const statusChangeHandler = async (props: {
    oid: string;
    reportGroupLabel: string;
    reportType: ENUM_REPORT_TYPE;
    test?: string;
  }) => {
    try {
      const result = await changeStatus({
        oid: searchParams.oid as string,
        status: "delivered",
        reportGroup: reportGroupData?.data?.label,
        ...(props?.reportType !== ENUM_REPORT_TYPE.PARAMETER
          ? { test: props?.test }
          : {}),
      }).unwrap();
      if (result?.success) {
        swal("Success", "Report Status Changed Successfully", "success");
      }
    } catch (error) {
      console.error(error);
      swal("Error", error as string, "error");
    } finally {
      router.push(`/testReport/${searchParams?.oid}`);
    }
  };
  useEffect(() => {
    if (
      reportGroupData?.data?.testResultType == ENUM_REPORT_TYPE.PARAMETER &&
      searchParams?.page == "delivery"
    ) {
      statusChangeHandler({
        oid: searchParams?.oid,
        reportGroupLabel: reportGroupData?.data?.label,
        reportType: reportGroupData?.data?.testResultType,
      });
    }
  }, [searchParams, test, reportGroupData]);

  const filteredTests = orderData?.data[0]?.tests?.filter(
    (t: ITestsFromOrder & { test: ITest }) => {
      const isParameter =
        reportGroupData?.data?.testResultType === ENUM_REPORT_TYPE.PARAMETER;
      const isDeliveryPage = searchParams?.page === "delivery";
      const isNewMode = searchParams?.mode === "new";
      const isUpdateMode = searchParams?.mode === ENUM_MODE.EDIT;
      const viewMode = searchParams?.mode === ENUM_MODE.VIEW;
      const testStatus = t.status;

      if (isParameter) {
        return (
          t.test.reportGroup?.toString() === searchParams?.reportGroup &&
          testStatus !== "refunded" &&
          testStatus !== "tube" &&
          t.status !== "delivered"
        );
      }

      if (isDeliveryPage && !isParameter) {
        return (
          t.test.reportGroup?.toString() === searchParams?.reportGroup &&
          testStatus === "completed"
        );
      }

      if (isNewMode && !isParameter) {
        return (
          t.test.reportGroup?.toString() === searchParams?.reportGroup &&
          testStatus === "pending"
        );
      }

      if (isUpdateMode && !isParameter) {
        return (
          t.test.reportGroup?.toString() === searchParams?.reportGroup &&
          testStatus === "completed" &&
          t.status !== "delivered"
        );
      }
      console.log(!isParameter);

      if (viewMode && !isParameter) {
        return (
          t.test.reportGroup?.toString() === searchParams?.reportGroup &&
          (testStatus === "completed" || testStatus == "delivered")
        );
      }
      return true;
    }
  );

  console.log(filteredTests);
  if (
    reportGroupLoading ||
    reportGroupFetching ||
    orderDataLoading ||
    orderDataFetching ||
    statusLoading
  ) {
    return <Loading />;
  }

  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Select A Test Below
          </h2>
        </div>

        <div className="p-2">
          <TestTable
            loading={orderDataLoading || orderDataFetching}
            data={filteredTests}
            searchParams={searchParams}
            reportGroupData={reportGroupData}
            statusChangeHandler={statusChangeHandler}
            statusLoading={statusLoading}
            reportGroupLoading={reportGroupLoading}
            orderDataLoading={orderDataLoading}
          />
        </div>
        <div className="p-2">
          <div className="p-2 flex items-end justify-end">
            <NavLink href={`/testReport/${searchParams.oid}`}>
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
    </div>
  );
};

export default TestReportSelector;
