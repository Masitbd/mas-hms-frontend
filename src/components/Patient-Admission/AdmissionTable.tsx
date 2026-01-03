"use client";
import { Table, Button, Loader } from "rsuite";
import VisibleIcon from "@rsuite/icons/Visible";
import Link from "next/link";
import EditIcon from "@rsuite/icons/Edit";

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

const AdmissionTable = ({
  data,
  isLoading,
  isFetching,
}: {
  data: TAdmitedPatient[];
  isLoading: boolean;
  isFetching: boolean;
}) => {
  return (
    <div className="w-full">
      {isLoading || isFetching ? (
        <Loader className="w-full" content="Loading..." />
      ) : (
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
                <div className="flex">
                  <Button appearance="link">
                    <Link href={`/admission/old?id=${rowData._id}`}>
                      <VisibleIcon className="text-lg" />
                    </Link>
                  </Button>

                  <Button appearance="ghost" color="green">
                    <Link href={`/admission/edit?id=${rowData._id}`}>
                      <EditIcon color="green" />
                    </Link>
                  </Button>
                </div>
              )}
            </Cell>
          </Column>
        </Table>
      )}
    </div>
  );
};

export default AdmissionTable;
