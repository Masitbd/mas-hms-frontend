import Loading from "@/app/loading";
import AdmissionEditPage from "@/components/Patient-Admission/AdmissionEdit";
import React, { Suspense } from "react";

const AdmissionUpdate = () => {
  return (
    <Suspense fallback={<Loading />}>
      <AdmissionEditPage />
    </Suspense>
  );
};

export default AdmissionUpdate;
