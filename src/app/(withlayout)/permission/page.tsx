"use client";
import PdrvTable from "@/components/pdrv/PdrvTable";
import NewPermission from "@/components/permissions/NewPermission";
import PermissionTable from "@/components/permissions/PermissionTable";
import UserTable from "@/components/users/UserTable";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import { withAuth } from "@/lib/AuthCheckerForPages";
import AuthCkeckerForComponent from "@/lib/AuthCkeckerForComponent";
import React, { useState } from "react";
import { Button } from "rsuite";
export type IPermission = {
  _id?: string;
  label: string;
  code: number;
};
const Permissions = () => {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const cancelHandlerforPost = () => {
    setPostModalOpen(!postModalOpen);
  };

  return (
    <div className="my-5 px-5">
      <div className="my-4">
        <AuthCkeckerForComponent
          requiredPermission={[ENUM_USER_PEMISSION.MANAGE_PERMISSIONS]}
        >
          <Button
            appearance="primary"
            onClick={() => setPostModalOpen(!postModalOpen)}
          >
            Add New Permission
          </Button>
        </AuthCkeckerForComponent>
      </div>

      <div>
        <NewPermission
          modalStatusHandler={setPostModalOpen}
          open={postModalOpen}
          cancelHandler={cancelHandlerforPost}
        />
      </div>
      <div>
        <AuthCkeckerForComponent
          requiredPermission={[
            ENUM_USER_PEMISSION.GET_PERMISSIONS,
            ENUM_USER_PEMISSION.MANAGE_PERMISSIONS,
          ]}
        >
          <PermissionTable />
        </AuthCkeckerForComponent>
      </div>
    </div>
  );
};

export default withAuth(
  Permissions,
  ENUM_USER_PEMISSION.MANAGE_PERMISSIONS,
  ENUM_USER_PEMISSION.GET_PERMISSIONS
);
