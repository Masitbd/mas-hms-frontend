"use client";
import NewSpecimenModel from "@/components/specimen/NewSpecimenModel";
import SpecimenTable from "@/components/specimen/SpecimenTable";
import NewVacuumTube from "@/components/vacuumTube/NewVacuumTube";
import VacuumTubeTable from "@/components/vacuumTube/VacuumTubeTable";
import { useState } from "react";

import { Button, Message, toaster } from "rsuite";

const VacuumTube = () => {
  const [postModelOpen, setPostModelOpen] = useState(false);
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
        <NewVacuumTube
          open={postModelOpen}
          setPostModelOpen={setPostModelOpen}
        />
        <VacuumTubeTable />
      </div>
    </div>
  );
};

export default VacuumTube;
