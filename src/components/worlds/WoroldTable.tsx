"use client";

import React from "react";
import { Table } from "rsuite";
const { Column, HeaderCell, Cell } = Table;

type TWorld = {
  worldName: string;
  charge: number;
  fees: number;
};

type TWorldTable = {
  worldData: { data: TWorld[] };
  isLoading: boolean;
};

const WoroldTable: React.FC<TWorldTable> = ({ worldData, isLoading }) => {
  return (
    <div className="mt-20">
      <Table
        data={worldData?.data}
        loading={isLoading}
        className="w-full"
        bordered
        cellBordered
        autoHeight
        wordWrap={"break-word"}
      >
        <Column align="center" flexGrow={2}>
          <HeaderCell>World Name</HeaderCell>
          <Cell dataKey="worldName" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Charge</HeaderCell>
          <Cell dataKey="charge" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Fees </HeaderCell>
          <Cell dataKey="fees" />
        </Column>
      </Table>
    </div>
  );
};

export default WoroldTable;
