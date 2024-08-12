"use client";
import { IDoctor } from "@/types/allDepartmentInterfaces";

import {
  useDeleteDoctorMutation,
  useGetDoctorQuery,
} from "@/redux/api/doctor/doctorSlice";
import { TableType } from "@/types/componentsType";
import VisibleIcon from "@rsuite/icons/Visible";
import { useState } from "react";
import { Button, Form, Pagination, Table } from "rsuite";
import swal from "sweetalert";

export type ISearchTermType = {
  searchTerm: string;
};

const { Column, HeaderCell, Cell } = Table;
const DoctorsTable = ({
  setPatchData,
  setMode,
  open,
  setPostModelOpen,
}: TableType<IDoctor>) => {
  const [searchData, setSearchData] = useState<ISearchTermType>({
    searchTerm: "",
  });
  const { data: defaultData, isLoading } = useGetDoctorQuery(searchData);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const handleChangeLimit = (dataKey: React.SetStateAction<number>) => {
    setPage(1);
    setLimit(dataKey);
  };

  const data = defaultData?.data.filter((v: any, i: number) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  });
  console.log(data);
  //   For delete
  const [deleteItem] = useDeleteDoctorMutation();

  const deleteHandler = async (id: string) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Doctor!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const result = await deleteItem(id);
        console.log(result, "delete result");
        if ("error" in result) {
          const errorMessage = (
            result as { error: { data: { message: string } } }
          )?.error.data.message;
          swal(errorMessage, {
            icon: "warning",
          });
        }
        if ("data" in result) {
          const message = (result as { data: { message: string } })?.data
            .message;
          swal(`Done! ${message}!`, {
            icon: "success",
          });
        }
      } else {
        swal("Your doctor is safe!");
      }
    });
  };

  return (
    <div>
      <div className="my-5">
        <Form
          onChange={(formValue: Record<string, any>) => {
            setSearchData({ searchTerm: formValue.searchTerm });
          }}
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
        height={600}
        data={data}
        loading={isLoading}
        bordered
        cellBordered
        rowHeight={65}
        className="text-md"
      >
        <Column flexGrow={2}>
          <HeaderCell>{"Doctor's name"}</HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>{"Code"}</HeaderCell>
          <Cell dataKey="code" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>{"Doctor's father name"}</HeaderCell>
          <Cell dataKey="fatherName" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell>{"Doctor's Designation"}</HeaderCell>
          <Cell dataKey="designation" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>{"Doctor's Email"}</HeaderCell>
          <Cell dataKey="email" />
        </Column>
        <Column flexGrow={3}>
          <HeaderCell>{"Doctor's phone number"}</HeaderCell>
          <Cell dataKey="phone" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Action</HeaderCell>
          <Cell align="center">
            {(rowdate) => (
              <>
                <Button
                  appearance="ghost"
                  color="red"
                  onClick={() => deleteHandler(rowdate._id)}
                >
                  Delete
                </Button>
                <Button
                  appearance="ghost"
                  color="blue"
                  className="ml-2"
                  onClick={() => {
                    setPatchData(rowdate as IDoctor);
                    setPostModelOpen(!open);
                    setMode("patch");
                  }}
                >
                  Edit
                </Button>
                <Button
                  // appearance="transparent"
                  className="ml-2"
                  startIcon={<VisibleIcon />}
                  onClick={() => {
                    setPatchData(rowdate as IDoctor);
                    setPostModelOpen(!open);
                    setMode("watch");
                  }}
                />
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
          total={defaultData?.data.length}
          limitOptions={[10, 30, 50]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
    </div>
  );
};

export default DoctorsTable;
