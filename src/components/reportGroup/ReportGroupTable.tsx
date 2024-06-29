import React from "react";
import { Table } from "rsuite";

const ReportGroupTable = () => {
  const { Cell, Column, HeaderCell } = Table;
  return (
    <div>
      <Table>
        <Column align="center" resizable flexGrow={1}>
          <HeaderCell>Test Code</HeaderCell>
          <Cell dataKey="testCode" />
        </Column>
      </Table>
    </div>
  );
};

export default ReportGroupTable;
