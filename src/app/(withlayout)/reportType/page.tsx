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
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">Report Type</h2>
        </div>
        <div className="p-2">
          <div>
            <ReportGroupTab />
          </div>

          {/* for form and will be moved */}
        </div>
      </div>
    </div>
  );
};

export default ReportGroup;
