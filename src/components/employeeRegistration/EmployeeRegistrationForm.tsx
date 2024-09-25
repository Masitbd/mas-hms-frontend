"use client";
import {
  usePatchemployeeRegistrationMutation,
  usePostEmployeeRegistrationMutation,
} from "@/redux/api/employeeRegistration/employeeRegistrationSlice";
import { useAppSelector } from "@/redux/hook";
import React, { useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Grid,
  Input,
  InputPicker,
  Loader,
  Modal,
  Row,
  Schema,
  Uploader,
} from "rsuite";
/* const Textarea = React.forwardRef<HTMLTextAreaElement, any>((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
)); */

type IFormValues = {
  defaultValue?: any;
  forwardedRef: any;
  formData: any;
  setfromData: (data: any) => void;
  mode: string;
  model: any;
};
const Textarea = React.forwardRef<HTMLTextAreaElement, any>(
  (props, forwardedRef) => <Input {...props} as="textarea" ref={forwardedRef} />
);

const gender = ["Male", "Female", "Other"].map((item) => ({
  label: item,
  value: item,
}));
const religion = ["Islam", "Hindu", "Buddhism", "Christan", "Other"].map(
  (item) => ({
    label: item,
    value: item,
  })
);
const maritalStatus = ["Single", "Married"].map((item) => ({
  label: item,
  value: item,
}));

const EmployeeRegistrationForm = ({
  defaultValue,
  forwardedRef,
  formData,
  setfromData,
  mode,
  model,
}: IFormValues) => {
  return (
    <div className="px-3">
      <div className="my-3">
        <h1 className="font-bold text-2xl">Enter Employee Information</h1>
      </div>
      <Form
        onChange={setfromData}
        ref={forwardedRef}
        model={model}
        className="grid grid-cols-4 gap-5 justify-center w-full bg-slate-300 p-3"
        fluid
        formValue={defaultValue}
        readOnly={mode === "watch"}
      >
        <Form.Group controlId="label">
          <Form.ControlLabel>Name</Form.ControlLabel>
          <Form.Control name="label" htmlSize={100} />
        </Form.Group>
        <Form.Group controlId="fatherName">
          <Form.ControlLabel>Father Name</Form.ControlLabel>
          <Form.Control name="fatherName" htmlSize={100} />
        </Form.Group>
        <Form.Group controlId="motherName">
          <Form.ControlLabel>Mother Name</Form.ControlLabel>
          <Form.Control name="motherName" htmlSize={100} />
        </Form.Group>
        <Form.Group controlId="gender">
          <Form.ControlLabel>Gender</Form.ControlLabel>
          <Form.Control
            name="gender"
            accepter={InputPicker}
            data={gender}
            htmlSize={100}
          />
        </Form.Group>
        <Form.Group controlId="dateOfBirth">
          <Form.ControlLabel>Date of birth</Form.ControlLabel>
          <Form.Control
            name="dateOfBirth"
            accepter={DatePicker}
            format="MM/dd/yyyy"
            htmlSize={100}
          />
        </Form.Group>
        <Form.Group controlId="age">
          <Form.ControlLabel>Age</Form.ControlLabel>
          <Form.Control name="age" type="number" />
        </Form.Group>
        <Form.Group controlId="religion">
          <Form.ControlLabel>Religion</Form.ControlLabel>
          <Form.Control
            name="religion"
            accepter={InputPicker}
            data={religion}
          />
        </Form.Group>
        <Form.Group controlId="nationality">
          <Form.ControlLabel>Natioality</Form.ControlLabel>
          <Form.Control name="nationality" />
        </Form.Group>
        <Form.Group controlId="maritalStatus">
          <Form.ControlLabel>Marital Status</Form.ControlLabel>
          <Form.Control
            name="maritalStatus"
            accepter={InputPicker}
            data={maritalStatus}
          />
        </Form.Group>
        <Form.Group controlId="district">
          <Form.ControlLabel>District</Form.ControlLabel>
          <Form.Control name="district" />
        </Form.Group>

        <Form.Group controlId="phoneNo">
          <Form.ControlLabel>Phone No</Form.ControlLabel>
          <Form.Control name="phoneNo" />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.ControlLabel>Email</Form.ControlLabel>
          <Form.Control name="email" type="email" />
        </Form.Group>
        <Form.Group controlId="presentAddress">
          <Form.ControlLabel>Present Address</Form.ControlLabel>
          <Form.Control name="presentAddress" accepter={Textarea} />
        </Form.Group>
        <Form.Group controlId="parmanentAddress">
          <Form.ControlLabel>Parmanent Address</Form.ControlLabel>
          <Form.Control name="parmanentAddress" accepter={Textarea} />
        </Form.Group>
      </Form>
    </div>
  );
};

export default EmployeeRegistrationForm;
