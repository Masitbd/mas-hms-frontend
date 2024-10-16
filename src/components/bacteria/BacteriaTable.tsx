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
import {
  useDeleteBacteriaMutation,
  useGetBacteriaQuery,
  usePatchBacteriaMutation,
} from "@/redux/api/bacteria/bacteriaSlice";
import PatchBacteriaModel from "./PatchBacteria";
import PatchBacteria from "./PatchBacteria";
import { IBacteria } from "@/app/(withlayout)/bacteria/page";
import { ICondition } from "@/types/allDepartmentInterfaces";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";

const { Column, HeaderCell, Cell } = Table;
const BacteriaTable = () => {
  const { data: defaultData, isLoading } = useGetBacteriaQuery(undefined);

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
  ] = useDeleteBacteriaMutation();
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
    console.log(data);
    setPatchData(data);
    setPatchModalOpen(!patchModalOpen);
  };
  const patchCancelHandler = () => {
    setPatchData(undefined);
    setPatchModalOpen(!patchModalOpen);
  };
  const [
    patchBacteria,
    { isError: patchError, isSuccess: patchSuccess, isLoading: patchLoading },
  ] = usePatchBacteriaMutation();

  useEffect(() => {
    if (deleteLoading || patchLoading) {
    }
    if (deleteSuccess || patchSuccess) {
      toaster.push(
        <Message type="success">Operation Successfully Performed</Message>,
        {
          duration: 3000,
        }
      );
    }
    if (patchSuccess) {
      toaster.push(
        <Message type="success">Operation Successfully Performed</Message>,
        {
          duration: 3000,
        }
      );
      setPatchModalOpen(!patchModalOpen);
    }
    if (deleteError || patchError) {
      setPatchModalOpen(!patchModalOpen);
      toaster.push(
        <Message type="error">
          Something went wrong. Please try again letter
        </Message>,
        {
          duration: 3000,
        }
      );
    }
    if (patchError) {
      setPatchModalOpen(!patchModalOpen);
      toaster.push(
        <Message type="error">
          Something went wrong. Please try again letter
        </Message>,
        {
          duration: 3000,
        }
      );
    }
  }, [
    deleteLoading,
    deleteError,
    deleteSuccess,
    patchLoading,
    patchSuccess,
    patchError,
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
          loading={deleteLoading}
        />
        <PatchBacteria
          cancelHandler={patchCancelHandler}
          defalutValue={patchData as IBacteria}
          open={patchModalOpen}
          patchBacteria={patchBacteria}
        />
      </div>
    </div>
  );
};

export default BacteriaTable;
