"use client";

import {
  Button,
  Form,
  Message,
  Schema,
  SelectPicker,
  useToaster,
} from "rsuite";

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
import { aInitialData } from "./patient.contance";
import { useAppSelector } from "@/redux/hook";

const { StringType, NumberType } = Schema.Types;
const patientModel = Schema.Model({
  name: StringType().isRequired("This field is required."),
  age: StringType().isRequired("This field is required."),
  gender: StringType().isRequired("This field is required."),
  // phone: NumberType()
  //   .isRequired("This field is required.")
  //   .addRule((value: string | number): boolean => {
  //     const phoneNumber = value.toString();
  //     return phoneNumber.length === 11;
  //   }, "Phone number must be 11 digits."),
});

const AdmitPatientModal = () => {
  const refForUnregistered: React.MutableRefObject<any> = useRef();
  const patientTypeRef: React.MutableRefObject<any> = useRef();
  const formRef = useRef<any>(null);
  const toaster = useToaster();

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
  const currentUser = useAppSelector((state) => state.auth.user);
  // console.log(currentUser, "user");

  // console.log(data, "submti data");

  const [createAdmission, { isLoading }] = useCreateAdmissionMutation();

  const initialValue = {
    worldName: null,
    charge: null,
    fees: null,
  };

  const [formValue, setFormValue] = useState(initialValue);

  // const handleFormChange = (updatedValue: Record<string, any>) => {
  //   setFormValue((prev) => ({ ...prev, ...updatedValue }));
  // };
  const handleFormChange = useCallback((value: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...value }));
  }, []);

  const handleSubmit = async () => {
    formRef.current
      ?.checkAsync()
      .then(async (result: { hasError: boolean; formError: any }) => {
        if (result?.hasError) {
          // Check the specific errors
          const errors = Object.keys(result?.formError || {});

          errors.forEach((errorField) => {
            toaster.push(
              <Message showIcon type="error" closable>
                `<strong> {errorField} </strong> is Required`.
              </Message>,
              { duration: 2000 }
            );
          });
        } else {
          try {
            data.receivedBy = currentUser?.uuid;

            const res = await createAdmission(data).unwrap();
            if (res.success) {
              setModalOpen(false);
            }
          } catch (err) {
            console.log(err, "Error during submission");
          }
        }
      });
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
          <Form
            ref={formRef}
            fluid
            model={patientModel}
            formValue={data}
            onChange={handleFormChange}
          >
            <PInfo
              data={data}
              setFormData={setFromData}
              forwardedRefForUnregisterd={refForUnregistered}
              forwardedRefForPatientType={patientTypeRef}
              key={2589}
              mode={mode}
            />

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
                    (data.paid || 0)
                  ).toFixed(2)}
                  data={data}
                  mode={mode}
                />

                <AdmissionPricing
                  data={data}
                  setFormData={setFromData as React.SetStateAction<any>}
                  // discountAmount={discountAmount}
                  totalAmount={totalAmount}
                  vatAmount={vatAmount}
                  mode={mode}
                />
              </div>
            </div>

            <ForDewCollection
              data={data as unknown as IOrderData}
              dewModalOpen={dewModalOpen}
              setDewModalOpen={setDewMOdalOpen}
              setFormData={setFromData as React.SetStateAction<any>}
            />
          </Form>
        </RModal>
      )}
    </div>
  );
};

export default AdmitPatientModal;
