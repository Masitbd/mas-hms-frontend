"use client";
import ReportGroupTable from "@/components/reportGroup/ReportGroupTable";
import { IReportGroupFormData } from "@/components/reportGroup/initialDataAndTypes";
import { useGetDepartmentQuery } from "@/redux/api/department/departmentSlice";
import { IDepartment } from "@/types/allDepartmentInterfaces";
import React, { SetStateAction, useState } from "react";
import { Button, Form, InputPicker } from "rsuite";
import ReportGroupForm from "../../../components/reportGroup/ReportGroupForm";
import { ENUM_MODE } from "@/enum/Mode";
import ReportGroupTab from "@/components/reportGroup/ReportGroupTab";

const ReportGroup = () => {
  return (
    <div>
      <div>
        <ReportGroupTab />
      </div>

      {/* for form and will be moved */}
    </div>
  );
};

export default ReportGroup;
