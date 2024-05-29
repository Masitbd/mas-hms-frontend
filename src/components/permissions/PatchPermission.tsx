"use client";
import React, { useState } from "react";
import RModal from "../ui/Modal";
import { Schema } from "rsuite";
import PermissonForm from "./PermissonForm";
import { IPermission } from "@/app/(withlayout)/permission/page";

const PatchPermission = ({
  open,
  patchPdrv,
  cancelHandler,
  defalutValue,
}: {
  open: boolean;
  patchPdrv: ({ data, id }: { data: IPermission; id: string }) => void;
  cancelHandler: () => void;
  defalutValue: IPermission;
}) => {
  const { StringType } = Schema.Types;
  const formRef: React.MutableRefObject<any> = React.useRef();
  const model = Schema.Model({
    label: StringType().isRequired("This field is required."),
    code: StringType().isRequired("This field is required."),
  });

  const [PermissionData, setPermission] = useState<{
    label: string;
    code: number;
  }>(defalutValue);
  const handleSubmit = () => {
    if (formRef.current.check()) {
      patchPdrv({ data: PermissionData, id: defalutValue._id as string });
    } else {
    }
  };

  return (
    <>
      <RModal
        size={"xs"}
        title="Add Permission"
        open={open}
        cancelHandler={cancelHandler}
        okHandler={handleSubmit}
      >
        <PermissonForm
          forwardedRef={formRef}
          model={model}
          setFormData={setPermission}
          defaultValue={defalutValue}
        />
      </RModal>
    </>
  );
};

export default PatchPermission;
