import { useGetOrderQuery } from "@/redux/api/order/orderSlice";
import {
  useDeleteTestMutation
} from "@/redux/api/test/testSlice";
import { setId } from "@/redux/features/IdStore/idSlice";
import { ITest } from "@/types/allDepartmentInterfaces";
import VisibleIcon from "@rsuite/icons/Visible";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, InputPicker, Message, Table, toaster } from "rsuite";
import AlartDialog from "../ui/AlertModal";
const { Column, HeaderCell, Cell } = Table;


const OrderTable = ({
  patchHandler,
}: {
  patchHandler?: (data: { data: ITest; mode: string }) => void;
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
  } = useGetOrderQuery(searchData);


  const dispatch = useDispatch()





  return (
    <div >
      <div className="my-5">
        <Form
          onChange={(formValue: Record<string, any>) =>
            setSearchData({ searchTerm: formValue.searchTerm })
          }
          className="grid grid-cols-4 gap-5 justify-center w-full"
          fluid
        >
          <Form.Group controlId="searchTerm">
            <Form.ControlLabel>Search</Form.ControlLabel>
            <Form.Control name="searchTerm" />
          </Form.Group>
          <Form.Group controlId="patientType">
            <Form.ControlLabel>Patien Type</Form.ControlLabel>
            <Form.Control
              name="patientType"
              accepter={InputPicker}
              data={[
                { label: "Registered", value: "registered" },
                { label: "Not Registered", value: "notRegistered" },
              ]}
            />
          </Form.Group>
          <Form.Group controlId="sortBy">
            <Form.ControlLabel>Sort By</Form.ControlLabel>
            <Form.Control
              name="sortBy"
              accepter={InputPicker}
              data={[
                { label: "Creation Date", value: "cDate" },
                { label: "Delivery Date", value: "dDate" },

                { label: "Due Amount", value: "dueAmount" },
                { label: "Total Price", value: "totalPrice" },
              ]}
            />
          </Form.Group>
          <Form.Group controlId="sortOrder">
            <Form.ControlLabel>Sort order</Form.ControlLabel>
            <Form.Control
              name="sortOrder"
              accepter={InputPicker}
              data={[
                { label: "Aescending", value: "aesc" },
                { label: "Descending", value: "desc" },
              ]}
            />
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
          <HeaderCell>Order Id</HeaderCell>
          <Cell dataKey="oid" />
        </Column>

        <Column resizable flexGrow={3}>
          <HeaderCell>User </HeaderCell>
          <Cell dataKey="uuid" />
        </Column>
        <Column resizable flexGrow={2}>
          <HeaderCell>Patient Type</HeaderCell>
          <Cell dataKey="patientType" />
        </Column>
        <Column resizable flexGrow={1}>
          <HeaderCell>Delivary Date</HeaderCell>
          <Cell dataKey="deliveryTime" />
        </Column>
        <Column resizable flexGrow={1}>
          <HeaderCell>Due Amount</HeaderCell>
          <Cell dataKey="dueAmount" className="text-red-600" />
        </Column>
        <Column resizable flexGrow={1}>
          <HeaderCell>Status</HeaderCell>
          <Cell>
            {(rowdata) => (
              <>
                <span
                  color={"green"}
                  className={
                    rowdata.status === "pending"
                      ? "text-red-500"
                      : "text-green-500"
                  }
                >
                  {rowdata.status}
                </span>
              </>
            )}
          </Cell>
        </Column>

        <Column flexGrow={3} resizable>
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
                    dispatch(setId(rowdate._id));
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

export default OrderTable;
