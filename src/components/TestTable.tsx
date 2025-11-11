import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Table, Button, Checkbox } from "rsuite";
import { NavLink } from "@/utils/Navlink";
import TestStatusElement from "@/components/testReport/TestStatusElement";
import CheckIcon from "@rsuite/icons/Check";
import { ENUM_REPORT_TYPE } from "@/enum/ENUMReportType";
import { ITestsFromOrder } from "@/components/generateReport/initialDataAndTypes";
import { ITest } from "@/types/allDepartmentInterfaces";

const { Cell, Column, HeaderCell } = Table;

interface TestTableProps {
  loading: boolean;
  data: Array<ITestsFromOrder & { test: ITest }>;
  searchParams: {
    oid: string;
    reportGroup: string;
    mode: string;
    page: "delivery" | "generateReport";
  };
  reportGroupData: any; // Replace with actual type if available
  statusChangeHandler: (props: {
    oid: string;
    reportGroupLabel: string;
    reportType: ENUM_REPORT_TYPE;
    test?: string;
  }) => void;
  statusLoading: boolean;
  reportGroupLoading: boolean;
  orderDataLoading: boolean;
  setTestIds: Dispatch<SetStateAction<string[]>>;
  testIds: string[];
  page: string;
}

const TestTable: React.FC<TestTableProps> = ({
  loading,
  data,
  searchParams,
  reportGroupData,
  statusChangeHandler,
  statusLoading,
  reportGroupLoading,
  orderDataLoading,
  testIds,
  setTestIds,
  page,
}) => {
  return (
    <Table loading={loading} data={data} autoHeight>
      <Column flexGrow={2}>
        <HeaderCell>Report Name</HeaderCell>
        <Cell dataKey="test.label" />
      </Column>
      <Column flexGrow={1}>
        <HeaderCell>Status</HeaderCell>
        <Cell>
          {(rowdata) => {
            return <TestStatusElement status={rowdata?.status} />;
          }}
        </Cell>
      </Column>
      <Column flexGrow={1}>
        <HeaderCell>Action</HeaderCell>
        <Cell>
          {(rowData) => {
            return (
              <>
                {searchParams?.page !== "delivery" ? (
                  <NavLink
                    className="mr-2"
                    href={`/generateReport/${searchParams.oid}?reportGroup=${searchParams.reportGroup}&mode=${searchParams.mode}&reportType=${reportGroupData?.data?.testResultType}&test=${rowData?.test?._id}&oid=${searchParams.oid}`}
                  >
                    <Button
                      // eslint-disable-next-line react/no-children-prop
                      children={<CheckIcon className="text-lg" />}
                      appearance="primary"
                      color="blue"
                      size="sm"
                    />
                  </NavLink>
                ) : (
                  <Button
                    // eslint-disable-next-line react/no-children-prop
                    children={<CheckIcon className="text-lg" />}
                    appearance="primary"
                    color="blue"
                    size="sm"
                    onClick={() =>
                      statusChangeHandler({
                        oid: searchParams?.oid,
                        reportGroupLabel: reportGroupData?.data?.label,
                        reportType: reportGroupData?.data?.testResultType,
                        test: rowData?.test?._id,
                      })
                    }
                    loading={
                      statusLoading || reportGroupLoading || orderDataLoading
                    }
                    disabled={
                      statusLoading || reportGroupLoading || orderDataLoading
                    }
                  />
                )}
              </>
            );
          }}
        </Cell>
      </Column>

      {page !== "delivery" &&
      reportGroupData?.data?.testResultType == "parameter" ? (
        <Column flexGrow={1}>
          <HeaderCell>Select</HeaderCell>
          <Cell>
            {(rowdata) => {
              return (
                <Checkbox
                  color="blue"
                  value={rowdata?.test?._id}
                  onChange={(v1, v2) => {
                    if (v2) {
                      setTestIds(
                        (prevValue) =>
                          [
                            ...prevValue,
                            rowdata?.test?._id?.toString(),
                          ] as never[]
                      );
                    } else {
                      setTestIds(
                        (testIds?.filter(
                          (id) => id !== rowdata?.test?._id?.toString()
                        ) ?? []) as never[]
                      );
                    }
                  }}
                  defaultChecked
                />
              );
            }}
          </Cell>
        </Column>
      ) : (
        <></>
      )}
    </Table>
  );
};

export default TestTable;
