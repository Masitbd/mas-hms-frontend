import { useGetDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import { IDoctor } from "@/types/allDepartmentInterfaces";
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  InputPicker,
  Message,
  Schema,
  Table,
  TagPicker,
  Toggle,
  toaster,
} from "rsuite";

const PatientForm = ({
  defaultValue,
  forwardedRef,
  formData,
  setfromData,
  mode,
  model,
}: {
  defaultValue?: any;
  forwardedRef: any;
  formData: any;
  setfromData: (data: any) => void;
  mode: string;
  model: any;
}) => {
  const genderType = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "other" },
  ];
  const { data: doctorData } = useGetDoctorQuery(undefined);
  return (
    <div className=" px-5 ">
      <div className="my-5">
        <h1 className="font-bold text-2xl">General Information</h1>
        <hr></hr>
      </div>
      <div></div>
      <Form
        onChange={setfromData}
        ref={forwardedRef}
        model={model}
        className="grid grid-cols-3 gap-5 justify-center w-full"
        fluid
        formValue={defaultValue}
        readOnly={mode === "watch"}
      >
        <Form.Group controlId="name">
          <Form.ControlLabel>Name</Form.ControlLabel>
          <Form.Control name="name" htmlSize={100} />
        </Form.Group>
        <Form.Group controlId="age">
          <Form.ControlLabel>Age</Form.ControlLabel>
          <Form.Control name="age" htmlSize={100} />
        </Form.Group>
        <Form.Group controlId="gender">
          <Form.ControlLabel>Gender</Form.ControlLabel>
          <Form.Control
            name="gender"
            accepter={InputPicker}
            data={genderType}
            className="w-full"
          />
        </Form.Group>
        <Form.Group controlId="address">
          <Form.ControlLabel>Address</Form.ControlLabel>
          <Form.Control name="address" className="w-full" />
        </Form.Group>
        <Form.Group controlId="phone">
          <Form.ControlLabel>Phone</Form.ControlLabel>
          <Form.Control name="phone" className="w-full" />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.ControlLabel>Email</Form.ControlLabel>
          <Form.Control name="email" type="email" />
        </Form.Group>
        <Form.Group controlId="ref_by">
          <Form.ControlLabel>Refered By</Form.ControlLabel>
          <Form.Control
            name="ref_by"
            accepter={InputPicker}
            data={doctorData?.data.map((data: IDoctor) => {
              return { label: data.name, value: data._id };
            })}
            className="w-full"
          />
        </Form.Group>
        <Form.Group controlId="consultant">
          <Form.ControlLabel>Consultent</Form.ControlLabel>
          <Form.Control
            name="consultant"
            accepter={InputPicker}
            data={doctorData?.data.map((data: IDoctor) => {
              return { label: data.name, value: data._id };
            })}
            className="w-full"
          />
        </Form.Group>
      </Form>
      {/* Result Fields */}
    </div>
  );
};

export default PatientForm;
