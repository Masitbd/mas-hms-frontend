import { useGetOrderQuery } from "@/redux/api/order/orderSlice";
import React, { useState } from "react";
import { Button, Input, Table } from "rsuite";
import VisibleIcon from "@rsuite/icons/Visible";
import { NavLink } from "@/utils/Navlink";

const OrderTable = () => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;

  const [orderFilter, setOrderFilter] = useState({});
  const { data: orderData, isLoading: orderDataLoading } =
    useGetOrderQuery(orderFilter);

  const handleSearchInput = (event: string) => {
    setOrderFilter({ ...orderFilter, searchTerm: event });
  };
  return (
    <div>
      <div className="my-5">
        <Input
          placeholder="Search..."
          onChange={(value) => handleSearchInput(value)}
        />
      </div>
      <div className="w-full">
        <Table
          data={orderData?.data}
          loading={orderDataLoading}
          height={700}
          bordered
        >
          <Column flexGrow={2}>
            <HeaderCell>OID</HeaderCell>
            <Cell dataKey="oid" />
          </Column>
          <Column flexGrow={3}>
            <HeaderCell>Name</HeaderCell>
            <Cell dataKey="patient.name" />
          </Column>
          <Column flexGrow={2}>
            <HeaderCell>Status</HeaderCell>
            <Cell dataKey="status" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Action</HeaderCell>
            <Cell>
              {(rowData) => (
                <>
                  <NavLink href={`/testReport/${rowData.oid}`}>
                    <Button appearance="primary" color="green" size="sm">
                      <VisibleIcon className="text-lg" />
                    </Button>
                  </NavLink>
                </>
              )}
            </Cell>
          </Column>
        </Table>
      </div>
    </div>
  );
};

export default OrderTable;
