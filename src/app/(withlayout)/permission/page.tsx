"use client";
import NewPermission from "@/components/permissions/NewPermission";
import PermissionTable from "@/components/permissions/PermissionTable";
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
const Permissions: React.FC = () => {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const cancelHandlerforPost = () => {
    setPostModalOpen(!postModalOpen);
  };

  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">Permissions</h2>
        </div>
        <div className="p-2">
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
      </div>
    </div>
  );
};

export default withAuth(
  Permissions,
  ENUM_USER_PEMISSION.MANAGE_PERMISSIONS,
  ENUM_USER_PEMISSION.GET_PERMISSIONS
);
