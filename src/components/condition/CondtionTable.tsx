"use client";
import AlartDialog from "@/components/ui/AlertModal";
import {
  useDeleteConditionMutation,
  useGetConditionQuery,
  usePatchConditionMutation,
} from "@/redux/api/condition/conditionSlice";
import { setLoading } from "@/redux/features/loading/loading";
import React, { useEffect, useState } from "react";
import { Table, Pagination, Button, toaster, Message } from "rsuite";
import PatchConditonModal from "./PatchConditionModal";
import { ICondition } from "@/types/allDepartmentInterfaces";
import swal from "sweetalert";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";

const { Column, HeaderCell, Cell } = Table;
const CondtionTable = () => {
  const { data: defaultData, isLoading } = useGetConditionQuery(undefined);

  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);

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
  const [deletItemId, seDeletItemId] = useState("");
  const [deletModalOpen, setDeletModalOpen] = React.useState(false);
  const [
    deleteItem,
    {
      isSuccess: deleteSuccess,
      isLoading: deleteLoading,
      isError: deleteError,
    },
  ] = useDeleteConditionMutation();
  const okHandler = () => {
    deleteItem(deletItemId);
    setDeletModalOpen(!deletModalOpen);
  };
  const cancelHandler = () => {
    setDeletModalOpen(!deletModalOpen);
    seDeletItemId("");
  };
  const deleteHandler = (id: string) => {
    setDeletModalOpen(!deletModalOpen);
    seDeletItemId(id);
  };

  // For patch
  const [patchModalOpen, setPatchModalOpen] = useState(false);
  const [patchData, setPatchData] = useState<ICondition>();
  const patchHandler = (data: ICondition) => {
    setPatchData(data);
    setPatchModalOpen(!patchModalOpen);
  };
  const patchCancelHandler = () => {
    setPatchData(undefined);
    setPatchModalOpen(!patchModalOpen);
  };
  const [
    patchConditon,
    { isError: patchError, isSuccess: patchSuccess, isLoading: patchLoading },
  ] = usePatchConditionMutation();

  useEffect(() => {
    if (deleteSuccess || patchSuccess) {
      swal("Success", "Operation completed successfully", "success");
      setPatchModalOpen(false);
    }

    if (deleteError || patchError) {
      setPatchModalOpen(!patchModalOpen);
      setPatchModalOpen(!patchModalOpen);
      swal("Error", "Something went wrong", "error");
    }
  }, [
    deleteLoading,
    deleteError,
    deleteSuccess,
    patchLoading,
    patchSuccess,
    patchError,
    patchModalOpen,
  ]);
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
                  appearance="primary"
                  color="red"
                  onClick={() => deleteHandler(rowdate._id)}
                  startIcon={<TrashIcon />}
                />

                <Button
                  appearance="primary"
                  color="green"
                  className="ml-2"
                  onClick={() => patchHandler(rowdate as ICondition)}
                  startIcon={<EditIcon />}
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
      <div>
        <AlartDialog
          title={"Confermation"}
          description={
            "Are you sure you want to delete this Conditon. This action can not be undone"
          }
          open={deletModalOpen}
          onOk={okHandler}
          onCancel={cancelHandler}
        ></AlartDialog>
        <PatchConditonModal
          open={patchModalOpen}
          defalutValue={patchData as unknown as ICondition}
          cancelHandler={patchCancelHandler}
          patchCondition={patchConditon}
        ></PatchConditonModal>
      </div>
    </div>
  );
};

export default CondtionTable;
