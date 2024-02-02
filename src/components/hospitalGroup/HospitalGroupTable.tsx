"use client";

import {  IHospitalGroup } from "@/types/allDepartmentInterfaces";
import { useState } from "react";
import { Button, Pagination, Table } from "rsuite";
import swal from "sweetalert";

import { useDeleteHospitalGroupMutation, useGetHospitalGroupQuery } from "@/redux/api/hospitalGroup/hospitalGroupSlice";
import NewHospitalGroup from "./NewHospitalGroup";


const { Column, HeaderCell, Cell } = Table;
const HospitalGroupTable = () => {
  const { data: defaultData, isLoading } = useGetHospitalGroupQuery(undefined);
  console.log(defaultData);

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
  const [
    deleteItem
  ] = useDeleteHospitalGroupMutation();

  const deleteHandler = async (id: string) => {

    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Hospital Group!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {

        const result = await deleteItem(id)
        console.log(result, 'delete result')
        if ('error' in result) {
          const errorMessage = (result as { error: { data: { message: string } } })?.error.data.message;
          swal(errorMessage, {
            icon: "warning",
          });
        }
        if ('data' in result) {
          const message = (result as { data: { message: string } })?.data.message;
          swal(`Done! ${message}!`, {
            icon: "success",
          })
        }
      } else {
        swal("Your hospital group is safe!");
      }
    })
  };

  // For patch
  const [patchModalOpen, setPatchModalOpen] = useState(false);
  const [patchData, setPatchData] = useState<IHospitalGroup>();



  return (
    <div>
      <Table
        height={600}
        data={data}
        loading={isLoading}
        bordered
        cellBordered
        rowHeight={65}
        className="text-md"
      >
        <Column flexGrow={1}>
          <HeaderCell>Title</HeaderCell>
          <Cell dataKey="label" />
        </Column>
        <Column flexGrow={4}>
          <HeaderCell>Description</HeaderCell>
          <Cell dataKey="description" />
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
                    setPatchData(rowdate as IHospitalGroup);
                    setPatchModalOpen(!patchModalOpen)
                  }}
                >
                  Edit
                </Button>
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
      <div>
        <NewHospitalGroup
          defaultData={patchData}
          open={patchModalOpen} setPostModelOpen={setPatchModalOpen}
        />
      </div>
    </div>
  );
};

export default HospitalGroupTable;