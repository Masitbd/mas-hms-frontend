import Loading from "@/app/loading";
import AdmissionDetilsPage from "@/components/admission/ExistingAdmission";
import React, { Suspense } from "react";

const OldAdmission = () => {
  return (
    <Suspense fallback={<Loading />}>
      <AdmissionDetilsPage />
    </Suspense>
  );
};

export default OldAdmission;
