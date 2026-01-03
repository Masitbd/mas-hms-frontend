import Loading from "@/app/loading";
import TestsForLabel from "@/components/labelPrinting/LabelPrintingComponent";
import React, { Suspense } from "react";

const LabelPrint = () => {
  return (
    <Suspense fallback={<Loading />}>
      <TestsForLabel></TestsForLabel>
    </Suspense>
  );
};

export default LabelPrint;
