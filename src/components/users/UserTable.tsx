"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  InputPicker,
  Message,
  SelectPicker,
  Table,
  toaster,
} from "rsuite";
import RModal from "../ui/Modal";
import UserForm from "./NewUserForm";
import VisibleIcon from "@rsuite/icons/Visible";
import {
  useGetAllUsersQuery,
  useLazyGetSingleUserQuery,
} from "@/redux/api/users/usersSlice";
import { useGetpermissionQuery } from "@/redux/api/permission/permissonSlice";
import { usePatchUserPermissionMutation } from "@/redux/api/userPermission/userPermissonSlice";
import Loading from "@/app/loading";
import UserPermissionsTable from "./userPermissionTable";
import {
  INewUserData,
  IProfile,
  IUserData,
  initialFormDataForNewUser,
  patchProfileModel,
  profileDispalyableFields,
} from "./interfacesAndInitalData";
import { usePatchProfileMutation } from "@/redux/api/profile/profileSlice";
import { useAppSelector } from "@/redux/hook";
import PatchProfile from "./PatchProfile";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";

const UserTable = ({
  mode,
  setMode,
}: {
  mode: string;
  setMode: (prop: string) => void;
}) => {
  const loggedInUser: IUserData = useAppSelector((state) => state.auth.user);
  const { data: users, isLoading: usersLoading } =
    useGetAllUsersQuery(undefined);

  const { HeaderCell, Cell, Column } = Table;

  //   Handling signle user view;
  const [
    getSingleUser,
    { isLoading: singleUserLoading, data: singleUserdata },
  ] = useLazyGetSingleUserQuery();
  const [user, setUser] = useState();
  const [singleUserModel, setSingleUserModel] = useState(false);
  const handleSingleUserView = (user: any) => {
    setUser(user);
    getSingleUser(user.uuid);
    setSingleUserModel(true);
  };

  //! Handling the search function is disable for now It will be used
  // const [searchData, setSearchData] = useState();
  // const handleSearch = (prop: string) => {
  //   const data = permissions.filter((permission) =>
  //     permission.label.includes(prop)
  //   );
  //   setSearchData(data);
  // };

  // for patching new user
  const patchFromRef: React.MutableRefObject<any> = useRef();
  const [userData, setUserData] = useState<Partial<IProfile>>();
  const [
    patchUserProfile,
    {
      isLoading: patchUserProfileLoading,
      isSuccess: patchUserProfileSuccess,
      isError: patchUserProfileError,
    },
  ] = usePatchProfileMutation();

  const patchHandler = () => {
    if (patchFromRef.current.check()) {
      patchUserProfile({
        profileData: userData as IProfile,
        uuid: singleUserdata.data[0].uuid,
      });
      setUserData(undefined);
    } else {
      toaster.push(
        <Message type="error">Do Not leave any Field Empty</Message>
      );
    }
  };

  useEffect(() => {
    if (patchUserProfileSuccess) {
      toaster.push(<Message type="success">User Updated successfully</Message>);
      setMode("new");
    }
    if (patchUserProfileError) {
    }
  }, [patchUserProfileError, patchUserProfileSuccess]);
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
                    <Button
                      color="green"
                      appearance="primary"
                      startIcon={<VisibleIcon style={{ fontSize: "15px" }} />}
                      onClick={() => handleSingleUserView(rowData)}
                    />
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
            setUser(undefined);
          }}
          cancelHandler={() => {
            setSingleUserModel(!singleUserModel);
            setMode("new");
            setUser(undefined);
          }}
        >
          <div>
            <div className="mb-5">
              <h2 className="mb-3">
                Personal Information <br />
                <hr />
              </h2>

              {mode == "edit" ? (
                <>
                  <PatchProfile
                    defaultValue={singleUserdata.data[0].profile}
                    mode={mode}
                    setMode={setMode}
                    key={105}
                  />
                </>
              ) : (
                <>
                  {" "}
                  <div className="grid grid-cols-2 gap-5" key={19}>
                    {singleUserLoading ? (
                      <Loading />
                    ) : (
                      user &&
                      profileDispalyableFields.map((key, index) => {
                        return (
                          <>
                            <div className="flex flex-col" key={index + 100}>
                              <div className="capitalize text-md font-bold">
                                {key}
                              </div>
                              <div>{singleUserdata.data[0].profile[key]}</div>
                            </div>
                          </>
                        );
                      })
                    )}
                  </div>
                </>
              )}

              {mode !== "edit" && (
                <AuthCheckerForComponent
                  requiredPermission={[ENUM_USER_PEMISSION.MANAGE_USER]}
                >
                  <div className="my-5">
                    <Button
                      onClick={() => {
                        setMode("edit");
                      }}
                      appearance="primary"
                      color="green"
                    >
                      Edit
                    </Button>
                  </div>
                </AuthCheckerForComponent>
              )}
            </div>
            <AuthCheckerForComponent
              requiredPermission={[
                ENUM_USER_PEMISSION.MANAGE_USER,
                ENUM_USER_PEMISSION.MANAGE_USER_PERMISSIONS,
                ENUM_USER_PEMISSION.GET_USER_PERMISSIONS,
              ]}
            >
              <>
                <div>
                  <h2>
                    Permissions Information <br />
                    <hr />
                  </h2>

                  {/* 
              //! THis code is for searching permisison and will be used
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
              </div> */}
                </div>
                <fieldset
                  className={`${
                    loggedInUser.uuid == singleUserdata?.data[0].uuid
                      ? "cursor-not-allowed"
                      : ""
                  }`}
                  disabled={loggedInUser.uuid == singleUserdata?.data[0].uuid}
                >
                  <div
                    title={`${
                      loggedInUser.uuid == singleUserdata?.data[0].uuid
                        ? "Your are not allowed to TO change your own permissions."
                        : ""
                    }`}
                  >
                    {user ? (
                      <UserPermissionsTable param={user as unknown as IAUth} />
                    ) : (
                      ""
                    )}
                  </div>
                </fieldset>
              </>
            </AuthCheckerForComponent>
          </div>
        </RModal>
      </div>
    </>
  );
};

export default UserTable;
