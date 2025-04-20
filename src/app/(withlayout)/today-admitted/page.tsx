"use client";

import AdmitOverPeriodTable from "@/components/Patient-Admission/AdmissionOverPeriodTable";
import { useGetTodayAdmissionPatientQuery } from "@/redux/api/admission.api";

const todayColumns = [
  {
    label: "Admission Date",
    field: "admissionDate",
    render: (row: any) => row.admissionDate?.substring(2, 10),
  },
  {
    label: "Release Date",
    field: "releaseDate",
    render: (row: any) => row.releaseDate.substring(2, 10),
  },
  { label: "Name", field: "name" },
  { label: "Bill No", field: "regNo" },
  { label: "Bed Name", field: "bedName" },
  { label: "Guardian Name", field: "fatherName" },
  { label: "Assign Doct", field: "doctName" },
];

const TodayAdmittedPage = () => {
  const { data, isLoading } = useGetTodayAdmissionPatientQuery(undefined);

  return (
    <div>
      <div className="bg-[#3498ff] text-white px-2 py-2">
        <h2 className="text-center text-xl font-semibold">
          Today Admitted Patient
        </h2>
      </div>
      {data && data?.data?.length > 0 && (
        <AdmitOverPeriodTable
          columns={todayColumns}
          title="Today's Admitted Patient"
          data={data.data}
        />
      )}
    </div>
  );
};

export default TodayAdmittedPage;
