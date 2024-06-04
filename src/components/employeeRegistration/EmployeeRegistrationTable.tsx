import { IEmployeeRegistration } from "@/app/(withlayout)/employeeRegistration/page";
import {
  useDeleteemployeeRegistrationMutation,
  useGetemployeeRegistrationQuery,
} from "@/redux/api/employeeRegistration/employeeRegistrationSlice";
import React, { useEffect, useState } from "react";
import VisibleIcon from "@rsuite/icons/Visible";
import { Button, Form, Table, toaster, Message } from "rsuite";
import AlartDialog from "../ui/AlertModal";

const { Column, HeaderCell, Cell } = Table;
const EmployeeRegistrationTable = ({
  patchHandler,
}: {
  patchHandler: (data: { data: IEmployeeRegistration; mode: string }) => void;
}) => {
  const [searchData, setSearchData] = useState({ searchTerm: "" });
  const {
    data: employeeData,
    isLoading: employeeLoading,
    isError: emmployeeError,
  } = useGetemployeeRegistrationQuery(searchData);

  // For delete
  const [deleteData, setDeleteData] = useState<string | undefined>();
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleteTest, { isSuccess: deleteSuccess, isError: deleteError }] =
    useDeleteemployeeRegistrationMutation();

  const handleDeletOpen = (id: string) => {
    setDeleteOpen(!deleteOpen);
    setDeleteData(id);
    console.log("Come from delete", deleteOpen);
  };

  const okHandler = () => {
    deleteTest(deleteData?.toString() || "");
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
  return (
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
      <Table
        height={650}
        data={employeeData?.data.data as IEmployeeRegistration[]}
        loading={employeeLoading}
        className="w-full"
        bordered
        cellBordered
        rowHeight={60}
      >
        <Column resizable flexGrow={1}>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="label" />
        </Column>
        <Column resizable flexGrow={1}>
          <HeaderCell>Father Name</HeaderCell>
          <Cell dataKey="fatherName" />
        </Column>
        <Column resizable flexGrow={1}>
          <HeaderCell>Phone Number</HeaderCell>
          <Cell dataKey="phoneNo" />
        </Column>
        <Column resizable flexGrow={1}>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>
        <Column flexGrow={2} resizable>
          <HeaderCell>Action</HeaderCell>
          <Cell>
            {(rowdata) => (
              <>
                <Button
                  appearance="ghost"
                  color="red"
                  onClick={() => handleDeletOpen(rowdata._id)}
                >
                  Delete
                </Button>
                <Button
                  appearance="ghost"
                  color="blue"
                  className="ml-2"
                  onClick={() =>
                    patchHandler({
                      data: rowdata as IEmployeeRegistration,
                      mode: "patch",
                    })
                  }
                >
                  Edit
                </Button>
                <Button
                  // appearance="transparent"
                  className="ml-2"
                  startIcon={<VisibleIcon />}
                  onClick={() => {
                    patchHandler({
                      data: rowdata as IEmployeeRegistration,
                      mode: "watch",
                    });
                  }}
                />
              </>
            )}
          </Cell>
        </Column>
      </Table>
      <div>
        <AlartDialog
          description="Are you sure you want to delete this Employee "
          title="Delete Employee"
          onCancel={cancelHandler}
          onOk={okHandler}
          open={deleteOpen}
        />
      </div>
    </div>
  );
};

export default EmployeeRegistrationTable;
