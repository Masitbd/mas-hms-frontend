/* eslint-disable react/no-children-prop */
import { useGetAllTestsQuery } from "@/redux/api/financialReport/financialReportSlice";
import { ITest } from "@/types/allDepartmentInterfaces";
import React, { useEffect, useState } from "react";
import { IconButton, Table } from "rsuite";
import CollaspedOutlineIcon from "@rsuite/icons/CollaspedOutline";
import ExpandOutlineIcon from "@rsuite/icons/ExpandOutline";

const AllTestsTable = ({
  data,
  loading,
  featching,
}: {
  data: {
    _id: {
      department: string;
      departmentId: string;
      reportGroup: string;
      reportGroupId: string;
    };
    tests: ITest[];
  }[];
  loading: boolean;
  featching: boolean;
}) => {
  const { Cell, Column, HeaderCell } = Table;
  const [tData, setTData] = useState<Partial<ITest>[]>([]);

  // useEffect(() => {
  //   if (data?.length) {
  //     const processedData: Partial<ITest>[] = [];

  //     data?.map((d) => {
  //       const dd = {
  //         testCode: d?._id,
  //       };
  //       const td = d.tests;
  //       processedData.push(dd, ...td);
  //     });

  //     setTData(processedData as Partial<ITest>[]);
  //   }
  // }, [data, loading, featching]);

  return (
    <div>
      {data?.map((d, index) => {
        return (
          <div key={index}>
            <div className="my-5 border  shadow-lg mx-5">
              <div className="bg-[#3498ff] text-white px-2 py-2">
                <h2 className="text-center text-xl font-semibold">
                  {d?._id?.department}{" "}
                  <span className="text-md font-normal">
                    ({d?._id?.reportGroup})
                  </span>
                </h2>
              </div>
              <Table loading={loading || featching} data={d?.tests} autoHeight>
                <Column flexGrow={2}>
                  <HeaderCell children="Code" />
                  <Cell dataKey="testCode" />
                </Column>
                <Column flexGrow={3}>
                  <HeaderCell children="Test Name" />
                  <Cell dataKey="label" />
                </Column>
                <Column flexGrow={1}>
                  <HeaderCell children="price" />
                  <Cell dataKey="price" />
                </Column>
              </Table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllTestsTable;
