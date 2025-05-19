"use client";

import { useMemo } from "react";
import { bangladeshDistricts, religions } from "./patient.contance";
import { InputPicker, SelectPicker } from "rsuite";

const genderType = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "other" },
];

const bloodGroup = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const maritalStatus = [
  { label: "Married", value: "married" },
  { label: "Unmarried", value: "unmarried" },
];

const bloodGroupOptions = bloodGroup?.map((bld) => ({
  label: bld,
  value: bld,
}));

const districtsOptions = bangladeshDistricts.map((dt) => ({
  label: dt,
  value: dt,
}));

export const patientFields = [
  { label: "Name", name: "name" },
  { label: "Age", name: "age" },
  { label: "Phone", name: "phone" },
  {
    label: "Gender",
    name: "gender",
    accepter: InputPicker,
    data: genderType,
  },
  {
    label: "Blood Group",
    name: "bloodGroup",
    data: bloodGroupOptions,
    accepter: SelectPicker,
  },
  { label: "Guardian's Name", name: "fatherName" },
  { label: "Present Address", name: "presentAddress" },
  { label: "Permanent Address", name: "permanentAddress" },

  {
    label: "Marital Status",
    name: "maritalStatus",
    data: maritalStatus?.map((item) => ({
      label: item.label,
      value: item.value,
    })),
    accepter: SelectPicker,
  },
  { label: "Occupation", name: "occupation" },
  { label: "Education", name: "education" },
  {
    label: "District",
    name: "district",
    data: districtsOptions,
    accepter: SelectPicker,
  },
  {
    label: "Religion",
    name: "religion",
    data: religions.map((rl) => ({
      label: rl,
      value: rl,
    })),
    accepter: SelectPicker,
  },
  { label: "Residence", name: "residence" },
  { label: "Citizenship", name: "citizenShip" },
];
