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
    <div>
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
  );
};

export default withAuth(
  ManageUsers,
  ENUM_USER_PEMISSION.GET_ALL_USER,
  ENUM_USER_PEMISSION.MANAGE_USER
);
