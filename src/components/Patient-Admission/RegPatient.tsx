import React, { useEffect } from "react";
import { IRegisteredPatient } from "../order/initialDataAndTypes";
import { patientFields } from "./patient.constance";

const RegisteredPatient = ({
  doctors,
  formData,
  patient,
  setFormData,
}: IRegisteredPatient) => {
  useEffect(() => {
    // Example: Automatically update the formData with patient name
    if (patient?.name) {
      setFormData((prev: any) => ({
        ...prev,

        ...prev.patient,
        name: patient.name, // or any other field you want to sync
      }));
    }
  }, [patient, setFormData]);

  return (
    <div className="contents patient-information-not-reg">
      {patientFields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <h2 className="font-bold">{field.label}</h2>
          <span className="font-[Roboto]">
            {formData.patient?.[field.name]}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RegisteredPatient;
