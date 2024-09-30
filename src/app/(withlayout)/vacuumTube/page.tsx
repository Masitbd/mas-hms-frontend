"use client";
import RModal from "@/components/ui/Modal";
import NewVacuumTube from "@/components/vacuumTube/NewVacuumTube";
import VacuumTubeTable from "@/components/vacuumTube/VacuumTubeTable";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import { IVacuumTube } from "@/types/allDepartmentInterfaces";
import { useEffect, useState } from "react";

import { Button } from "rsuite";

const VacuumTube = () => {
  const [postModelOpen, setPostModelOpen] = useState(false);
  const [patchData, setPatchData] = useState<IVacuumTube>({
    label: "",
    description: "",
    value: "",
    price: 0,
  });

  const [mode, setMode] = useState("new");

  useEffect(() => {
    if (mode === "new") {
      setPatchData({
        label: "",
        description: "",
        value: "",
        price: 0,
      });
    }
  }, [mode, setPatchData]);

  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">Vaccume Tube</h2>
        </div>
        <div className="p-2">
          <div className="my-4">
            <AuthCheckerForComponent
              requiredPermission={[ENUM_USER_PEMISSION.MANAGE_TESTS]}
            >
              <Button
                appearance="primary"
                onClick={() => setPostModelOpen(!postModelOpen)}
              >
                Add New VacuumTube
              </Button>
            </AuthCheckerForComponent>
          </div>
          <div>
            <RModal
              open={postModelOpen}
              size="xs"
              title={
                mode === "new"
                  ? "Add New VacuumTube"
                  : mode === "patch"
                  ? "Edit VacuumTube Fields"
                  : "VacuumTube Details"
              }
            >
              <NewVacuumTube
                defaultData={patchData}
                setMode={setMode}
                mode={mode}
                open={postModelOpen}
                setPostModelOpen={setPostModelOpen}
              />
            </RModal>
            <VacuumTubeTable
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

export default VacuumTube;
