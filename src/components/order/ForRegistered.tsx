import { IDoctor } from "@/types/allDepartmentInterfaces";
import React from "react";
import { DatePicker, Form, InputPicker, Schema } from "rsuite";
import { IRegisteredPatient } from "./initialDataAndTypes";
import "./CustomCss.css";

const ForRegistered = (param: IRegisteredPatient) => {
  return (
    <>
      <div className="flex flex-col">
        <h2 className="font-bold">Name</h2>
        <span className="font-[Roboto]"> {param.formData.patient.name}</span>
      </div>
      <div className="flex flex-col">
        <h2 className="font-bold">Age</h2>
        <span className="font-[Roboto]">{param.formData.patient.age}</span>
      </div>
      <div className="flex flex-col">
        <h2 className="font-bold">Gender</h2>
        <span className="font-[Roboto]"> {param.formData.patient.gender}</span>
      </div>
      <div className="flex flex-col">
        <h2 className="font-bold">Address</h2>
        <span className="font-[Roboto]">
          {" "}
          {param.formData.patient.address}{" "}
        </span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-bold">Phone</h2>
        <span className="font-[Roboto]"> {param.formData.patient.phone} </span>
      </div>
      <div className="flex flex-col">
        <h2 className="font-bold">Email</h2>
        <span className="font-[Roboto]"> {param.formData.patient.email} </span>
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

export default ForRegistered;
