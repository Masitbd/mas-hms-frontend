"use client";
import { useAppSelector } from "@/redux/hook";
import React, { useState } from "react";
import { Button, Modal, Schema, Form, Loader, Input } from "rsuite";
import RModal from "../ui/Modal";
import BacteriaForm from "./BacteriaForm";
import { IBacteria } from "@/app/(withlayout)/bacteria/page";
import { ICondition } from "@/types/allDepartmentInterfaces";
const PatchBacteria = ({
  open,
  patchBacteria,
  cancelHandler,
  defalutValue,
}: {
  open: boolean;
  patchBacteria: ({ data, id }: { data: IBacteria; id: string }) => void;
  cancelHandler: () => void;
  defalutValue: ICondition;
}) => {
  const { StringType } = Schema.Types;
  const formRef: React.MutableRefObject<any> = React.useRef();
  const model = Schema.Model({
    label: StringType().isRequired("This field is required."),
    description: StringType().isRequired("This field is required."),
  });

  const [formData, setFormData] = useState<{
    label: string;
    description: string;
    value: string;
  }>(defalutValue);
  const handleSubmit = () => {
    if (formRef.current.check()) {
      formData.value = formData.label.toLowerCase();
      patchBacteria({ data: formData, id: defalutValue._id as string });
    } else {
    }
  };

  return (
    <>
      <RModal
        cancelHandler={cancelHandler}
        okHandler={handleSubmit}
        open={open}
        size="sm"
        title="Add New bacteria For microbiology test"
      >
        <BacteriaForm
          forwardedRef={formRef}
          model={model}
          setFormData={setFormData}
          defaultValue={defalutValue}
        ></BacteriaForm>
      </RModal>
    </>
  );
};

export default PatchBacteria;
