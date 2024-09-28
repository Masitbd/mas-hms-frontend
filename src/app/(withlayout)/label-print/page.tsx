"use client";
import { useGetOrderQuery } from "@/redux/api/order/orderSlice";
import { NavLink } from "@/utils/Navlink";
import React, { useState } from "react";
import { Button, Input, Pagination, Table } from "rsuite";
import VisibleIcon from "@rsuite/icons/Visible";

const LabelPrint = () => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;

  const [orderFilter, setOrderFilter] = useState({});
  const { data: orderData, isLoading: orderDataLoading } =
    useGetOrderQuery(orderFilter);

  const handleSearchInput = (event: string) => {
    setOrderFilter({ ...orderFilter, searchTerm: event });
  };

  //pagination
  const [limit, setLimit] = React.useState(20);
  const [page, setPage] = React.useState(1);

  const handleChangeLimit = (dataKey: React.SetStateAction<number>) => {
    setPage(1);
    setLimit(dataKey);
  };

  const data = orderData?.data.filter((v: any, i: number) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  });
  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Orders For Label Printing
          </h2>
        </div>
        <div className="p-2">
          <div className="my-5">
            <Input
              placeholder="Search..."
              onChange={(value) => handleSearchInput(value)}
            />
          </div>
          <div>
            <Table data={data} loading={orderDataLoading} autoHeight bordered>
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
                      <NavLink href={`/label-print/${rowData.oid}`}>
                        <Button appearance="primary" color="green" size="sm">
                          <VisibleIcon className="text-lg" />
                        </Button>
                      </NavLink>
                    </>
                  )}
                </Cell>
              </Column>
            </Table>
            <div style={{ padding: 20 }}>
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
                total={orderData?.data.length}
                limitOptions={[10, 20, 40, 60]}
                limit={limit}
                activePage={page}
                onChangePage={setPage}
                onChangeLimit={handleChangeLimit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelPrint;
