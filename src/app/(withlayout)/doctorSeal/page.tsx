"use client";

import { IDoctorSeal, InitialDoctorSealData } from "@/components/comment/typesAdInitialData";
import DoctorSealTable from "@/components/doctorSeal/DoctorSealTable";
import NewAndUpdateSeal from "@/components/doctorSeal/NewAndUpdateSeal";
import { ENUM_MODE } from "@/enum/Mode";
import { useState } from "react";
import { Button } from "rsuite";


const Comment = () => {
  const [doctorSeal, setDoctorSeal] = useState<IDoctorSeal | null>(InitialDoctorSealData);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState(ENUM_MODE.NEW);

  const sealDataHandler = (data: IDoctorSeal) => {
    setDoctorSeal(data);
  };
  const sealModalHandler = (b: boolean) => {
    setModalOpen(b);
  };
  const modeHandler = (mode: string) => {
    setMode(mode as ENUM_MODE);
  };

  return (
    <div>
      <div className="my-3">
        <Button
          appearance="primary"
          color="blue"
          onClick={() => sealModalHandler(true)}
        >
          Add New Doctor Seal
        </Button>
      </div>
      <div>
        <NewAndUpdateSeal
          data={doctorSeal as IDoctorSeal}
          open={modalOpen}
          setData={sealDataHandler}
          setOpen={sealModalHandler}
          mode={mode}
          setMode={modeHandler}
        />
      </div>
      <div>
        <DoctorSealTable
          setData={sealDataHandler}
          setMode={modeHandler}
          setModalOpen={sealModalHandler}
        />
      </div>
    </div>
  );
};

export default Comment;
