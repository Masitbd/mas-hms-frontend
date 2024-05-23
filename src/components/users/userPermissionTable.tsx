import { IPermission } from "@/app/(withlayout)/permission/page";
import { useGetpermissionQuery } from "@/redux/api/permission/permissonSlice";
import { usePatchUserPermissionMutation } from "@/redux/api/userPermission/userPermissonSlice";
import { useGetSingleUserQuery } from "@/redux/api/users/usersSlice";
import React, { useEffect } from "react";
import { Button, Message, Table, toaster } from "rsuite";

const UserPermissionsTable = ({ param }: { param: IAUth }) => {
  const { HeaderCell, Cell, Column } = Table;
  const { data: singleUserdata, isLoading: userDataLoading } =
    useGetSingleUserQuery(param.uuid);

  const { data: permission, isLoading: permissionLoading } =
    useGetpermissionQuery(undefined);
  const [patchUserPermissions, { isSuccess, isError, data }] =
    usePatchUserPermissionMutation();

  // Handeling permisison onChange

  const handlePermissionChange = (data: { label: string; code: Number }) => {
    const { data: udata } = singleUserdata;
    let usersPermission: Number[] = udata[0]?.permissions?.permissions;
    if (usersPermission.includes(Number(data.code))) {
      usersPermission = usersPermission.filter(
        (sinlePermission: Number) =>
          Number(sinlePermission) !== Number(data.code)
      );
    } else {
      usersPermission = [...usersPermission, data.code];
    }
    const patchdata = {
      uuid: udata[0].uuid,
      data: {
        permissions: usersPermission.map((pData) => Number(pData)),
      },
    };

    patchUserPermissions(patchdata);
  };

  // using for toast
  useEffect(() => {
    if (isSuccess)
      toaster.push(
        <Message type="success">Permision changed Successfully</Message>
      );
    if (isError) toaster.push(<Message type="error">Error</Message>);
  }, [isSuccess, isError]);

  const availabelUserPermissions: Number[] =
    singleUserdata?.data[0]?.permissions?.permissions || [];

  return (
    <div>
      <Table
        data={permission?.data}
        bordered
        cellBordered
        rowHeight={60}
        height={600}
        loading={permissionLoading || userDataLoading}
      >
        <Column flexGrow={2}>
          <HeaderCell>Permisson Name</HeaderCell>
          <Cell dataKey="label" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell>...</HeaderCell>
          <Cell>
            {(rowData: IPermission) => {
              return (
                <>
                  <Button
                    appearance="primary"
                    color="red"
                    disabled={
                      !availabelUserPermissions
                        .map((permission) => permission)
                        .includes(rowData.code as unknown as Number)
                    }
                    onClick={() => handlePermissionChange(rowData)}
                  >
                    Revoke
                  </Button>
                  <Button
                    appearance="primary"
                    className="mx-5"
                    color="green"
                    disabled={availabelUserPermissions.includes(rowData.code)}
                    onClick={() => handlePermissionChange(rowData)}
                  >
                    {availabelUserPermissions.includes(rowData.code)
                      ? "Granted"
                      : "Grant"}
                  </Button>
                </>
              );
            }}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default UserPermissionsTable;
