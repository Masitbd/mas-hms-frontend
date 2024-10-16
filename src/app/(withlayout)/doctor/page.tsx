"use client";

import DoctorsTable from "@/components/doctor/DoctorsTable";
import NewDoctor from "@/components/doctor/NewDoctor";
import RModal from "@/components/ui/Modal";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import { IDoctor } from "@/types/allDepartmentInterfaces";

import { useEffect, useState } from "react";

import { Button } from "rsuite";

const initialDataOfDoctor = {
  title: "",
  name: "",
  fatherName: "",
  email: "",
  designation: "",
  phone: "",
  image: "",
  code: "",
} as IDoctor;

const Doctor = () => {
  const [postModelOpen, setPostModelOpen] = useState(false);
  const [patchData, setPatchData] = useState<IDoctor>(initialDataOfDoctor);

  const [mode, setMode] = useState("new");
  useEffect(() => {
    if (mode === "new") {
      setPatchData(initialDataOfDoctor);
    }
  }, [mode, setPatchData]);

  const cancelHandler = () => {
    setMode("new");
    setPostModelOpen(!postModelOpen);
    setPatchData(initialDataOfDoctor);
  };

  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">Doctor</h2>
        </div>
        <div className="p-2">
          <div className="my-4">
            <AuthCheckerForComponent
              requiredPermission={[ENUM_USER_PEMISSION.MANAGE_DOCTORS]}
            >
              <Button
                appearance="primary"
                onClick={() => setPostModelOpen(!postModelOpen)}
              >
                Add New Doctor
              </Button>
            </AuthCheckerForComponent>
          </div>
          <div>
            <RModal
              open={postModelOpen}
              size="md"
              cancelHandler={cancelHandler}
              title={
                mode === "new"
                  ? "Add New Doctor"
                  : mode === "patch"
                  ? "Edit Doctor's Fields"
                  : "Doctor's Details"
              }
            >
              <NewDoctor
                defaultData={patchData}
                setMode={setMode}
                mode={mode}
                open={postModelOpen}
                setPostModelOpen={setPostModelOpen}
              />
            </RModal>
            <DoctorsTable
              open={postModelOpen}
              setPostModelOpen={setPostModelOpen}
              setPatchData={setPatchData}
              setMode={setMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
