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
  data: { _id: string; tests: ITest[] }[];
  loading: boolean;
  featching: boolean;
}) => {
  const { Cell, Column, HeaderCell } = Table;
  const [tData, setTData] = useState<Partial<ITest>[]>([]);

  useEffect(() => {
    if (data?.length) {
      const processedData: Partial<ITest>[] = [];

      data?.map((d) => {
        const dd = {
          testCode: d?._id,
        };
        const td = d.tests;
        processedData.push(dd, ...td);
      });

      setTData(processedData as Partial<ITest>[]);
    }
  }, [data, loading, featching]);

  return (
    <div>
      <Table
        shouldUpdateScroll={false}
        loading={loading || featching}
        data={tData}
        autoHeight
      >
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
  );
};

export default AllTestsTable;
