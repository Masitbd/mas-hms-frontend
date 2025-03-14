"use client";
import { Table, Button } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const AdmissionTable = (data) => {
  return (
    <div className="w-full">
      <Table
        data={data}
        className="w-full"
        bordered
        cellBordered
        autoHeight
        wordWrap={"break-word"}
      >
        <Column  flexGrow={1}align="center" fixed>
          <HeaderCell>OID</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="firstName" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Admission Date</HeaderCell>
          <Cell dataKey="lastName" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Time</HeaderCell>
          <Cell dataKey="gender" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Bed</HeaderCell>
          <Cell dataKey="age" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Status</HeaderCell>
          <Cell dataKey="postcode" />
        </Column>

        <Column  flexGrow={1}fixed="right">
          <HeaderCell> Action </HeaderCell>

          <Cell style={{ padding: "6px" }}>
            {(rowData) => (
              <Button
                appearance="link"
                onClick={() => alert(`id:${rowData.id}`)}
              >
                Edit
              </Button>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default AdmissionTable;
