"use client";

import AdmitPatientModal from "@/components/Patient-Admission/AdmitPatientModal";
import AdmissionTable from "@/components/Patient-Admission/AdmissionTable";
import { useGetAllAdmissionQuery } from "@/redux/api/admission.api";

const PatientAdmissionPage = () => {
  const { data: patients, isLoading } = useGetAllAdmissionQuery(undefined);


  return (
    <div>
      <div className="bg-[#3498ff] text-white px-2 py-2 my-10">
        <h2 className="text-center text-xl font-semibold">Patient Admission</h2>
      </div>
      <div className="px-10">
        <AdmitPatientModal />
      </div>
      <div className="mt-10">
        <AdmissionTable data={patients?.data?.result} />
      </div>
    </div>
  );
};

export default PatientAdmissionPage;
