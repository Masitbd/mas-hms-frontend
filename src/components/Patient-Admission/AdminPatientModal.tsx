"use client";

import { Button, Form, SelectPicker } from "rsuite";

import { useCallback, useRef, useState } from "react";

import RModal from "../ui/Modal";

import FInancialSection from "../order/FInancialSection";

import ForDewCollection from "../order/ForDewCollection";
import { ENUM_MODE } from "@/enum/Mode";

import {
  IAdmissionInitialData,
  IOrderData,
} from "../order/initialDataAndTypes";

import PInfo from "./PInfo";
import AdmissionInfo, { IAdmissionInitialDataParams } from "./AdmissionInfo";
import AdmissionPricing from "./AdmissionPricing";
import { useCreateAdmissionMutation } from "@/redux/api/admission.api";

export const aInitialData: IAdmissionInitialData = {
  totalAmount: 0,
  parcentDiscount: 0,
  cashDiscount: 0,
  vat: 0,
  paid: 0,

  discountedBy: "system",
  patientType: "notRegistered",
  regNo: "",
  name: "",
  gender: "",
  fatherName: "",
  presentAddress: "",
  permanentAddress: "",
  age: "",
  bloodGroup: "",
  status: "admitted",
  admissionDate: "",
  admissionTime: "",
  assignDoct: "",
  refDoct: "",
  releaseDate: "",

  maritalStatus: "",

  occupation: "",
  education: "",
  district: "",
  religion: "",
  residence: "",
  citizenShip: "",
  disease: "",
  isTransfer: false,
  allocatedBed: "",
  worldId: "",
  // deliveryTime: new Date(),
};

const AdmitPatientModal = () => {
  const refForUnregistered: React.MutableRefObject<any> = useRef();
  const patientTypeRef: React.MutableRefObject<any> = useRef();

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("new");
  const [dewModalOpen, setDewMOdalOpen] = useState(false);
  const [data, setFormData] = useState<IAdmissionInitialData>(aInitialData);
  const setFromData = useCallback(
    (update: (prev: IAdmissionInitialData) => IAdmissionInitialData) => {
      setFormData((prevState) => update(prevState));
    },
    []
  );
  // console.log(modalOpen, "open");

  // console.log(data, "submti data");

  const [createAdmission, { isLoading }] = useCreateAdmissionMutation();

  const initialValue = {
    worldName: null,
    charge: null,
    fees: null,
  };

  const [formValue, setFormValue] = useState(initialValue);

  const handleFormChange = (updatedValue: Record<string, any>) => {
    setFormValue((prev) => ({ ...prev, ...updatedValue }));
  };

  const handleSubmit = async () => {
    try {
      const res = await createAdmission(data).unwrap();
      if (res.success) {
        setModalOpen(false);
      }
    } catch (err) {
      console.log(err, "err");
    }
  };
  const okHandler = async () => {
    await handleSubmit();
  };

  const cancelHandler = () => {
    setModalOpen(!modalOpen);
    setFormData(aInitialData);
  };

  let vatAmount = 0;
  let discountAmount = 0;
  let totalAmount = 0;

  return (
    <div>
      <Button
        appearance="primary"
        color="blue"
        onClick={() => {
          setModalOpen(!modalOpen);
          setMode("new");
        }}
      >
        Admit Patient
      </Button>
      {modalOpen && (
        <RModal
          open={modalOpen}
          title={
            mode == ENUM_MODE.VIEW
              ? "Patient Information"
              : " Admit New Patient"
          }
          loading={isLoading}
          size="full"
          cancelHandler={cancelHandler}
          okHandler={okHandler}
        >
          <>
            <div>
              <PInfo
                data={data as unknown as IAdmissionInitialData}
                forwardedRefForUnregisterd={refForUnregistered}
                setFormData={setFromData as React.SetStateAction<any>}
                forwardedRefForPatientType={patientTypeRef}
                key={2589}
                mode={mode}
              />
            </div>

            <div className="my-2 grid grid-cols-12">
              <div className="col-span-8">
                <AdmissionInfo
                  formData={data}
                  setFormData={setFromData as React.SetStateAction<any>}
                />
              </div>
              <div className="col-span-4 ml-2">
                <FInancialSection
                  setData={setFromData}
                  dueAmount={(
                    totalAmount -
                    discountAmount +
                    vatAmount -
                    (data.paid ? data.paid : 0)
                  ).toFixed(2)}
                  data={data}
                  mode={mode}
                />

                <div>
                  <AdmissionPricing
                    data={data}
                    setFormData={setFromData as React.SetStateAction<any>}
                    discountAmount={discountAmount}
                    totalAmount={totalAmount}
                    vatAmount={vatAmount}
                    mode={mode}
                  />
                </div>
              </div>
            </div>
            <ForDewCollection
              data={data as unknown as IOrderData}
              dewModalOpen={dewModalOpen}
              setDewModalOpen={setDewMOdalOpen}
              setFormData={setFormData as any}
            />
          </>
        </RModal>
      )}
    </div>
  );
};

export default AdmitPatientModal;
