/* eslint-disable react/no-unescaped-entities */
"use client";

import {
  IDoctorSeal,
  InitialDoctorSealData,
} from "@/components/comment/typesAdInitialData";
import DoctorSealTable from "@/components/doctorSeal/DoctorSealTable";
import NewAndUpdateSeal from "@/components/doctorSeal/NewAndUpdateSeal";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import { ENUM_MODE } from "@/enum/Mode";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import { useState } from "react";
import { Button } from "rsuite";

const Comment = () => {
  const [doctorSeal, setDoctorSeal] = useState<IDoctorSeal | null>(
    InitialDoctorSealData
  );
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
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">Doctor's seal</h2>
        </div>
        <div className="p-2">
          <div className="my-3">
            <AuthCheckerForComponent
              requiredPermission={[ENUM_USER_PEMISSION.MANAGE_TESTS]}
            >
              <Button
                appearance="primary"
                color="blue"
                onClick={() => sealModalHandler(true)}
              >
                Add New Doctor Seal
              </Button>
            </AuthCheckerForComponent>
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
      </div>
    </div>
  );
};

export default Comment;
