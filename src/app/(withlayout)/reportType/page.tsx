"use client";
import ReportGroupTable from "@/components/reportType/ReportGroupTable";
import { IReportGroupFormData } from "@/components/reportType/initialDataAndTypes";
import { useGetDepartmentQuery } from "@/redux/api/department/departmentSlice";
import { IDepartment } from "@/types/allDepartmentInterfaces";
import React, { SetStateAction, useState } from "react";
import { Button, Form, InputPicker } from "rsuite";
import ReportGroupForm from "../../../components/reportType/ReportGroupForm";
import { ENUM_MODE } from "@/enum/Mode";
import ReportGroupTab from "@/components/reportType/ReportGroupTab";

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
