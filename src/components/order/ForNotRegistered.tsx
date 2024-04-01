import { IDoctor } from "@/types/allDepartmentInterfaces";
import React from "react";
import { DatePicker, Form, InputPicker } from "rsuite";
type param = {
  setFromData: (params: any) => void;
  doctorData: IDoctor[];
  data: any;
};
const ForNotRegistered = (param: param) => {
  const genderType = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "other" },
  ];
  return (
    <div>
      <h2 className="text-xl font-bold">Patient Information</h2>
      <div>
        <Form
          className="grid grid-cols-3 gap-5 justify-center w-full"
          onChange={(value, event) => {
            param.setFromData((prevState: any) => ({
              ...prevState,
              patient: {
                name: value.name,
                age: value.age,
                gender: value.gender,
                address: value.address,
                phone: value.phone,
                email: value.email,
                consultant: value.consultant,
              },
              refBy: value.refBy,
              deliveryTime: value.deliveryTime,
            }));
          }}
          formValue={param.data.patient}
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
          <Form.Group controlId="refBy">
            <Form.ControlLabel>Refered By</Form.ControlLabel>
            <Form.Control
              name="refBy"
              accepter={InputPicker}
              data={param.doctorData?.map((data: IDoctor) => {
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
              data={param.doctorData?.map((data: IDoctor) => {
                return { label: data.name, value: data._id };
              })}
              className="w-full"
            />
          </Form.Group>
          <Form.Group controlId="deliveryDate">
            <Form.ControlLabel>Delivery Date </Form.ControlLabel>
            <Form.Control
              name="deliveryTime"
              accepter={DatePicker}
              placement="top"
              format="dd MMM yyyy hh:mm aa"
              value={param.data.deliveryTime}
              showMeridian
              cleanable
            />
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default ForNotRegistered;
