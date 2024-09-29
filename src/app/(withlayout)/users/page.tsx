"use client";
import NewUserModal from "@/components/users/NewUserModal";
import UserTable from "@/components/users/UserTable";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import { withAuth } from "@/lib/AuthCheckerForPages";
import AuthCkeckerForComponent from "@/lib/AuthCkeckerForComponent";
import React, { useState } from "react";
import { Button } from "rsuite";

const ManageUsers = () => {
  const [newUserModal, setNewUserModal] = useState(false);
  const [mode, setMode] = useState("");
  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">Users</h2>
        </div>
        <div className="p-2">
          <div className="my-5">
            <AuthCkeckerForComponent
              requiredPermission={[ENUM_USER_PEMISSION.MANAGE_USER]}
            >
              <Button
                onClick={() => {
                  setNewUserModal(!newUserModal);
                  setMode("new");
                }}
                appearance="primary"
                color="blue"
              >
                Add new user
              </Button>
            </AuthCkeckerForComponent>
            <div>
              <NewUserModal
                open={newUserModal}
                setOpen={setNewUserModal}
                mode={mode}
                setMode={setMode}
              />
            </div>
          </div>
          <UserTable mode={mode} setMode={setMode} />
        </div>
      </div>
    </div>
  );
};

export default withAuth(
  ManageUsers,
  ENUM_USER_PEMISSION.GET_USER,
  ENUM_USER_PEMISSION.MANAGE_USER
);
