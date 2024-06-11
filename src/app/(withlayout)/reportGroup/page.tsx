"use client";
import ReportGroupTable from "@/components/reportGroup/ReportGroupTable";
import { IReportGroupFormData } from "@/components/reportGroup/initialDataAndTypes";
import { useGetDepartmentQuery } from "@/redux/api/department/departmentSlice";
import { IDepartment } from "@/types/allDepartmentInterfaces";
import React, { SetStateAction, useState } from "react";
import { Button, Form, InputPicker } from "rsuite";
import ReportGroupForm from "./ReportGroupForm";
import { ENUM_MODE } from "@/enum/Mode";

const ReportGroup = () => {
  // For handelling the from
  const [formData, setFormData] =
    useState<SetStateAction<Partial<IReportGroupFormData>>>();
  const [mode, setMode] = useState(ENUM_MODE.NEW);

  return (
    <div>
      <div className="my-5">
        <Button appearance="primary" color="blue">
          Add New Report Group
        </Button>
      </div>
      {/* for form and will be moved */}
      <div className="">
        <ReportGroupForm
          hanlderFunction={setFormData}
          formData={formData as IReportGroupFormData}
          mode={mode}
        />
      </div>
      <div>
        <ReportGroupTable />
      </div>
    </div>
  );
};

export default ReportGroup;
