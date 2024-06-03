"use client";
import { useAppSelector } from "@/redux/hook";
import React, { useEffect, useState } from "react";
import { Schema, toaster, Message } from "rsuite";
import RModal from "../ui/Modal";
import { IPermission } from "@/app/(withlayout)/permission/page";

import { setLoading } from "@/redux/features/loading/loading";
import PermissonForm from "./PermissonForm";
import { usePostPermissionMutation } from "@/redux/api/permission/permissonSlice";
const NewPermission = ({
  open,
  cancelHandler,
  modalStatusHandler,
}: {
  open: boolean;
  cancelHandler: () => void;
  modalStatusHandler: (data: boolean) => void;
}) => {
  const [
    postPermission,
    { isError, isLoading: conditionLoading, isSuccess, error },
  ] = usePostPermissionMutation();

  useEffect(() => {
    if (isSuccess) {
      toaster.push(
        <Message type="success">Permission Added Successfully</Message>,
        {
          duration: 3000,
        }
      );
      modalStatusHandler(!open);
      setLoading(false);
    }
    if (conditionLoading) {
      setLoading(true);
    }

    if (isError) {
      setLoading(false);
      toaster.push(
        <Message type="error">
          Something went wrong please try again letter
        </Message>,
        {
          duration: 3000,
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditionLoading, isError, isSuccess]);
  const { StringType } = Schema.Types;
  const formRef: React.MutableRefObject<any> = React.useRef();

  const model = Schema.Model({
    label: StringType().isRequired("This field is required."),
    code: StringType().isRequired("This field is required."),
  });

  const [pdrvData, setPdrvData] = useState<IPermission>({
    label: "",

    code: NaN,
  });
  const handleSubmit = () => {
    if (formRef.current.check()) {
    pdrvData.code = Number(pdrvData.code)
      postPermission(pdrvData);
    } else {
    }
  };
  return (
    <>
      <RModal
        size="xs"
        title="Add New Pdrv"
        open={open}
        cancelHandler={cancelHandler}
        okHandler={handleSubmit}
      >
        <PermissonForm
          forwardedRef={formRef}
          model={model}
          setFormData={setPdrvData}
        />
      </RModal>
    </>
  );
};

export default NewPermission;
