import React, { SetStateAction, useEffect, useState } from "react";
import {
  IpatientInforMationProps,
  patientType,
  unreagisteredPatientProfileDataPropertyNames,
} from "./initialDataAndTypes";
import ForRegistered from "./ForRegistered";
import ForNotRegistered from "./ForNotRegistered";
import { useGetDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import { useLazyGetSinglePatientQuery } from "@/redux/api/patient/patientSlice";
import {
  Form,
  Input,
  InputGroup,
  InputPicker,
  Loader,
  Message,
  toaster,
  Tooltip,
  Whisper,
} from "rsuite";
import { ENUM_MODE } from "@/enum/Mode";
import { IPatient } from "@/types/allDepartmentInterfaces";
import SearchPeopleIcon from "@rsuite/icons/SearchPeople";

const PatientInformation = (porps: IpatientInforMationProps) => {
  const {
    data,
    setFormData,
    forwardedRefForUnregisterd,
    forwardedRefForPatientType,
    mode,
  } = porps;
  const { data: doctorData } = useGetDoctorQuery(undefined);
  const [
    patientSearch,
    {
      data: patientSearchData,
      isError: patientSearchError,
      isLoading: patientDataLoading,
      isFetching: patientDataFeatching,
    },
  ] = useLazyGetSinglePatientQuery();

  const searchHandler = async (value: string) => {
    const sdata = await patientSearch(value);

    setFormData({ ...data, patient: sdata?.data?.data });
    if (sdata?.data?.data?._id) {
      setFormData({ ...data, patient: sdata.data.data });
    }
  };

  useEffect(() => {
    if (patientSearchError) {
      toaster.push(<Message>Search Error ! Please try again later</Message>);
    }
  }, [patientSearchError]);

  if (mode == ENUM_MODE.VIEW) {
    return (
      <>
        <div className="mb-5 border  shadow-lg">
          <div className="bg-[#3498ff] text-white px-2 py-2">
            <h2 className="text-center text-xl font-semibold">
              Patient Information
            </h2>
          </div>

          <hr />
          <div className="grid grid-cols-3 gap-5 py-2 px-2">
            {unreagisteredPatientProfileDataPropertyNames?.map(
              (value, index) => {
                return (
                  <>
                    <div className="flex flex-col" key={index}>
                      <div className="text-lg font-bold capitalize">
                        {value}
                      </div>
                      <div>{(data.patient as any)[value]}</div>
                    </div>
                  </>
                );
              }
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="border  shadow-lg">
      <div className="bg-[#3498ff] text-white ">
        <h2 className="text-center text-lg font-semibold">
          Patient Information
        </h2>
      </div>
      <div className="px-2 py-2">
        <div className="grid grid-cols-6 gap-5">
          <Form
            onChange={(value, event) =>
              setFormData((prevData) => ({
                ...prevData,
                patientType: value.patientType,
              }))
            }
            fluid
            formValue={data}
            ref={forwardedRefForPatientType}
          >
            <Form.Group controlId="patientType">
              <Form.ControlLabel className="font-bold">
                Patient Type
              </Form.ControlLabel>
              <Form.Control
                name="patientType"
                accepter={InputPicker}
                data={patientType}
                block
              />
            </Form.Group>
          </Form>
          {data?.patientType == "registered" && (
            <>
              <div className="">
                <h1 className="font-bold mb-[.32rem]">Patient UUID</h1>
                <Whisper
                  speaker={
                    <Tooltip
                      visible={
                        !patientDataFeatching &&
                        !patientDataLoading &&
                        data?.patient?._id
                      }
                      color="red"
                    >
                      No Data Found
                    </Tooltip>
                  }
                >
                  <InputGroup>
                    <Input name="value" onChange={searchHandler} />
                    <InputGroup.Addon>
                      {patientDataFeatching || patientDataLoading ? (
                        <Loader />
                      ) : (
                        <SearchPeopleIcon
                          color={`${
                            !patientDataFeatching &&
                            !patientDataLoading &&
                            !data?.patient?._id &&
                            "red"
                          }`}
                        />
                      )}
                    </InputGroup.Addon>
                  </InputGroup>
                </Whisper>
              </div>
            </>
          )}
          {data.patientType === "registered" && data?.patient?._id && (
            <ForRegistered
              doctors={doctorData?.data}
              formData={data}
              patient={patientSearchData?.data ? patientSearchData?.data : data}
              setFormData={setFormData}
            />
          )}
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
    </div>
  );
};

export default PatientInformation;
