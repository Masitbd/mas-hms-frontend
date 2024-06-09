"use client";
import React, { useEffect, useState } from "react";
import { Message, Schema, toaster } from "rsuite";
import RModal from "../ui/Modal";
import BacteriaForm from "./BacteriaForm";
import { IBacteria } from "@/app/(withlayout)/bacteria/page";
import { usePostBacteriaMutation } from "@/redux/api/bacteria/bacteriaSlice";
import { setLoading } from "@/redux/features/loading/loading";
const NewBacteria = ({
  open,
  cancelHandler,
  setModalStatus,
}: {
  open: boolean;
  cancelHandler: () => void;
  setModalStatus: (data: boolean) => void;
}) => {
  const [
    postBacteria,
    { isError, isLoading: conditionLoading, isSuccess, error },
  ] = usePostBacteriaMutation();

  useEffect(() => {
    if (isSuccess) {
      toaster.push(
        <Message type="success">Condition Added Successfully</Message>,
        {
          duration: 3000,
        }
      );
      setModalStatus(!open);
    }
    if (conditionLoading) {
    }

    if (isError) {
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

  const [fromData, setFromData] = useState<IBacteria>({
    label: "",
    description: "",
    value: "",
  });
  const handleSubmit = () => {
    if (formRef.current.check()) {
      fromData.value = fromData.label.toLowerCase();
      postBacteria(fromData);
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
        title="Add New Bacteria "
        loading={conditionLoading}
      >
        <BacteriaForm
          forwardedRef={formRef}
          model={model}
          setFormData={setFromData}
        ></BacteriaForm>
      </RModal>
    </>
  );
};

export default NewBacteria;
