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

  // ✅ Extract primitives (stable deps)
  const oid = searchParam.get("oid") || "";
  const mode = searchParam.get("mode") || "";
  const reportGroup = searchParam.get("reportGroup") || "";
  const page =
    (searchParam.get("page") as "delivery" | "generateReport") ||
    "generateReport";
  // For status change
  const [
    changeStatus,
    { isLoading: statusLoading, isError: statusChangerError },
  ] = useSingleStatusChangerMutation();

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
        test: props?.test,
      }).unwrap();
      if (result?.success) {
        swal("Success", "Report Status Changed Successfully", "success");
      }
    } catch (error) {
      console.error(error);
      swal("Error", error as string, "error");
    } finally {
      router.push(`/testReport/old?oid=/${searchParams?.oid}`);
    }
  };
  // useEffect(() => {
  //   if (
  //     reportGroupData?.data?.testResultType == ENUM_REPORT_TYPE.PARAMETER &&
  //     searchParams?.page == "delivery" &&
  //     reportGroupData?.data &&
  //     !statusLoading
  //   ) {
  //     if (!statusChangerError && !statusLoading) {
  //       statusChangeHandler({
  //         oid: searchParams?.oid,
  //         reportGroupLabel: reportGroupData?.data?.label,
  //         reportType: reportGroupData?.data?.testResultType,
  //       });
  //     } else {
  //       router.push(`/testReport/${searchParams?.oid}`);
  //     }
  //   }
  // }, [
  //   reportGroupData?.data,
  //   reportGroupData?.data?.testResultType,
  //   page,
  //   oid,
  //   changeStatus,
  //   statusLoading,
  //   router,
  // ]);

  const filteredTests = orderData?.data[0]?.tests?.filter(
    (t: ITestsFromOrder & { test: ITest }) => {
      const isParameter =
        reportGroupData?.data?.testResultType === ENUM_REPORT_TYPE.PARAMETER;
      const isDeliveryPage = searchParams?.page === "delivery";
      const isNewMode = searchParams?.mode === "new";
      const isUpdateMode = searchParams?.mode === ENUM_MODE.EDIT;
      const viewMode = searchParams?.mode === ENUM_MODE.VIEW;
      const testStatus = t.status;
      if (isDeliveryPage) {
        return (
          t.test.reportGroup?.toString() === searchParams?.reportGroup &&
          testStatus === "completed"
        );
      }

      if (isNewMode) {
        return (
          t.test.reportGroup?.toString() === searchParams?.reportGroup &&
          testStatus === "pending"
        );
      }

      if (isUpdateMode) {
        return (
          t.test.reportGroup?.toString() === searchParams?.reportGroup &&
          testStatus === "completed" &&
          t.status !== "delivered"
        );
      }

      if (viewMode) {
        return (
          t.test.reportGroup?.toString() === searchParams?.reportGroup &&
          (testStatus === "completed" || testStatus == "delivered")
        );
      }
      return true;
    }
  );

  // For selected tests
  const [testIds, setTestIds] = useState<string[]>([]);
  const navigationHandler = () => {
    router.push(
      `/generateReport/${searchParams.oid}?reportGroup=${
        searchParams.reportGroup
      }&mode=${searchParams.mode}&reportType=${
        reportGroupData?.data?.testResultType
      }&test=${testIds?.join(",")}&oid=${searchParams.oid}`
    );
  };

  useEffect(() => {
    if (reportGroupData?.data?.testResultType == "parameter" && filteredTests) {
      setTestIds([...filteredTests?.map((d: any) => d?.test?._id as any)]);
    }
  }, [orderData]);
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
            testIds={testIds}
            setTestIds={setTestIds}
            page={page}
          />
        </div>
        <div className="p-2">
          <div className="p-2 flex items-end justify-end">
            <NavLink href={`/testReport/old?oid=/${searchParams?.oid}`}>
              <Button
                className="mb-5 col-span-4 mx-2"
                appearance="primary"
                color="red"
                size="lg"
              >
                Back
              </Button>
            </NavLink>

            <Button
              appearance="primary"
              color="blue"
              size="lg"
              disabled={!testIds?.length as boolean}
              onClick={() => navigationHandler()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestReportSelector;
