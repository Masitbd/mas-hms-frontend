import {
  useDeleteTestMutation,
  useGetTestsQuery,
} from "@/redux/api/test/testSlice";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Button, Form, Message, Table, toaster } from "rsuite";
import AlartDialog from "../ui/AlertModal";
import VisibleIcon from "@rsuite/icons/Visible";
import { ITest } from "@/types/allDepartmentInterfaces";

const { Column, HeaderCell, Cell } = Table;
const TestTable = ({
  patchHandler,
}: {
  patchHandler: (data: { data: ITest; mode: string }) => void;
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
  } = useGetTestsQuery(searchData);

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
        data={testData?.data.data as ITest[]}
        loading={testLoading}
        className="w-full"
        bordered
        cellBordered
        rowHeight={60}
      >
        <Column align="center" resizable flexGrow={1}>
          <HeaderCell>Test Code</HeaderCell>
          <Cell dataKey="testCode" />
        </Column>

        <Column resizable flexGrow={4}>
          <HeaderCell>Title</HeaderCell>
          <Cell dataKey="label" />
        </Column>
        <Column resizable flexGrow={1}>
          <HeaderCell>Department</HeaderCell>
          <Cell dataKey="department.label" />
        </Column>
        <Column resizable flexGrow={1}>
          <HeaderCell>Price</HeaderCell>
          <Cell dataKey="price" />
        </Column>
        <Column resizable flexGrow={1}>
          <HeaderCell>Type</HeaderCell>
          <Cell dataKey="type" />
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
                    patchHandler({ data: rowdate as ITest, mode: "patch" })
                  }
                >
                  Edit
                </Button>
                <Button
                  // appearance="transparent"
                  className="ml-2"
                  startIcon={<VisibleIcon />}
                  onClick={() => {
                    patchHandler({ data: rowdate as ITest, mode: "watch" });
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

export default TestTable;
