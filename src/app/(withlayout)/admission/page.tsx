import AdmitPatientModal from "@/components/Patient-Admission/AdminPatientModal";
import AdmissionTable from "@/components/Patient-Admission/AdmissionTable";

const PatientAdmissionPage = () => {
  return (
    <div>
      <div className="bg-[#3498ff] text-white px-2 py-2 my-10">
        <h2 className="text-center text-xl font-semibold">Patient Admission</h2>
      </div>
      <div className="px-10">
        <AdmitPatientModal />
      </div>
      <div className="mt-10">
        <AdmissionTable />
      </div>
    </div>
  );
};

export default PatientAdmissionPage;
