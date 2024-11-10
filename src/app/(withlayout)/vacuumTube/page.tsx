"use client";
import RModal from "@/components/ui/Modal";
import NewVacuumTube from "@/components/vacuumTube/NewVacuumTube";
import VacuumTubeTable from "@/components/vacuumTube/VacuumTubeTable";
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
    if (mode === 'new') {
      setPatchData({
        label: "",
        description: "",
        value: "",
        price: 0,
      });
    }
  }, [mode, setPatchData]);


  return (
    <div className="my-5 px-5">
      <div className="my-4">
        <Button
          appearance="primary"
          onClick={() => setPostModelOpen(!postModelOpen)}
        >
          Add New VacuumTube
        </Button>
      </div>
      <div>
        <RModal
          open={postModelOpen}
          size="xs"
          title={mode === "new" ? "Add New VacuumTube" : mode === "patch" ? "Edit VacuumTube Fields" : "VacuumTube Details"}
        >
          <NewVacuumTube defaultData={patchData} setMode={setMode} mode={mode} open={postModelOpen} setPostModelOpen={setPostModelOpen} />
        </RModal>
        <VacuumTubeTable setPatchData={setPatchData} setMode={setMode} open={postModelOpen} setPostModelOpen={setPostModelOpen} />
      </div>
    </div>
  );
};

export default VacuumTube;
