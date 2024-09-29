"use client";
import HospitalGroupTable from "@/components/hospitalGroup/HospitalGroupTable";
import NewHospitalGroup from "@/components/hospitalGroup/NewHospitalGroup";
import RModal from "@/components/ui/Modal";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import { IHospitalGroup } from "@/types/allDepartmentInterfaces";
import { useEffect, useState } from "react";

import { Button } from "rsuite";

const HospitalGroup = () => {
  const [postModelOpen, setPostModelOpen] = useState(false);
  const [patchData, setPatchData] = useState<IHospitalGroup>({
    label: "",
    description: "",
    value: "",
  });
  const [mode, setMode] = useState("new");
  useEffect(() => {
    if (mode === "new") {
      setPatchData({
        label: "",
        description: "",
        value: "",
      });
    }
  }, [mode, setPatchData]);
  //
  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">Hospital Group</h2>
        </div>
        <div className="p-2">
          <div className="my-4">
            <AuthCheckerForComponent
              requiredPermission={[ENUM_USER_PEMISSION.MANAGE_HOSPITAL_GROUP]}
            >
              <Button
                appearance="primary"
                onClick={() => setPostModelOpen(!postModelOpen)}
              >
                Add New Hospital Group
              </Button>
            </AuthCheckerForComponent>
          </div>
          <div>
            <RModal
              open={postModelOpen}
              size="xs"
              title={
                mode === "new"
                  ? "Add New Hospital Group"
                  : mode === "patch"
                  ? "Edit Hospital Group Fields"
                  : "Hospital Group Details"
              }
            >
              <NewHospitalGroup
                defaultData={patchData}
                setMode={setMode}
                mode={mode}
                open={postModelOpen}
                setPostModelOpen={setPostModelOpen}
              />
            </RModal>
            <HospitalGroupTable
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

export default HospitalGroup;
