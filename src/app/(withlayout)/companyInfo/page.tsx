/* eslint-disable react/no-children-prop */
"use client";
import CompnayInfoTable from "@/components/companyInfo/companyInfoTable";
import LogoUploader from "@/components/companyInfo/LogoUploader";
import NewAndPatch from "@/components/companyInfo/NewAndPatch";
import { Textarea } from "@/components/companyInfo/TextArea";
import {
  DefaultCompanyData,
  ICompanyInfo,
} from "@/components/companyInfo/TypesAndDefaults";
import React, { useState } from "react";
import { Button, Checkbox, Form, Table, Tag } from "rsuite";

const CompanyInfo = () => {
  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">Company Info</h2>
        </div>
        <div className="mx-2">
          <CompnayInfoTable />
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
