import Loading from "@/app/loading";
import MainComponent from "@/components/testReport/MainComponent";
import React, { Suspense } from "react";

const TestReport = () => {
  return (
    <Suspense fallback={<Loading />}>
      <MainComponent />
    </Suspense>
  );
};

export default TestReport;
