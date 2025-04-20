import { IDoctor } from "@/types/allDepartmentInterfaces";
import React, { forwardRef, useCallback, useMemo } from "react";
import { DatePicker, Form, InputPicker, Schema, SelectPicker } from "rsuite";
import { bangladeshDistricts, religions } from "./patient.contance";

type param = {
  setFromData: (params: any) => void;
  doctorData: IDoctor[];
  data: any;
  forwardedRef: React.MutableRefObject<any>;
};
const NotRegPatient = (param: param) => {
  const genderType = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "other" },
  ];

  const bloodGroup = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const maritalStatus = [
    { label: "Married", value: "married" },
    { label: "Unmarried", value: "unmarried" },
  ];

  const { StringType, NumberType } = Schema.Types;
  const model = Schema.Model({
    name: StringType().isRequired("This field is required."),
    age: StringType().isRequired("This field is required."),
    gender: StringType().isRequired("This field is required."),
    phone: NumberType()
      .isRequired("This field is required.")
      .addRule((value: string | number): boolean => {
        const phoneNumber = value.toString();
        if (phoneNumber.length <= 10 && phoneNumber.length >= 10) {
          return false;
        }
        return true;
      }, "Phone number must be 11 digits."),
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

  const bloodGroupOptions = useMemo(
    () => bloodGroup?.map((bld) => ({ label: bld, value: bld })),
    [bloodGroup]
  );

  const districtsOptions = useMemo(
    () => bangladeshDistricts.map((dt) => ({ label: dt, value: dt })),
    [bangladeshDistricts]
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
      {[
        { label: "Name", name: "name" },
        { label: "Age", name: "age" },
        {
          label: "Gender",
          name: "gender",
          accepter: InputPicker,
          data: genderType,
        },
        {
          label: "Blood Group",
          name: "bloodGroup",
          data: bloodGroupOptions,
          accepter: SelectPicker,
        },
        { label: "Guardian's Name", name: "fatherName" },
        { label: "Present Address", name: "presentAddress" },
        { label: "Permanent Address", name: "permanentAddress" },

        {
          label: "Marital Status",
          name: "maritalStatus",
          data: maritalStatus?.map((item) => ({
            label: item.label,
            value: item.value,
          })),
          accepter: SelectPicker,
        },
        { label: "Occupation", name: "occupation" },
        { label: "Education", name: "education" },
        {
          label: "District",
          name: "district",
          data: districtsOptions,
          accepter: SelectPicker,
        },
        {
          label: "Religion",
          name: "religion",
          data: religions.map((rl) => ({
            label: rl,
            value: rl,
          })),
          accepter: SelectPicker,
        },
        { label: "Residence", name: "residence" },
        { label: "Citizenship", name: "citizenShip" },
      ].map(({ label, name, accepter, data }) => (
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
