import { IDoctor } from "@/types/allDepartmentInterfaces";
import React, { useCallback } from "react";
import { Form, Schema } from "rsuite";

import { patientFields } from "./patient.constance";

type param = {
  setFromData: (params: any) => void;
  doctorData: IDoctor[];
  data: any;
  forwardedRef: React.MutableRefObject<any>;
};
const NotRegPatient = (param: param) => {
  const { StringType, NumberType } = Schema.Types;
  const model = Schema.Model({
    name: StringType().isRequired("This field is required."),
    age: StringType().isRequired("This field is required."),
    gender: StringType().isRequired("This field is required."),
    phone: StringType().isRequired("This field is required."),
  });
  const handleChange = useCallback(
    (value: Record<string, any>) => {
      param.setFromData((prevState: any) => ({
        ...prevState,
        ...value,
      }));
    },
    [param.setFromData]
  );

  return (
    <Form
      className="contents patient-information-not-reg "
      onChange={handleChange}
      formValue={param?.data}
      model={model}
      ref={param.forwardedRef}
      checkTrigger="blur"
      fluid
    >
      {patientFields.map(({ label, name, accepter, data }) => (
        <Form.Group controlId={name} key={name}>
          <Form.ControlLabel>{label}</Form.ControlLabel>
          <Form.Control
            name={name}
            accepter={accepter}
            {...(data && { data })}
            // format={format}
            // showMeridian={showMeridian}
            className="w-full"
          />
        </Form.Group>
      ))}
    </Form>
  );
};

export default NotRegPatient;
