"use client";

import DepartmentTable from "@/components/department/DepartmentTable";
import NewDepartment from "@/components/department/NewDepartment";
import RModal from "@/components/ui/Modal";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import { IDepartment } from "@/types/allDepartmentInterfaces";
import { useEffect, useState } from "react";

import { Button } from "rsuite";

const initialDataOfDepartment = {
  label: "",
  description: "",
  value: "",
  commissionParcentage: 0,
  fixedCommission: 0,
  isCommissionFiexed: false,
} as IDepartment;

const Department = () => {
  const [postModelOpen, setPostModelOpen] = useState(false);
  const [mode, setMode] = useState("new");
  const [patchData, setPatchData] = useState<IDepartment>(
    initialDataOfDepartment
  );
  useEffect(() => {
    if (mode === "new") {
      setPatchData(initialDataOfDepartment);
    }
  }, [mode, setPatchData]);

  const cancelHandler = () => {
    setMode("new");
    setPostModelOpen(!postModelOpen);
    setPatchData(initialDataOfDepartment);
  };

  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">Department</h2>
        </div>
        <div className="p-2">
          <div className="my-4">
            <AuthCheckerForComponent
              requiredPermission={[ENUM_USER_PEMISSION.MANAGE_DEPARTMENT]}
            >
              <Button
                appearance="primary"
                onClick={() => setPostModelOpen(!postModelOpen)}
              >
                Add New Department
              </Button>
            </AuthCheckerForComponent>
          </div>
          <div>
            <RModal
              open={postModelOpen}
              size="xs"
              cancelHandler={cancelHandler}
              title={
                mode === "new"
                  ? "Add New Department"
                  : mode === "patch"
                  ? "Edit Department Fields"
                  : "Department Details"
              }
            >
              <NewDepartment
                defaultData={patchData}
                setMode={setMode}
                mode={mode}
                open={postModelOpen}
                setPostModelOpen={setPostModelOpen}
              />
            </RModal>
            <DepartmentTable
              setPatchData={setPatchData}
              setMode={setMode}
              open={postModelOpen}
              setPostModelOpen={setPostModelOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;
