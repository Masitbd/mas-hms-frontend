"use client";
import React, { useState } from "react";
import RModal from "../ui/Modal";
import PdrvForm from "./PdrvForm";
import { Schema } from "rsuite";
import { IPdrv } from "@/app/(withlayout)/pdrv/page";
const PatchPdrv = ({
  open,
  patchPdrv,
  cancelHandler,
  defalutValue,
}: {
  open: boolean;
  patchPdrv: ({ data, id }: { data: IPdrv; id: string }) => void;
  cancelHandler: () => void;
  defalutValue: IPdrv;
}) => {
  const { StringType } = Schema.Types;
  const formRef: React.MutableRefObject<any> = React.useRef();
  const model = Schema.Model({
    label: StringType().isRequired("This field is required."),
    description: StringType().isRequired("This field is required."),
  });

  const [pdrvData, setPdrvData] = useState<{
    label: string;
    description: string;
    value: string;
  }>(defalutValue);
  const handleSubmit = () => {
    if (formRef.current.check()) {
      pdrvData.value = pdrvData.label.toLowerCase();
      patchPdrv({ data: pdrvData, id: defalutValue._id as string });
    } else {
    }
  };

  return (
    <>
      <RModal
        size={"xs"}
        title="Add New Pre determined Result Values"
        open={open}
        cancelHandler={cancelHandler}
        okHandler={handleSubmit}
      >
        <PdrvForm
          forwardedRef={formRef}
          model={model}
          setFormData={setPdrvData}
          defaultValue={defalutValue}
        ></PdrvForm>
      </RModal>
    </>
  );
};

export default PatchPdrv;
