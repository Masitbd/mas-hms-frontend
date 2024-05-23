import {
  useDeleteTestMutation,
  useGetTestsQuery,
} from "@/redux/api/test/testSlice";
import React, { SyntheticEvent, useEffect, useState } from "react";
import {
  Button,
  Form,
  InputPicker,
  Message,
  Pagination,
  Table,
  toaster,
} from "rsuite";
import AlartDialog from "../ui/AlertModal";
import VisibleIcon from "@rsuite/icons/Visible";
import { ITest } from "@/types/allDepartmentInterfaces";
import { useGetPatientQuery } from "@/redux/api/patient/patientSlice";
import { useGetOrderQuery } from "@/redux/api/order/orderSlice";
import { IOrderData } from "@/app/(withlayout)/order/page";

const { Column, HeaderCell, Cell } = Table;
const OrderTable = ({
  patchHandler,
}: {
  patchHandler?: (data: { data: IOrderData; mode: string }) => void;
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
  const [searchData, setSearchData] = useState({
    sortBy: "createdAt",
    sortOrder: -1,
    patientType: "all",
    limit: 10,
  });
  const {
    data: testData,
    isLoading: testLoading,
    isError: TesError,
  } = useGetOrderQuery(searchData);
  return (
    <div>
      <div className="my-5">
        <Form
          onChange={(formValue, event) =>
            setSearchData((preValue) => ({ ...preValue, ...formValue }))
          }
          className="grid grid-cols-4 gap-5 justify-center w-full"
          fluid
        >
          <Form.Group controlId="searchTerm">
            <Form.ControlLabel>Search</Form.ControlLabel>
            <Form.Control name="searchTerm" />
          </Form.Group>

          <Form.Group controlId="patientType">
            <Form.ControlLabel>Patient Type</Form.ControlLabel>
            <Form.Control
              name="patientType"
              accepter={InputPicker}
              data={[
                { label: "Registered", value: "registered" },
                { label: "Not Registered", value: "notRegistered" },
                { label: "All", value: "all" },
              ]}
              defaultValue={"all"}
            />
          </Form.Group>
          <Form.Group controlId="sortBy">
            <Form.ControlLabel>Sort By</Form.ControlLabel>
            <Form.Control
              name="sortBy"
              accepter={InputPicker}
              data={[
                { label: "Creation Date", value: "createdAt" },
                { label: "Delivery Date", value: "deliveryTime" },

                { label: "Due Amount", value: "dueAmount" },
                { label: "Total Price", value: "totalPrice" },
              ]}
              defaultValue={"createdAt"}
            />
          </Form.Group>
          <Form.Group controlId="sortOrder">
            <Form.ControlLabel>Sort order</Form.ControlLabel>
            <Form.Control
              name="sortOrder"
              accepter={InputPicker}
              data={[
                { label: "Aescending", value: 1 },
                { label: "Descending", value: -1 },
              ]}
              defaultValue={-1}
            />
          </Form.Group>
        </Form>
      </div>
      <Table
        height={500}
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
        <Column resizable flexGrow={2}>
          <HeaderCell>UUID</HeaderCell>
          <Cell dataKey="uuid" />
        </Column>
        <Column resizable flexGrow={2}>
          <HeaderCell>Name </HeaderCell>
          <Cell dataKey="patient.name" />
        </Column>
        <Column resizable flexGrow={2}>
          <HeaderCell>Patient Type</HeaderCell>
          <Cell dataKey="patientType" />
        </Column>
        <Column resizable flexGrow={1}>
          <HeaderCell>Delivery Date</HeaderCell>
          <Cell dataKey="deliveryTime" />
        </Column>
        <Column resizable flexGrow={1}>
          <HeaderCell>Due Amount</HeaderCell>
          <Cell dataKey="dueAmount" className="text-red-600" />
        </Column>
        <Column resizable flexGrow={1}>
          <HeaderCell>Total Price</HeaderCell>
          <Cell dataKey="totalPrice" className="text-red-600" />
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
                  // appearance="transparent"
                  className="ml-2"
                  startIcon={<VisibleIcon />}
                  onClick={() => {
                    if (patchHandler) {
                      patchHandler({
                        data: rowdate as IOrderData,
                        mode: "watch",
                      });
                    }
                  }}
                />
              </>
            )}
          </Cell>
        </Column>
      </Table>
      <div className="w-[90%] mt-5 mx-auto">
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="xs"
          layout={["total", "-", "limit", "|", "pager", "skip"]}
          total={testData?.meta.total}
          limitOptions={[10, 30, 50]}
          limit={testData?.meta?.limit}
          activePage={testData?.meta?.page}
          onChangePage={(page: number) =>
            setSearchData((prevData) => ({ ...prevData, page: page }))
          }
          onChangeLimit={(limit: number) =>
            setSearchData((prevData) => ({ ...prevData, limit: limit }))
          }
        />
      </div>
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
