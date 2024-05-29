"use client";
import { useAppSelector } from "@/redux/hook";
import React, { useEffect, useState } from "react";
import { Schema, toaster, Message } from "rsuite";
import RModal from "../ui/Modal";
import PdrvForm from "./PdrvForm";
import { IPdrv } from "@/app/(withlayout)/pdrv/page";
import { usePostPdrvMutation } from "@/redux/api/pdrv/pdrvSlice";
import { setLoading } from "@/redux/features/loading/loading";
const NewPdrv = ({
  open,
  cancelHandler,
  modalStatusHandler,
}: {
  open: boolean;
  cancelHandler: () => void;
  modalStatusHandler: (data: boolean) => void;
}) => {
  const [postPdrv, { isError, isLoading: conditionLoading, isSuccess, error }] =
    usePostPdrvMutation();

  useEffect(() => {
    if (isSuccess) {
      toaster.push(<Message type="success">Pdrv Added Successfully</Message>, {
        duration: 3000,
      });
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
    description: StringType().isRequired("This field is required."),
  });

  const [pdrvData, setPdrvData] = useState<IPdrv>({
    label: "",
    description: "",
    value: "",
  });
  const handleSubmit = () => {
    if (formRef.current.check()) {
      pdrvData.value = pdrvData.label.toLowerCase();
      postPdrv(pdrvData);
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
        <PdrvForm
          forwardedRef={formRef}
          model={model}
          setFormData={setPdrvData}
        ></PdrvForm>
      </RModal>
    </>
  );
};

export default NewPdrv;
