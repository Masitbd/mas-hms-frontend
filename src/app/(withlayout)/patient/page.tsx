"use client";
import PatientForm from "@/components/patient/PatientForm";
import PatientTable from "@/components/patient/PatientTable";
import RModal from "@/components/ui/Modal";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import ImageUpload from "@/lib/AllReusableFunctions/ImageUploader";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import {
  usePatchPatientMutation,
  usePostPatientMutation,
} from "@/redux/api/patient/patientSlice";
import React, { useEffect, useRef, useState } from "react";
import { Button, Message, Schema, toaster } from "rsuite";
export type IPatient1 = {
  name: string;
  fatherName: string;
  motherName?: string;
  age: string;
  gender: string;
  presentAddress: string;
  permanentAddress?: string;
  maritalStatus?: string;
  dateOfBirth?: {};
  district?: string;
  religion?: string;
  nationality?: string;
  admissionDate?: {};
  bloodGroup?: string;
  passportNo?: string;
  courseDuration?: string;
  typeOfDisease?: string;
  nationalID?: string;
  totalAmount?: string;
  ref_by?: string;
  consultant?: string;
  phone: string;
  email?: string;
  image?: string;
};

const initialPatientData = {
  name: "",
  fatherName: "",
  motherName: "",
  age: "",
  gender: "",
  presentAddress: "",
  permanentAddress: "",
  maritalStatus: "",
  dateOfBirth: new Date(),
  district: "",
  religion: "",
  nationality: "",
  admissionDate: new Date(),
  bloodGroup: "",
  passportNo: "",
  courseDuration: "",
  typeOfDisease: "",
  nationalID: "",
  totalAmount: "",
  ref_by: "",
  consultant: "",
  phone: "",
  email: "",
  image: "",
};

const Patient = () => {
  const { StringType, NumberType, ArrayType } = Schema.Types;
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<IPatient1>(initialPatientData);
  const [mode, setMode] = useState("new");
  const [
    postPatient,
    { isLoading: postPatientLoading, isSuccess: postPatientSuccess },
  ] = usePostPatientMutation();
  const [patchPatient] = usePatchPatientMutation();
  const ref: React.MutableRefObject<any> = useRef();
  const fileRef: React.MutableRefObject<any> = useRef();
  const modalCancelHandler = () => {
    setModalOpen(!modalOpen);
    setFormData(initialPatientData);
    setMode("new");
  };
  const modalOKHandler = async () => {
    if (ref.current.check()) {
      if (mode == "new") {
        await ImageUpload(fileRef.current?.files?.[0], (value) => {
          return (formData.image = value as string);
        });
        formData.image =
          formData.image ||
          "https://res.cloudinary.com/deildnpys/image/upload/v1707574218/myUploads/wrm6s87apasmhne3soyb.jpg";
        await postPatient(formData);
        console.log("data2", formData);
        console.log("1");
      }
      if (mode == "patch") {
        formData.image = formData.image;
        patchPatient(formData);
      }
      if (mode == "watch") {
        setFormData(initialPatientData);
        setModalOpen(!modalOpen);
      }
    }
  };
  const model = Schema.Model({
    name: StringType().isRequired("This field is required."),
    age: StringType().isRequired("This field is required."),
    gender: StringType().isRequired("This field is required."),
    presentAddress: StringType().isRequired("This field is required."),
    phone: StringType().isRequired("This field is required."),
    email: StringType().isRequired("This field is required."),
    ref_by: StringType().isRequired("This field is required."),
    consultant: StringType().isRequired("This field is required."),
  });

  // For patch
  const patchHandler = (data: {
    data: React.SetStateAction<IPatient1>;
    mode: React.SetStateAction<string>;
  }) => {
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
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Registered Patients
          </h2>
        </div>
        <div className="p-2">
          <AuthCheckerForComponent
            requiredPermission={[ENUM_USER_PEMISSION.MANAGE_PATIENT]}
          >
            <div className="my-5">
              <Button
                appearance="primary"
                color="blue"
                onClick={() => setModalOpen(!modalOpen)}
              >
                Register New Patient
              </Button>
            </div>
          </AuthCheckerForComponent>
          <div>
            <RModal
              open={modalOpen}
              size="xl"
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
                fileRef={fileRef}
                model={model}
                defaultValue={formData}
              />
            </RModal>
          </div>
          <div>
            <PatientTable patchHandler={patchHandler} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patient;
