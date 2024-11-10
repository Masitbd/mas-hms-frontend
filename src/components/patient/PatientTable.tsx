import { IPatient1 } from "@/app/(withlayout)/patient/page";
import { useGetPatientQuery } from "@/redux/api/patient/patientSlice";
import {
  useDeleteTestMutation
} from "@/redux/api/test/testSlice";
import VisibleIcon from "@rsuite/icons/Visible";
import { useEffect, useState } from "react";
import { Button, Form, Message, Table, toaster } from "rsuite";
import AlartDialog from "../ui/AlertModal";

const { Column, HeaderCell, Cell } = Table;
const PatientTable = ({
  patchHandler,
}: {
  patchHandler: (data: { data: IPatient1; mode: string }) => void;
}) => {
  // For delete
  const [deleteData, setDeleteData] = useState<string>();
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleteTest, { isSuccess: deleteSuccess, isError: deleteError }] =
    useDeleteTestMutation();
  const handleDeletOpen = (id: string) => {
    setDeleteOpen(!deleteOpen);
    setDeleteData(id);
  };
  const okHandler = () => {
    deleteTest(deleteData);
    setDeleteOpen(!deleteOpen);
  };
  const cancelHandler = () => {
    setDeleteOpen(!deleteOpen);
    setDeleteData(undefined);
  };

  useEffect(() => {
    if (deleteSuccess) {
      toaster.push(
        <Message type="success">Operation completed Successfully</Message>
      );
    }
    if (deleteError) {
      toaster.push(
        <Message type="error">
          Somethng went wrong. please try again letter
        </Message>
      );
    }
  }, [deleteSuccess, deleteError]);
  // For search
  const [searchData, setSearchData] = useState({ searchTerm: "" });
  const {
    data: testData,
    isLoading: testLoading,
    isError: TesError,
  } = useGetPatientQuery(searchData);
  console.log(testData);
  return (
    <div>
      <div className="my-5">
        <Form
          onChange={(formValue: Record<string, any>) =>
            setSearchData({ searchTerm: formValue.searchTerm })
          }
          className="grid grid-cols-1 gap-5 justify-center w-full"
          fluid
        >
          <Form.Group controlId="searchTerm">
            <Form.ControlLabel>Search</Form.ControlLabel>
            <Form.Control name="searchTerm" htmlSize={100} />
          </Form.Group>
        </Form>
      </div>
      <Table
        height={650}
        data={testData?.data}
        loading={testLoading}
        className="w-full"
        bordered
        cellBordered
        rowHeight={60}
      >
        <Column align="center" resizable flexGrow={2}>
          <HeaderCell>User Id</HeaderCell>
          <Cell dataKey="uuid" />
        </Column>

        <Column resizable flexGrow={4}>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column resizable flexGrow={1}>
          <HeaderCell>Phone</HeaderCell>
          <Cell dataKey="phone" />
        </Column>
        <Column resizable flexGrow={1}>
          <HeaderCell>Gender</HeaderCell>
          <Cell dataKey="gender" />
        </Column>

        <Column flexGrow={2} resizable>
          <HeaderCell>Action</HeaderCell>
          <Cell>
            {(rowdate) => (
              <>
                <Button
                  appearance="ghost"
                  color="red"
                  onClick={() => handleDeletOpen(rowdate._id)}
                >
                  Delete
                </Button>
                <Button
                  appearance="ghost"
                  color="blue"
                  className="ml-2"
                  onClick={() =>
                    patchHandler({ data: rowdate as IPatient1, mode: "patch" })
                  }
                >
                  Edit
                </Button>
                <Button
                  // appearance="transparent"
                  className="ml-2"
                  startIcon={<VisibleIcon />}
                  onClick={() => {
                    patchHandler({ data: rowdate as IPatient1, mode: "watch" });
                  }}
                />
              </>
            )}
          </Cell>
        </Column>
      </Table>
      <div>
        <AlartDialog
          description="Are you sure you want to delete this code "
          title="Delete TEst"
          onCancel={cancelHandler}
          onOk={okHandler}
          open={deleteOpen}
        />
      </div>
    </div>
  );
};

export default PatientTable;
