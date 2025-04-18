"use client";
import { Table, Button } from "rsuite";
import VisibleIcon from "@rsuite/icons/Visible";
import Link from "next/link";
const { Column, HeaderCell, Cell } = Table;

export type TAdmitedPatient = {
  _id: string;
  regNo: string;
  name: string;
  gender: string;
  fatherName: string;
  presentAddress: string;
  permanentAddress: string;
  age: string;
  maritalStatus: string;
  occupation: string;
  education: string;
  residence: string;
  citizenShip: string;
  religion: string;
  bloodGroup: string;
  district: string;
  phone: string;
  status: string;
  disease: string;
  isTransfer: boolean;
  admissionDate: string;
  admissionTime: string;
  releaseDate: string;
};

const AdmissionTable = ({ data }: { data: TAdmitedPatient[] }) => {
  console.log(data, "data in table");

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
        <Column flexGrow={1} align="center" fixed>
          <HeaderCell>OID</HeaderCell>
          <Cell dataKey="regNo" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Admission Date</HeaderCell>
          <Cell>
            {(rowData) =>
              rowData?.admissionDate
                ? new Date(rowData?.admissionDate).toLocaleDateString()
                : "N/A"
            }
          </Cell>
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Time</HeaderCell>
          <Cell>
            {(rowData) =>
              rowData?.admissionDate
                ? new Date(rowData.admissionDate).toLocaleTimeString()
                : "N/A"
            }
          </Cell>
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Bed</HeaderCell>
          <Cell dataKey="allocatedBed.bedName" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Status</HeaderCell>
          <Cell dataKey="status" />
        </Column>

        <Column flexGrow={1} fixed="right">
          <HeaderCell> Action </HeaderCell>

          <Cell style={{ padding: "6px" }}>
            {(rowData) => (
              <Button appearance="link">
                <Link href={`/admission/${rowData._id}`}>
                  <VisibleIcon className="text-lg" />
                </Link>
              </Button>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default AdmissionTable;
