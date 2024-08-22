/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from "react";
import { IOrderData } from "../order/initialDataAndTypes";
import { IReportGroup, ITest } from "@/types/allDepartmentInterfaces";
import EditIcon from "@rsuite/icons/Edit";
import VisibleIcon from "@rsuite/icons/Visible";
import { Button, Table, Tag } from "rsuite";
import {
  useGetSingleReportGroupQuery,
  useLazyGetSingleReportGroupQuery,
} from "@/redux/api/reportGroup/reportGroupSlice";
import FileDownloadIcon from "@rsuite/icons/FileDownload";
import { NavLink } from "@/utils/Navlink";

const TestTableForReport = (props: { data: IOrderData }) => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const [getReportGroup, { isLoading: reportGroupDataLoading }] =
    useLazyGetSingleReportGroupQuery();
  let reportGroupes: string[] = [];
  const [reportGroupData, setReportGroupData] = useState<IReportGroup[]>([]);
  const [reportCompletionStatus, setReportCompletionStatus] = useState<any>({});

  function reportGroupDataSorter() {
    return new Promise<void>((resolve, reject) => {
      props.data.tests.length > 0 &&
        props.data.tests.map((data) => {
          const testData: ITest = data.test as ITest;
          if ("test" in data && "reportGroup" in testData) {
            // for status complete
            const reportGroup = testData.reportGroup;
            setReportCompletionStatus((prevData: any) => ({
              ...prevData,
              [reportGroup]: data.status,
            }));

            if (reportGroupes.includes(testData.reportGroup)) {
              return;
            } else {
              reportGroupes.push(testData.reportGroup);
            }
          }
        });
      resolve();
    });
  }

  async function reportGroupDataFeatcher() {
    if (reportGroupes.length > 0) {
      reportGroupes.forEach(async (data: string) => {
        const result = await getReportGroup(data);
        if ("data" in result) {
          setReportGroupData((prevData) => {
            if (!prevData.some((item) => item?._id === result.data.data._id)) {
              return [...prevData, result.data.data];
            }
            return prevData;
          });
        }
      });
    }
  }

  const testStatusElement = (status: string) => {
    switch (status) {
      case "pending":
        return <Tag color="red">Pending</Tag>;

      case "completed":
        return <Tag color="green">Completed</Tag>;

      case "delivered":
        return <Tag color="blue">Delivered</Tag>;

      case "refunded":
        return <Tag color="orange">REFUNDED</Tag>;
    }
  };

  useEffect(() => {
    reportGroupDataSorter().then(() => {
      reportGroupDataFeatcher();
    });
  }, []);

  return (
    <div>
      <div className="my-10">
        <div className="text-xl font-bold font-serif">Reports To generate</div>
        <hr />
        <div className="my-2 p-2">
          <Table
            loading={reportGroupDataLoading}
            data={reportGroupData}
            bordered
            cellBordered
          >
            <Column flexGrow={4}>
              <HeaderCell>Report Group</HeaderCell>
              <Cell dataKey="label" />
            </Column>
            <Column flexGrow={2}>
              <HeaderCell>Status</HeaderCell>
              <Cell>
                {(rowData) => (
                  <>{testStatusElement(reportCompletionStatus[rowData._id])}</>
                )}
              </Cell>
            </Column>
            <Column flexGrow={4} align="center">
              <HeaderCell>Action</HeaderCell>
              <Cell>
                {(rowData) => {
                  return (
                    <>
                      <div
                        className={`${
                          reportCompletionStatus[rowData._id] == "completed"
                            ? "invisible"
                            : "visible"
                        }`}
                      >
                        <NavLink
                          className="mr-2"
                          href={`/generateReport/${props.data.oid}?reportGroup=${rowData._id}&mode=new`}
                        >
                          <Button
                            children={<EditIcon className="text-lg" />}
                            appearance="primary"
                            color="blue"
                            size="sm"
                          />
                        </NavLink>
                      </div>
                      <div
                        className={`${
                          reportCompletionStatus[rowData._id] == "completed"
                            ? "visible"
                            : "invisible"
                        }`}
                      >
                        <NavLink
                          href={`/generateReport/${props.data.oid}?reportGroup=${rowData._id}&mode=edit`}
                        >
                          <Button
                            children={<EditIcon />}
                            appearance="primary"
                            color="green"
                            size="sm"
                            title="Update"
                          />
                        </NavLink>{" "}
                        <NavLink
                          href={`/generateReport/${props.data.oid}?reportGroup=${rowData._id}&mode=view`}
                        >
                          <Button
                            // eslint-disable-next-line react/no-children-prop
                            children={<VisibleIcon />}
                            title="View and Download"
                            appearance="ghost"
                            size="sm"
                            className="ml-2"
                            color="green"
                          />
                        </NavLink>
                      </div>
                    </>
                  );
                }}
              </Cell>
            </Column>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TestTableForReport;
