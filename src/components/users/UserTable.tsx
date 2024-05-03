"use client";
import React, { useEffect, useState } from "react";
import { Button, InputPicker, SelectPicker, Table } from "rsuite";
import RModal from "../ui/Modal";
import UserForm from "./NewUserForm";
import { useGetAllUsersQuery } from "@/redux/api/users/usersSlice";

const UserTable = ({
  mode,
  setMode,
}: {
  mode: string;
  setMode: (prop: string) => void;
}) => {
  const { data: users, isLoading: usersLoading } =
    useGetAllUsersQuery(undefined);

  const { HeaderCell, Cell, Column } = Table;

  //   Handling signle user view
  const [user, setUser] = useState();
  const [singleUserModel, setSingleUserModel] = useState(false);
  const handleSingleUserView = (user: any) => {
    setUser(user);
    setSingleUserModel(true);
  };

  // ALl the permissions stored in the server

  const [permissions, setPermissions] = useState([]);
  useEffect(() => {
    fetch("/PermissionData.json")
      .then((res) => res.json())
      .then((data) => setPermissions(data));
  }, [user]);

  // Handeling permisison onChange
  const handlePermissionChange = (data) => {
    const selscted = users.find((data) => data.uuid === user.uuid);
    const permissionCodes = selscted.permissions.map(
      (permission) => permission
    );
    if (permissionCodes.includes(data.code)) {
      selscted.permissions.filter(
        (permission) => permission.code !== data.code
      );
    } else {
      selscted.permissions.push(data);
    }
    setUser(selscted);
  };

  // Handling the search function
  const [searchData, setSearchData] = useState();
  const handleSearch = (prop: string) => {
    const data = permissions.filter((permission) =>
      permission.label.includes(prop)
    );
    setSearchData(data);
  };
  return (
    <>
      <div>
        <Table
          data={users?.data}
          className="w-full"
          bordered
          cellBordered
          rowHeight={60}
          height={800}
          loading={usersLoading}
        >
          <Column align="center" flexGrow={2}>
            <HeaderCell>UUID</HeaderCell>
            <Cell dataKey="uuid" color="" />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Name</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="email" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Phone</HeaderCell>
            <Cell dataKey="phone" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>...</HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <>
                    <Button onClick={() => handleSingleUserView(rowData)}>
                      View
                    </Button>
                    <Button onClick={() => handleSingleUserView(rowData)}>
                      Edit
                    </Button>
                  </>
                );
              }}
            </Cell>
          </Column>
        </Table>
      </div>
      <div>
        <RModal
          open={singleUserModel}
          size="md"
          title="User Info"
          okHandler={() => {
            setSingleUserModel(!singleUserModel);
            setMode("new");
          }}
          cancelHandler={() => {
            setSingleUserModel(!singleUserModel);
            setMode("new");
          }}
        >
          <div>
            <div className="mb-5">
              <h2 className="mb-3">
                Personal Information <br />
                <hr />
              </h2>

              {mode == "edit" ? (
                <UserForm defaultValue={user} mode={mode} />
              ) : (
                <>
                  {" "}
                  <div className="grid grid-cols-2 gap-5">
                    {user &&
                      Object.keys(user).map((key) => {
                        if (key == "permissions") return;
                        return (
                          <>
                            <div className="flex flex-col">
                              <div className="capitalize text-md font-bold">
                                {key}
                              </div>
                              <div>{user[key]}</div>
                            </div>
                          </>
                        );
                      })}
                  </div>
                </>
              )}

              <div>
                <Button onClick={() => setMode("edit")}>Edit</Button>
              </div>
            </div>
            <div>
              <h2>
                Permissions Information <br />
                <hr />
              </h2>
              <div>
                <InputPicker
                  className="w-full"
                  onSearch={(searchKeyword, event) =>
                    handleSearch(searchKeyword)
                  }
                  placeholder="Search"
                  data={searchData?.map((permission) => ({
                    label: permission.label,
                    value: permission.code,
                  }))}
                  caretAs={"a"}
                  renderMenuItem={(label, item) => {
                    return (
                      <>
                        <div className="flex justify-between">
                          <div>{label}</div>
                          <div>
                            <Button
                              appearance="primary"
                              className="mx-5"
                              color="green"
                              disabled={user.permissions.permissions.includes(
                                item.value
                              )}
                              onClick={() =>
                                handlePermissionChange({
                                  label: label,
                                  code: item.value,
                                })
                              }
                            >
                              {user.permissions.permissions.includes(item.value)
                                ? "Granted"
                                : "Grant"}
                            </Button>
                            <Button
                              appearance="primary"
                              color="red"
                              disabled={user.permissions.permissions.includes(
                                !item.value
                              )}
                              onClick={() =>
                                handlePermissionChange({
                                  label: label,
                                  code: item.value,
                                })
                              }
                            >
                              Revoke
                            </Button>
                          </div>
                        </div>
                      </>
                    );
                  }}
                />
              </div>
              <Table
                data={permissions}
                bordered
                cellBordered
                rowHeight={60}
                height={600}
              >
                <Column flexGrow={2}>
                  <HeaderCell>Permisson Name</HeaderCell>
                  <Cell dataKey="label" />
                </Column>

                <Column flexGrow={1}>
                  <HeaderCell>...</HeaderCell>
                  <Cell>
                    {(rowData) => {
                      return (
                        <>
                          <Button
                            appearance="primary"
                            className="mx-5"
                            color="green"
                            disabled={user.permissions.permissions.includes(
                              rowData.code
                            )}
                            onClick={() => handlePermissionChange(rowData)}
                          >
                            {user.permissions.permissions.includes(rowData.code)
                              ? "Granted"
                              : "Grant"}
                          </Button>
                          <Button
                            appearance="primary"
                            color="red"
                            disabled={user.permissions.permissions
                              .map((permission) => permission.code)
                              .includes(!rowData.code)}
                            onClick={() => handlePermissionChange(rowData)}
                          >
                            Revoke
                          </Button>
                        </>
                      );
                    }}
                  </Cell>
                </Column>
              </Table>
            </div>
          </div>
        </RModal>
      </div>
    </>
  );
};

export default UserTable;
