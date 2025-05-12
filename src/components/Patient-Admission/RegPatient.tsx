import { IDoctor } from "@/types/allDepartmentInterfaces";
import React from "react";
import { DatePicker, Form, InputPicker, Schema } from "rsuite";

// import "./CustomCss.css";
import { IRegisteredPatient } from "../order/initialDataAndTypes";

const RegisteredPatient = (param: IRegisteredPatient) => {
  return (
    <>
      <div className="flex flex-col">
        <h2 className="font-bold">Reg No</h2>
        <span className="font-[Roboto]">{param.formData.patient.regNo}</span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Name</h2>
        <span className="font-[Roboto]">{param.formData.patient.name}</span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Gender</h2>
        <span className="font-[Roboto]">{param.formData.patient.gender}</span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Father`&apos;`s Name</h2>
        <span className="font-[Roboto]">
          {param.formData.patient.fatherName}
        </span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Present Address</h2>
        <span className="font-[Roboto]">
          {param.formData.patient.presentAddress}
        </span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Permanent Address</h2>
        <span className="font-[Roboto]">
          {param.formData.patient.permanentAddress}
        </span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Age</h2>
        <span className="font-[Roboto]">{param.formData.patient.age}</span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Blood Group</h2>
        <span className="font-[Roboto]">
          {param.formData.patient.bloodGroup}
        </span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Status</h2>
        <span className="font-[Roboto]">{param.formData.patient.status}</span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Admission Date</h2>
        <span className="font-[Roboto]">
          {param.formData.patient.admissionDate}
        </span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Admission Time</h2>
        <span className="font-[Roboto]">
          {param.formData.patient.admissionTime}
        </span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Release Date</h2>
        <span className="font-[Roboto]">
          {param.formData.patient.releaseDate}
        </span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Marital Status</h2>
        <span className="font-[Roboto]">
          {param.formData.patient.maritalStatus}
        </span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Occupation</h2>
        <span className="font-[Roboto]">
          {param.formData.patient.occupation}
        </span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Education</h2>
        <span className="font-[Roboto]">
          {param.formData.patient.education}
        </span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">District</h2>
        <span className="font-[Roboto]">{param.formData.patient.district}</span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Religion</h2>
        <span className="font-[Roboto]">{param.formData.patient.religion}</span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Residence</h2>
        <span className="font-[Roboto]">
          {param.formData.patient.residence}
        </span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Citizenship</h2>
        <span className="font-[Roboto]">
          {param.formData.patient.citizenShip}
        </span>
      </div>

      <div className="col-span-3">
        <Form
          onChange={(fromValue, event) => {
            param.setFormData((prevData: any) => ({
              ...prevData,
              refBy: fromValue.refBy,
              consultant: fromValue.consultant,
              deliveryTime: fromValue.deliveryTime,
            }));
          }}
          className="grid grid-cols-3 gap-5 patient-information-not-reg"
          formValue={param.formData}
        >
          <Form.Group controlId="refBy">
            <Form.ControlLabel className="font-bold">
              Refered By
            </Form.ControlLabel>
            <Form.Control
              name="refBy"
              accepter={InputPicker}
              data={param?.doctors?.map((data: IDoctor) => {
                return { label: data?.name, value: data?._id };
              })}
              value={param?.formData?.refBy ? param?.formData?.refBy?._id : ""}
            />
          </Form.Group>
          <Form.Group controlId="consultant">
            <Form.ControlLabel className="font-bold">
              Consultetn
            </Form.ControlLabel>
            <Form.Control
              name="consultant"
              accepter={InputPicker}
              data={param?.doctors?.map((data: IDoctor) => {
                return { label: data?.name, value: data?._id };
              })}
              value={param?.formData?.consultant}
            />
          </Form.Group>
          <Form.Group controlId="deliveryTime">
            <Form.ControlLabel>Delivery Date </Form.ControlLabel>
            <Form.Control
              name="deliveryTime"
              accepter={DatePicker}
              placement="top"
              format="dd MMM yyyy hh:mm aa"
              value={new Date(param?.formData?.deliveryTime)}
              showMeridian
              cleanable
            />
          </Form.Group>
        </Form>
      </div>
    </>
  );
};

export default RegisteredPatient;
