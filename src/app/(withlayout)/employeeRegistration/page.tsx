"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  useGetemployeeRegistrationQuery,
  useDeleteemployeeRegistrationMutation,
  useGetSingleemployeeRegistrationMutation,
  usePatchemployeeRegistrationMutation,
  usePostEmployeeRegistrationMutation,
} from "@/redux/api/employeeRegistration/employeeRegistrationSlice";
import { Button, Message, Schema, toaster } from "rsuite";
import RModal from "@/components/ui/Modal";
import EmployeeRegistrationForm from "@/components/employeeRegistration/EmployeeRegistrationForm";
import EmployeeRegistrationTable from "@/components/employeeRegistration/EmployeeRegistrationTable";

export type IEmployeeRegistration = {
  _id?: string;
  label: string;
  fatherName: string;
  motherName: string;
  gender: string;
  dateOfBirth: Date;
  age: number;
  religion: string;
  nationality: string;
  maritalStatus: string;
  presentAddress: string;
  parmanentAddress: string;
  district: string;
  phoneNumber: string;
  email: string;
  image: string;
  defaultImage?: string;
};
const EmplpyeeRegistration = () => {
  const { StringType, NumberType, ArrayType } = Schema.Types;
  const [defaultValue, setDefaultValue] =
    useState<IEmployeeRegistration | null>();
  const [formData, setfromData] = useState<any | null>({
    label: "",
    fatherName: "",
    motherName: "",
    gender: "",
    dateOfBirth: new Date(),
    age: 0,
    religion: "",
    nationality: "",
    maritalStatus: "",
    presentAddress: "",
    parmanentAddress: "",
    district: "",
    phoneNumber: "",
    email: "",
    image: "",
  });
  console.log("formData is", formData);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("new");
  const [
    postEmployeeRegistration,
    {
      isLoading: employeeLoading,
      isSuccess: newEmployeeSuccess,
      isError: testErrors,
    },
  ] = usePostEmployeeRegistrationMutation();
  const { data: existingData, isLoading: existingDataLoading } =
    useGetemployeeRegistrationQuery(undefined);

  const [patchEmployeeRegistration, { isSuccess: patchEmployeeSuccess }] =
    usePatchemployeeRegistrationMutation();
  const ref: React.MutableRefObject<any> = useRef();

  const cancelHandler = () => {
    setModalOpen(!modalOpen);
    setfromData(undefined);
    setDefaultValue(undefined);
  };

  const modalHandler = () => {
    setModalOpen(!modalOpen);
    setMode("new");
  };

  const okHandler = () => {
    if (ref.current.check()) {
      setModalOpen(!modalOpen);
      formData.value = formData?.label.toLowerCase();
      console.log("hello current1", formData?.value);

      console.log("hello current", ref.current.check());
      if (mode === "new") {
        postEmployeeRegistration(formData);
      }
      if (mode === "patch") {
        patchEmployeeRegistration({ data: formData, id: formData.id });
        setfromData({
          label: "",
          fatherName: "",
          motherName: "",
          gender: "",
          dateOfBirth: new Date(),
          age: 0,
          religion: "",
          nationality: "",
          maritalStatus: "",
          presentAddress: "",
          parmanentAddress: "",
          district: "",
          phoneNumber: "",
          email: "",
          image: "",
        });
      }
      if (mode === "watch") {
        patchEmployeeRegistration({ data: formData, id: formData.id });
        setfromData({
          label: "",
          fatherName: "",
          motherName: "",
          gender: "",
          dateOfBirth: new Date(),
          age: 0,
          religion: "",
          nationality: "",
          maritalStatus: "",
          presentAddress: "",
          parmanentAddress: "",
          district: "",
          phoneNumber: "",
          email: "",
          image: "",
        });
      }
    } else {
      toaster.push(
        <Message type="error" title="Error !!!">
          Fill out all the fields of the form{" "}
        </Message>
      );
    }
  };

  useEffect(() => {
    if (newEmployeeSuccess) {
      toaster.push(
        <Message type="success">New employee crated Successfully</Message>
      );
    }
  }, []);

  const patchHandler = ({
    data,
    mode,
  }: {
    data: IEmployeeRegistration;
    mode: string;
  }) => {
    setModalOpen(!modalOpen);
    setMode(mode);
    setDefaultValue(data);
    setfromData(data);
  };

  const model = Schema.Model({
    label: StringType().isRequired("Employee name is required."),
    fatherName: StringType().isRequired("Father name is required."),
    phoneNo: StringType().isRequired("Phone number is required."),
    gender: StringType().isRequired("Gender is required."),
    email: StringType().isRequired("Email is required."),
    parmanentAddress: StringType().isRequired("Parmanent address is required."),
  });

  return (
    <div>
      <div>
        <RModal
          cancelHandler={cancelHandler}
          okHandler={okHandler}
          open={modalOpen}
          size="lg"
          title={mode === "new" ? "Add New Employee" : "Edit Employee"}
        >
          <EmployeeRegistrationForm
            model={model}
            defaultValue={defaultValue}
            formData={formData}
            setfromData={setfromData}
            forwardedRef={ref}
            mode={mode}
          ></EmployeeRegistrationForm>
        </RModal>
      </div>
      <div className="my-5">
        <Button
          onClick={() => modalHandler()}
          appearance="primary"
          color="blue"
        >
          Add New Employee
        </Button>
      </div>
      <div className="mx-5">
        <EmployeeRegistrationTable patchHandler={patchHandler} />
      </div>
    </div>
  );
};

export default EmplpyeeRegistration;
