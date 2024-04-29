"use client";
import NewUserModal from "@/components/users/NewUserModal";
import UserTable from "@/components/users/UserTable";
import React, { useState } from "react";
import { Button } from "rsuite";

const ManageUsers = () => {
  const [newUserModal, setNewUserModal] = useState(false);
  const [mode, setMode] = useState("");
  return (
    <div>
      <div>
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

export default ManageUsers;
