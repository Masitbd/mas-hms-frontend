import { useGetDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import { IDoctor, IPatient } from "@/types/allDepartmentInterfaces";
import Image from "next/image";
import React, { SetStateAction, useState } from "react";
import { Avatar, DatePicker, Form, InputPicker } from "rsuite";
import swal from "sweetalert";
import LogoUploader from "../companyInfo/LogoUploader";
import {
  bloodType,
  genderType,
  IPatient1,
  matarialType,
  religionType,
} from "./patientConstant";
import { Textarea } from "../companyInfo/TextArea";

const PatientForm = ({
  defaultValue,
  forwardedRef,
  fileRef,
  formData,
  setfromData,
  mode,
  model,
  image,
  setImage,
}: {
  defaultValue?: any;
  fileRef: any;
  forwardedRef: any;
  formData: IPatient1;
  setfromData: React.Dispatch<SetStateAction<Record<string, any>>>;
  mode: string;
  model: any;
  image: any;
  setImage: React.Dispatch<SetStateAction<any>>;
}) => {
  return (
    <div>
      <Form
        onChange={setfromData}
        ref={forwardedRef}
        model={model}
        className=""
        fluid
        formValue={defaultValue}
        readOnly={mode === "watch"}
      >
        <div className="my-5 border  shadow-lg mx-5">
          <div className="bg-[#3498ff] text-white px-2 py-2">
            <h2 className="text-center text-xl font-semibold">
              Personal Information
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-5 justify-center w-full px-2 py-4">
            <Form.Group controlId="name">
              <Form.ControlLabel>Name</Form.ControlLabel>
              <Form.Control name="name" htmlSize={100} />
            </Form.Group>
            <Form.Group controlId="fatherName">
              <Form.ControlLabel>{`Father's Name`}</Form.ControlLabel>
              <Form.Control name="fatherName" htmlSize={100} />
            </Form.Group>
            <Form.Group controlId="motherName">
              <Form.ControlLabel>{`Mother's Name`}</Form.ControlLabel>
              <Form.Control name="motherName" htmlSize={100} />
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
            <Form.Group controlId="maritalStatus">
              <Form.ControlLabel>Marital Status</Form.ControlLabel>
              <Form.Control
                name="maritalStatus"
                accepter={InputPicker}
                data={matarialType}
                className="w-full"
              />
            </Form.Group>
            <Form.Group controlId="dateOfBirth">
              <Form.ControlLabel>Date Of Birth</Form.ControlLabel>
              <Form.Control
                name="dateOfBirth"
                format="dd.MM.yyyy"
                accepter={DatePicker}
              />
            </Form.Group>
            <Form.Group controlId="religion">
              <Form.ControlLabel>Religion</Form.ControlLabel>
              <Form.Control
                name="religion"
                accepter={InputPicker}
                data={religionType}
                className="w-full"
              />
            </Form.Group>
            <Form.Group controlId="nationality">
              <Form.ControlLabel>Nationality</Form.ControlLabel>
              <Form.Control name="nationality" />
            </Form.Group>
            <Form.Group controlId="bloodGroup">
              <Form.ControlLabel>Blood Group</Form.ControlLabel>
              <Form.Control
                name="bloodGroup"
                accepter={InputPicker}
                data={bloodType}
                className="w-full"
              />
            </Form.Group>
            <div>
              <LogoUploader
                defaultImage={formData?.image as string}
                image={image}
                setImage={setImage}
              />
            </div>
          </div>
        </div>

        <div className="my-5 border  shadow-lg mx-5">
          <div className="bg-[#3498ff] text-white px-2 py-2">
            <h2 className="text-center text-xl font-semibold">Address</h2>
          </div>
          <div className="grid grid-cols-2 gap-5 justify-center w-full px-2 py-4">
            <Form.Group controlId="presentAddress">
              <Form.ControlLabel>Present Address</Form.ControlLabel>
              <Form.Control
                name="presentAddress"
                className="w-full"
                accepter={Textarea}
              />
            </Form.Group>
            <Form.Group controlId="permanentAddress">
              <Form.ControlLabel>Permanent Address</Form.ControlLabel>
              <Form.Control
                name="permanentAddress"
                className="w-full"
                accepter={Textarea}
              />
            </Form.Group>
            <Form.Group controlId="district">
              <Form.ControlLabel>District</Form.ControlLabel>
              <Form.Control name="district" className="w-full" />
            </Form.Group>
          </div>
        </div>

        <div className="my-5 border  shadow-lg mx-5">
          <div className="bg-[#3498ff] text-white px-2 py-2">
            <h2 className="text-center text-xl font-semibold">
              Contact Information
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-5 justify-center w-full px-2 py-4">
            <Form.Group controlId="phone">
              <Form.ControlLabel>Phone</Form.ControlLabel>
              <Form.Control name="phone" className="w-full" />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control name="email" type="email" />
            </Form.Group>
          </div>
        </div>
      </Form>
      {/* Result Fields */}
    </div>
  );
};

export default PatientForm;
