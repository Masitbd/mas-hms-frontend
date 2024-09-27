"use client";
import EmployeeTable from "@/components/employee/EmployeeTable";
import NewAndPatch from "@/components/employee/NewAndPatch";
import {
  defaultEmployeeRegistration,
  IEmployeeRegistration,
} from "@/components/employee/TypesAndDefaults";
import { ENUM_MODE } from "@/enum/Mode";
import React, { useState } from "react";
import { Button } from "rsuite";

const Empoyee = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [data, setData] = useState<IEmployeeRegistration>(
    defaultEmployeeRegistration
  );
  const [mode, setMode] = useState<string>(ENUM_MODE.NEW);

  //   Handler funciton for new Button
  const newButtotHandler = () => {
    setModalOpen(true);
    setMode(ENUM_MODE.NEW);
  };
  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">Employees</h2>
        </div>
        <div className="mx-2 my-2">
          <Button
            onClick={() => newButtotHandler()}
            appearance="primary"
            color="blue"
          >
            Add New
          </Button>
        </div>
        <div>
          <EmployeeTable
            setData={setData}
            setMode={setMode}
            setModalOpen={setModalOpen}
          />
        </div>
        <div>
          <NewAndPatch
            data={data}
            setData={setData}
            setModalOpen={setModalOpen}
            setMode={setMode}
            key={2222}
            mode={mode}
            modalOpen={modalOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default Empoyee;
