"use client";
import {
  initialPatientData,
  IPatient1,
  model,
} from "@/components/patient/patientConstant";
import PatientForm from "@/components/patient/PatientForm";
import PatientTable from "@/components/patient/PatientTable";
import RModal from "@/components/ui/Modal";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import { ENUM_MODE } from "@/enum/Mode";
import useCloudinaryUpload from "@/hooks/useCloudinaryImageUpload";
import ImageUpload from "@/lib/AllReusableFunctions/ImageUploader";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import {
  usePatchPatientMutation,
  usePostPatientMutation,
} from "@/redux/api/patient/patientSlice";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Message, Schema, toaster } from "rsuite";
import swal from "sweetalert";

const Patient = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<IPatient1>(
    initialPatientData as unknown as IPatient1
  );
  const [mode, setMode] = useState("new");
  const [
    postPatient,
    { isLoading: postPatientLoading, isSuccess: postPatientSuccess },
  ] = usePostPatientMutation();
  const [patchPatient, { isLoading: patchLoading }] = usePatchPatientMutation();
  const ref: React.MutableRefObject<any> = useRef();
  const fileRef: React.MutableRefObject<any> = useRef();
  const modalCancelHandler = () => {
    setModalOpen(!modalOpen);
    setFormData(initialPatientData as unknown as IPatient1);
    setMode("new");
    setImage(undefined);
  };
  const { error, loading, responseData, uploadImage } = useCloudinaryUpload();
  const [image, setImage] = useState();
  const modalOKHandler = async () => {
    if (ref.current.check()) {
      if (mode == ENUM_MODE.NEW || mode == ENUM_MODE.EDIT || mode == "patch") {
        const postData = Object.assign({}, formData);
        if (ImageData) {
          const imageUploadData = await uploadImage(image as unknown as File);
          postData.image = imageUploadData?.secure_url;
          postData.publicId = imageUploadData?.public_id as string;
        }

        if (mode == "new") {
          const result = await postPatient(postData).unwrap();
          if (result?.success) {
            swal("Success", "Patient data posted successfully", "success");
            modalCancelHandler();
          }
        }
        if (mode == "patch") {
          const result = await patchPatient(postData).unwrap();
          if (result?.success) {
            swal("Success", "Patient data posted successfully", "success");
            modalCancelHandler();
          }
        }
      }
      if (mode == "watch") {
        setFormData(initialPatientData);
        setModalOpen(!modalOpen);
      }
    }
  };

  // For patch
  const patchHandler = (data: {
    data: React.SetStateAction<IPatient1>;
    mode: React.SetStateAction<string>;
  }) => {
    setFormData(data.data);
    setMode(data.mode);
    setModalOpen(!modalOpen);
  };

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
              loading={postPatientLoading || loading || patchLoading}
            >
              <PatientForm
                formData={formData}
                setfromData={
                  setFormData as Dispatch<SetStateAction<Record<string, any>>>
                }
                mode={mode}
                forwardedRef={ref}
                fileRef={fileRef}
                model={model}
                defaultValue={formData}
                image={image}
                setImage={setImage}
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
