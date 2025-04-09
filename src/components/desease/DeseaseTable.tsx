import React from "react";
import { Table } from "rsuite";
import { Cell, HeaderCell } from "rsuite-table";
import Column from "rsuite/esm/Table/TableColumn";
import EditDeseaseModal from "./EditDeseaseModal";

const DeseaseTable = ({
  item,
  isLoading,
}: {
  item: { data: { name: string }[] };
  isLoading: boolean;
}) => {
  return (
    <div className="mt-20">
      <Table
        data={item?.data}
        loading={isLoading}
        className="w-full"
        bordered
        cellBordered
        autoHeight
        wordWrap={"break-word"}
      >
        <Column align="center" flexGrow={2}>
          <HeaderCell>Desease Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column align="center" flexGrow={2}>
          <HeaderCell>Desease Name</HeaderCell>
          <Cell>
            {(rowData: { name: string }) => <EditDeseaseModal item={rowData} />}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default DeseaseTable;
