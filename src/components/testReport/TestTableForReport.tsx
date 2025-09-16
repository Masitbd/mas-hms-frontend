/* eslint-disable react/no-children-prop */

import { IReportGroup, ITest } from "@/types/allDepartmentInterfaces";

import EditIcon from "@rsuite/icons/Edit";
import VisibleIcon from "@rsuite/icons/Visible";
import { useEffect, useState } from "react";
import { Button, Table, Tag } from "rsuite";
import { IOrderData } from "../order/initialDataAndTypes";
import CheckIcon from "@rsuite/icons/Check";
import {
  useGetSingleReportGroupQuery,
  useLazyGetSingleReportGroupQuery,
} from "@/redux/api/reportGroup/reportGroupSlice";
import FileDownloadIcon from "@rsuite/icons/FileDownload";
import { NavLink } from "@/utils/Navlink";
import { ENUM_TEST_STATUS } from "@/enum/testStatusEnum";
import swal from "sweetalert";
import { useSingleStatusChangerMutation } from "@/redux/api/order/orderSlice";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import { useRouter } from "next/navigation";
import { ENUM_REPORT_TYPE } from "@/enum/ENUMReportType";

const TestTableForReport = (props: { data: IOrderData }) => {
  const router = useRouter();
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
            // useing for refunded tests
            if (data?.status == ENUM_TEST_STATUS.REFUNDED) {
              return;
            }
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

  const statusChanger = async (params: IReportGroup) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure You want to change the stats? This cannot be undone",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      router.push(
        `/test-report-selector?oid=${props.data.oid}&reportGroup=${params?._id}&page=delivery`
      );
    }
  };

  const newButtonProvider = ({
    status,
    testResultType,
    rowData,
  }: {
    status: string;
    testResultType: string;
    rowData: { _id: string };
  }) => {
    const component = (
      <NavLink
        className="mr-2"
        href={`/test-report-selector?oid=${props.data.oid}&reportGroup=${rowData._id}&mode=new`}
      >
        <Button
          children={<EditIcon className="text-lg" />}
          appearance="primary"
          color="blue"
          size="sm"
          title="NEW"
        />
      </NavLink>
    );
    return component;
  };

  const otherButtonProvider = (rowData: any) => {
    const status = reportCompletionStatus[rowData?._id];
    const component = (
      <div>
        <AuthCheckerForComponent
          requiredPermission={[ENUM_USER_PEMISSION.GET_LAB_REPORTS]}
        >
          <NavLink
            href={`/test-report-selector?oid=${props.data.oid}&reportGroup=${rowData._id}&mode=view`}
          >
            <Button
              // eslint-disable-next-line react/no-children-prop
              children={<VisibleIcon />}
              title="View and Download"
              appearance="ghost"
              size="sm"
              className="mr-2"
              color="green"
            />
          </NavLink>
        </AuthCheckerForComponent>
        {reportCompletionStatus[rowData._id] !== "delivered" ? (
          <AuthCheckerForComponent
            requiredPermission={[ENUM_USER_PEMISSION.MANAGE_LAB_REPORTS]}
          >
            <>
              <NavLink
                href={`/test-report-selector?oid=${props.data.oid}&reportGroup=${rowData._id}&mode=edit`}
              >
                <Button
                  children={<EditIcon />}
                  appearance="primary"
                  color="green"
                  size="sm"
                  title="Update"
                />
              </NavLink>{" "}
              <Button
                // eslint-disable-next-line react/no-children-prop
                onClick={() => statusChanger(rowData as IReportGroup)}
                children={<CheckIcon />}
                title="Delivered"
                appearance="ghost"
                size="sm"
                className="ml-2"
                color="green"
              />
            </>
          </AuthCheckerForComponent>
        ) : (
          ""
        )}
      </div>
    );

    if (
      rowData?.testResultType == ENUM_REPORT_TYPE.PARAMETER &&
      status !== ENUM_TEST_STATUS.PENDING &&
      status !== ENUM_TEST_STATUS.REFUNDED
    ) {
      return component;
    }

    if (rowData?.testResultType !== ENUM_REPORT_TYPE.PARAMETER) {
      return component;
    } else {
      return <></>;
    }
  };

  useEffect(() => {
    reportGroupDataSorter().then(() => {
      reportGroupDataFeatcher();
    });
  }, []);

  console.log(reportGroupData);
  return (
    <div>
      <div className="">
        <div className="">
          <Table
            loading={reportGroupDataLoading}
            data={reportGroupData?.sort((a, b) =>
              a.label.localeCompare(b.label)
            )}
            bordered
            cellBordered
            autoHeight
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
                      <div>
                        <AuthCheckerForComponent
                          requiredPermission={[
                            ENUM_USER_PEMISSION.MANAGE_LAB_REPORTS,
                          ]}
                        >
                          {
                            newButtonProvider({
                              status: reportCompletionStatus[rowData._id],
                              rowData: rowData as { _id: string },
                              testResultType: rowData?.testResultType,
                            }) as any
                          }
                        </AuthCheckerForComponent>
                      </div>
                      {otherButtonProvider(rowData)}
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
