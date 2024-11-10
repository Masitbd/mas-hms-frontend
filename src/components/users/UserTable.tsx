/* eslint-disable react/no-children-prop */
"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  InputPicker,
  Message,
  SelectPicker,
  Table,
  Tag,
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
import PasswordChangeByAdmin from "./PasswordChangeByAdmin";
import { ENUM_STATUS } from "@/constants/EnumStatus";
import swal from "sweetalert";
import {
  useActivateUserMutation,
  useRusticateUserMutation,
} from "@/redux/api/authentication/authenticationSlice";

const UserTable = ({
  mode,
  setMode,
}: {
  mode: string;
  setMode: (prop: string) => void;
}) => {
  const loggedInUser = useAppSelector((state) => state.auth.user);

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

  // For changing password by admin
  const [userInfo, setUserInfo] = useState<IUserData>();
  const [open, setOpen] = useState(false);
  const handleChangePasswordChange = (userInfo: IUserData) => {
    setOpen(true);
    setUserInfo(userInfo);
  };

  // handeling rusticate user functionlaity
  const [rusticateUser, { isLoading: rusticateUserLoading }] =
    useRusticateUserMutation();
  const handleRusticateUser = async (user: IUserData) => {
    const confirm = await swal({
      text: "Are you sure you want to rusticate this user?",
      title: "Warning",
      icon: "error",
      dangerMode: true,
      buttons: ["Cancel", true],
    });

    if (confirm) {
      const id = user?.user?._id;
      const requestData = {
        id: id,
      };

      try {
        const response = await rusticateUser(requestData).unwrap();
        if (response?.success) {
          swal("Success", "User successfully rusticated", "success");
        }
      } catch (error) {
        toaster.push(
          <Message type="error">{"Error Occurred" as string}</Message>
        );
      }
    }
  };

  // handeling Activating user functionality
  const [activate, { isLoading: activateUserLoading }] =
    useActivateUserMutation();
  const handleActivateUser = async (user: IUserData) => {
    const confirm = await swal({
      text: "Are you sure you want to Activate this user?",
      title: "Warning",
      icon: "error",
      dangerMode: true,
      buttons: ["Cancel", true],
    });

    if (confirm) {
      const id = user?.user?._id;
      const requestData = {
        id: id,
      };

      try {
        const response = await activate(requestData).unwrap();
        if (response?.success) {
          swal("Success", "User successfully activated", "success");
        }
      } catch (error) {
        toaster.push(
          <Message type="error">{"Error Occurred" as string}</Message>
        );
      }
    }
  };

  return (
    <>
      <div>
        <Table
          data={users?.data}
          className="w-full"
          bordered
          cellBordered
          autoHeight
          loading={usersLoading || rusticateUserLoading || activateUserLoading}
        >
          <Column align="center" flexGrow={1}>
            <HeaderCell>UUID</HeaderCell>
            <Cell dataKey="uuid" color="" />
          </Column>
          <Column align="center" flexGrow={0.5}>
            <HeaderCell>Status</HeaderCell>
            <Cell>
              {(rowData) =>
                rowData?.user?.status == ENUM_STATUS.ACTIVE ? (
                  <Tag color="green">Active</Tag>
                ) : (
                  <Tag color="red">Rusticated</Tag>
                )
              }
            </Cell>
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
          <Column flexGrow={2}>
            <HeaderCell>...</HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <>
                    <div className="grid grid-cols-6 gap-5">
                      <Button
                        color="green"
                        appearance="primary"
                        startIcon={<VisibleIcon />}
                        onClick={() => handleSingleUserView(rowData)}
                        size="sm"
                      />
                      <AuthCheckerForComponent
                        requiredPermission={[ENUM_USER_PEMISSION.SUPER_ADMIN]}
                      >
                        <Button
                          className="col-span-3"
                          color="blue"
                          appearance="primary"
                          children={"Change Password"}
                          onClick={() =>
                            handleChangePasswordChange(rowData as IUserData)
                          }
                          size="sm"
                        />
                      </AuthCheckerForComponent>
                      {rowData?.user?.status == ENUM_STATUS.ACTIVE ? (
                        <AuthCheckerForComponent
                          requiredPermission={[ENUM_USER_PEMISSION.SUPER_ADMIN]}
                        >
                          <Button
                            className="col-span-2"
                            color="red"
                            appearance="primary"
                            children={"Rusticate"}
                            onClick={() =>
                              handleRusticateUser(rowData as IUserData)
                            }
                            size="sm"
                          />
                        </AuthCheckerForComponent>
                      ) : (
                        <AuthCheckerForComponent
                          requiredPermission={[ENUM_USER_PEMISSION.SUPER_ADMIN]}
                        >
                          <Button
                            className="col-span-2"
                            color="green"
                            appearance="primary"
                            children={"Activate"}
                            onClick={() =>
                              handleActivateUser(rowData as IUserData)
                            }
                            size="sm"
                          />
                        </AuthCheckerForComponent>
                      )}
                    </div>
                  </>
                );
              }}
            </Cell>
          </Column>
        </Table>
      </div>
      <div>
        <PasswordChangeByAdmin
          open={open}
          setOpen={setOpen}
          user={userInfo as unknown as IProfile}
        />
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
                              {key == "dateOfBirth" ? (
                                <div>
                                  {new Date(
                                    singleUserdata.data[0].profile[key]
                                  )?.toLocaleDateString() ?? "N/A"}
                                </div>
                              ) : (
                                <div>{singleUserdata.data[0].profile[key]}</div>
                              )}
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
