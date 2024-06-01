import React, { SetStateAction, useEffect, useState } from "react";
import {
  IInitialData,
  IOrderData,
  InitialData,
  IpatientInforMationProps,
  patientType,
} from "./initialDataAndTypes";
import ForRegistered from "./ForRegistered";
import ForNotRegistered from "./ForNotRegistered";
import { useGetDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import { useLazyGetSinglePatientQuery } from "@/redux/api/patient/patientSlice";
import { Form, Input, InputGroup, InputPicker, Message, toaster } from "rsuite";

const PatientInformation = (porps: IpatientInforMationProps) => {
  const {
    data,
    setFormData,
    forwardedRefForUnregisterd,
    forwardedRefForPatientType,
  } = porps;
  const { data: doctorData } = useGetDoctorQuery(undefined);
  const [
    patientSearch,
    { data: patientSearchData, isError: patientSearchError },
  ] = useLazyGetSinglePatientQuery();

  const searchHandler = async (value: string) => {
    const sdata = await patientSearch(value);
    setFormData({ ...data, patient: sdata?.data?.data });
    if (sdata?.data?.data?.ref_by) {
      setFormData({ ...data, refBy: sdata.data.data.ref_by });
    }
  };

  useEffect(() => {
    if (patientSearchError) {
      toaster.push(<Message>Search Error ! Please try again letter</Message>);
    }
  }, [patientSearchError]);

  return (
    <div>
      {/* For selecting patient type */}
      <Form
        onChange={(value, event) =>
          setFormData((prevData) => ({
            ...prevData,
            patientType: value.patientType,
          }))
        }
        fluid
        className="grid grid-cols-2"
        formValue={data}
        ref={forwardedRefForPatientType}
      >
        <Form.Group controlId="patientType">
          <Form.ControlLabel>Patient Type</Form.ControlLabel>
          <Form.Control
            name="patientType"
            accepter={InputPicker}
            data={patientType}
          />
        </Form.Group>
      </Form>

      {/* For registered Patient to search patient with uuid */}

      {data?.patientType == "registered" && (
        <>
          <div className="mt-5">
            <h1 className="font-bold">Patient UUID</h1>
            <InputGroup>
              <Input name="value" onChange={searchHandler} width={50} />
            </InputGroup>
          </div>
        </>
      )}

      <div className="mt-5">
        {data.patientType === "registered" &&
          (data?.patient?._id ? (
            <ForRegistered
              doctors={doctorData.data}
              formData={data}
              patient={patientSearchData?.data ? patientSearchData.data : data}
              setFormData={setFormData}
            />
          ) : (
            <>
              <div className="h-24 flex justify-center items-center">
                No data founds
              </div>
            </>
          ))}
        {data.patientType === "notRegistered" && (
          <ForNotRegistered
            doctorData={doctorData?.data}
            setFromData={setFormData}
            data={data}
            forwardedRef={forwardedRefForUnregisterd}
          />
        )}
      </div>
    </div>
  );
};

export default PatientInformation;
