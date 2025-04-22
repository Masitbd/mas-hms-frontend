"use client";

import React from "react";
import { Table } from "rsuite";
import EditBedModal from "./EditBedModal";
const { Column, HeaderCell, Cell } = Table;

type TWorld = {
  worldName: string;
  charge: number;
  fees: number;
  bedName:string;
  worldId?: {
    _id: string;
    worldName: string;
  } | null;
};

type TWorldTable = {
  worldData: { data: TWorld[] };
  isLoading: boolean;
};

const BedsTable: React.FC<TWorldTable> = ({ worldData, isLoading }) => {
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
          <HeaderCell>Bed Name</HeaderCell>
          <Cell dataKey="bedName" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Floor</HeaderCell>
          <Cell dataKey="floor" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Phone</HeaderCell>
          <Cell dataKey="phone" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>is Allocated</HeaderCell>
          <Cell>
            {(rowData) => (
              <span
                className={
                  rowData?.isAllocated ? "text-red-600" : "text-green-500"
                }
              >
                {rowData?.isAllocated ? "Allocated" : "Not Allocated"}
              </span>
            )}
          </Cell>
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>World Name</HeaderCell>
          <Cell>
            {(rowData) => (rowData.worldId ? rowData.worldId.worldName : "N/A")}
          </Cell>
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Action</HeaderCell>
          <Cell>
            {(rowData) => (
              <div className="flex items-center">
                <EditBedModal item={rowData} />
              </div>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default BedsTable;
