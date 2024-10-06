import { IDoctor } from "@/types/allDepartmentInterfaces";
import React from "react";
import { DatePicker, Form, InputPicker, Schema } from "rsuite";
import { IRegisteredPatient } from "./initialDataAndTypes";

const ForRegistered = (param: IRegisteredPatient) => {
  return (
    <div>
      <div>
        <div>
          <h4 className="text-xl font-bold gap-5">
            Patient Personal Infromation
          </h4>
          <hr />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col">
            <h2 className="font-bold">Name</h2>
            {param.formData.patient.name}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Age</h2>
            {param.formData.patient.age}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Gender</h2>
            {param.formData.patient.gender}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Address</h2>
            {param.formData.patient.address}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Ref By</h2>
            {param.formData.patient?.ref_by}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Consultent</h2>
            {param.formData.patient.consultant}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Phone</h2>
            {param.formData.patient.phone}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Email</h2>
            {param.formData.patient.email}
          </div>
        </div>

        <div>
          <Form
            onChange={(fromValue, event) => {
              param.setFormData((prevData: any) => ({
                ...prevData,
                refBy: fromValue.refBy,
                consultant: fromValue.consultant,
                deliveryTime: fromValue.deliveryTime,
              }));
            }}
            className="grid grid-cols-3 gap-5"
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
                value={
                  param?.formData?.refBy ? param?.formData?.refBy?._id : ""
                }
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
      </div>
    </div>
  );
};

export default ForRegistered;
