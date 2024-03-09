"use client";
import PatientForm from "@/components/patient/PatientForm";
import PatientTable from "@/components/patient/PatientTable";
import RModal from "@/components/ui/Modal";
import {
  usePatchPatientMutation,
  usePostPatientMutation,
} from "@/redux/api/patient/patientSlice";
import React, { useEffect, useRef, useState } from "react";
import { Button, Message, Schema, toaster } from "rsuite";

const Patient = () => {
  const { StringType, NumberType, ArrayType } = Schema.Types;
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [mode, setMode] = useState("new");
  const [
    postPatient,
    { isLoading: postPatientLoading, isSuccess: postPatientSuccess },
  ] = usePostPatientMutation();
  const [patchPatient] = usePatchPatientMutation();
  const ref: React.MutableRefObject<any> = useRef();
  const modalCancelHandler = () => {
    setModalOpen(!modalOpen);
    setFormData(undefined);
  };
  const modalOKHandler = () => {
    if (ref.current.check()) {
      if (mode == "new") {
        postPatient(formData);
      }
      if (mode == "patch") {
        patchPatient(formData);
      }
    }
  };
  const model = Schema.Model({
    name: StringType().isRequired("This field is required."),
    age: StringType().isRequired("This field is required."),
    gender: StringType().isRequired("This field is required."),
    address: StringType().isRequired("This field is required."),
    phone: StringType().isRequired("This field is required."),
    email: StringType().isRequired("This field is required."),
    // ref_by: NumberType().isRequired("This field is required."),
    // consultant: ArrayType().isRequired("This field is required."),
  });

  // For patch
  const patchHandler = (data) => {
    setFormData(data.data);
    setMode(data.mode);
    setModalOpen(!modalOpen);
  };

  // For toaster
  useEffect(() => {
    if (postPatientSuccess) {
      toaster.push(
        <Message type="success">Operation Performed Successffully</Message>
      );
      setModalOpen(!modalOpen);
    }
  }, [postPatientSuccess]);
  return (
    <div>
      <div className="my-5">
        <Button
          appearance="primary"
          color="blue"
          onClick={() => setModalOpen(!modalOpen)}
        >
          Register New Patient
        </Button>
      </div>
      <div>
        <RModal
          open={modalOpen}
          size="md"
          title="Register New Patient"
          key={"55"}
          cancelHandler={modalCancelHandler}
          okHandler={modalOKHandler}
        >
          <PatientForm
            formData={formData}
            setfromData={setFormData}
            mode={mode}
            forwardedRef={ref}
            model={model}
            defaultValue={formData}
          />
        </RModal>
      </div>
      <div>
        <PatientTable patchHandler={patchHandler} />
      </div>
    </div>
  );
};

export default Patient;
