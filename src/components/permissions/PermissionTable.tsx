"use client";
import AlartDialog from "@/components/ui/AlertModal";

import { setLoading } from "@/redux/features/loading/loading";
import React, { useEffect, useState } from "react";
import { Table, Pagination, Button, toaster, Message } from "rsuite";

import { IPermission } from "@/app/(withlayout)/permission/page";
import PatchPermission from "./PatchPermission";
import {
  useDeletepermissionMutation,
  useGetpermissionQuery,
  usePatchpermissionMutation,
} from "@/redux/api/permission/permissonSlice";
import AuthCkeckerForComponent from "@/lib/AuthCkeckerForComponent";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";

const { Column, HeaderCell, Cell } = Table;
const PermissionTable = () => {
  const { data: defaultData, isLoading } = useGetpermissionQuery(undefined);

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
  ] = useDeletepermissionMutation();
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
  const [patchData, setPatchData] = useState<IPermission>();
  const patchHandler = (data: IPermission) => {
    setPatchData(data);
    setPatchModalOpen(!patchModalOpen);
  };
  const patchCancelHandler = () => {
    setPatchData(undefined);
    setPatchModalOpen(!patchModalOpen);
  };
  const [
    patchPdrv,
    { isError: patchError, isSuccess: patchSuccess, isLoading: patchLoading },
  ] = usePatchpermissionMutation();

  useEffect(() => {
    if (deleteLoading || patchLoading) {
      setLoading(true);
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
      setLoading(false);
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
      setLoading(false);
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
        autoHeight
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
          <HeaderCell>Code</HeaderCell>
          <Cell dataKey="code" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell>Action</HeaderCell>
          <Cell align="center">
            {(rowdate) => (
              <AuthCkeckerForComponent
                requiredPermission={[ENUM_USER_PEMISSION.MANAGE_PERMISSIONS]}
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
                    onClick={() => patchHandler(rowdate as IPermission)}
                  >
                    Edit
                  </Button>
                </>
              </AuthCkeckerForComponent>
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
            "Are you sure you want to delete this . This action can not be undone"
          }
          open={deletModalOpen}
          onOk={okHandler}
          onCancel={cancelHandler}
        ></AlartDialog>
        <PatchPermission
          open={patchModalOpen}
          defalutValue={patchData as unknown as IPermission}
          cancelHandler={patchCancelHandler}
          patchPdrv={patchPdrv}
        />
      </div>
    </div>
  );
};

export default PermissionTable;
