"use client";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import {
  useDeleteSpecimenMutation,
  useGetSpecimenQuery,
} from "@/redux/api/specimen/specimenSlice";
import { ISpecimen } from "@/types/allDepartmentInterfaces";
import { TableType } from "@/types/componentsType";
import { useState } from "react";
import { Button, Pagination, Table } from "rsuite";
import swal from "sweetalert";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";

const { Column, HeaderCell, Cell } = Table;

const SpecimenTable = ({
  setPatchData,
  setMode,
  open,
  setPostModelOpen,
}: TableType<ISpecimen>) => {
  const { data: defaultData, isLoading } = useGetSpecimenQuery(undefined);
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

  //   For delete
  const [deleteItem] = useDeleteSpecimenMutation();

  const deleteHandler = async (id: string) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Specimen!",
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
        swal("Your specimen is safe!");
      }
    });
  };

  return (
    <div>
      <Table autoHeight data={data} loading={isLoading} bordered cellBordered>
        <Column flexGrow={3}>
          <HeaderCell>Title</HeaderCell>
          <Cell dataKey="label" />
        </Column>

        <Column flexGrow={2}>
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
                    appearance="primary"
                    color="red"
                    onClick={() => deleteHandler(rowdate._id)}
                    startIcon={<TrashIcon />}
                    size="sm"
                  />

                  <Button
                    appearance="primary"
                    color="green"
                    className="ml-2"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      setPatchData(rowdate as ISpecimen);
                      setPostModelOpen(!open);
                      setMode("patch");
                    }}
                    size="sm"
                  />
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

export default SpecimenTable;
