import {
  useDeleteTestMutation,
  useGetTestsQuery,
} from "@/redux/api/test/testSlice";
import React, { useEffect, useState } from "react";
import { Button, Message, Table, toaster } from "rsuite";
import AlartDialog from "../ui/AlertModal";

const { Column, HeaderCell, Cell } = Table;
const TestTable = ({ patchHandler }) => {
  const {
    data: testData,
    isLoading: testLoading,
    isError: TesError,
  } = useGetTestsQuery(undefined);

  // For delete
  const [deleteData, setDeleteData] = useState();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTest, { isSuccess: deleteSuccess, isError: deleteError }] =
    useDeleteTestMutation();
  const handleDeletOpen = (id) => {
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

  // For patch
  const [patchData, setPatchData] = useState();
  const [patchModalOpen, setPatchModalOpen] = useState(false);
  const pachOpenHandler = (data) => {
    patchHandler(data);
  };

  return (
    <div>
      <Table
        height={420}
        data={testData?.data.data}
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
                  onClick={() => patchHandler(rowdate)}
                >
                  Edit
                </Button>
              </>
            )}
          </Cell>
        </Column>

        {/* <Column width={200} resizable>
          <HeaderCell>City</HeaderCell>
          <Cell dataKey="city" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column> */}
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
