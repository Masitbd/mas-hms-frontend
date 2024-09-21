"use client";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import {
  useDeleteVacuumTubeMutation,
  useGetVacuumTubeQuery,
} from "@/redux/api/vacuumTube/vacuumTubeSlice";
import { IVacuumTube } from "@/types/allDepartmentInterfaces";
import { TableType } from "@/types/componentsType";
import { useState } from "react";
import { Button, Pagination, Table } from "rsuite";
import swal from "sweetalert";

type VacuumTubeType = {
  setPostModelOpen: (postModelOpen: boolean) => void;
  open: boolean;
  setPatchData: (patchData: IVacuumTube) => void;
  setMode: (mode: string) => void;
};

const { Column, HeaderCell, Cell } = Table;
const VacuumTubeTable = ({
  setPatchData,
  setMode,
  open,
  setPostModelOpen,
}: TableType<IVacuumTube>) => {
  const { data: defaultData, isLoading } = useGetVacuumTubeQuery(undefined);
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
  const [deleteItem] = useDeleteVacuumTubeMutation();

  const deleteHandler = async (id: string) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Vacuum Tube!",
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
        swal("Your Vacuum Tube is safe!");
      }
    });
  };

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
        <Column flexGrow={1}>
          <HeaderCell>Price</HeaderCell>
          <Cell dataKey="price" />
        </Column>

        <Column flexGrow={4}>
          <HeaderCell>Description</HeaderCell>
          <Cell dataKey="description" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Action</HeaderCell>
          <Cell align="center">
            {(rowdate) => (
              <AuthCheckerForComponent
                requiredPermission={[ENUM_USER_PEMISSION.MANAGE_TESTS]}
              >
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
                      setPatchData(rowdate as IVacuumTube);
                      setPostModelOpen(!open);
                      setMode("patch");
                    }}
                  >
                    Edit
                  </Button>
                </>
              </AuthCheckerForComponent>
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

export default VacuumTubeTable;
