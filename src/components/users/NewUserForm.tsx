import React, { useState } from "react";
import { DatePicker, Form, InputGroup, InputPicker } from "rsuite";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";
import AdminIcon from "@rsuite/icons/Admin";
import ReloadIcon from "@rsuite/icons/Reload";
import { IUserData } from "./interfacesAndInitalData";
import { useAppSelector } from "@/redux/hook";
const UserForm = ({
  defaultValue,
  setfromData,
  forwardedRef,
  model,
  mode,
}: {
  defaultValue: any;
  setfromData: (param: any) => void;
  forwardedRef: any;
  model?: any;
  mode: string;
}) => {
  const user = useAppSelector((state) => state?.auth?.user);
  const genderType = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "other" },
  ];

  const roleType = [
    { label: "Admin", value: "admin" },
    { label: "Accountant", value: "accountant" },
    { label: "User", value: "user" },
    { label: "Other", value: "other" },
  ];

  const [visible, setVisible] = useState(false);
  const handleChange = () => {
    setVisible(!visible);
  };
  const todaysDate = new Date();

  return (
    <div>
      {" "}
      <Form
        onChange={setfromData}
        ref={forwardedRef}
        model={model}
        className="grid grid-cols-2 gap-5 justify-center w-full"
        fluid
        formValue={defaultValue}
        readOnly={mode === "view"}
      >
        <Form.Group controlId="name">
          <Form.ControlLabel>Name</Form.ControlLabel>
          <Form.Control name="name" />
        </Form.Group>
        <Form.Group controlId="motherName">
          <Form.ControlLabel>Mother Name</Form.ControlLabel>
          <Form.Control name="motherName" />
        </Form.Group>
        <Form.Group controlId="fatherName">
          <Form.ControlLabel>Father Name</Form.ControlLabel>
          <Form.Control name="fatherName" />
        </Form.Group>
        <Form.Group controlId="age">
          <Form.ControlLabel>Age</Form.ControlLabel>
          <Form.Control name="age" />
        </Form.Group>
        <Form.Group controlId="dateOfBirth">
          <Form.ControlLabel>Date Of Birth</Form.ControlLabel>
          <Form.Control
            name="dateOfBirth"
            accepter={DatePicker}
            onChange={(v) => {
              const age =
                new Date().getFullYear() -
                new Date(v).getFullYear() +
                " " +
                "Year(s)";
              setfromData((prevValue: Partial<IUserData>) => ({
                ...prevValue,
                age: age,
              }));
            }}
            value={new Date(defaultValue?.dateOfBirth ?? todaysDate)}
          />
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
        {user?.role == "admin" || user.role == "super-admin" ? (
          <Form.Group controlId="role">
            <Form.ControlLabel>Role</Form.ControlLabel>
            <Form.Control
              name="role"
              accepter={InputPicker}
              data={roleType}
              className="w-full"
            />
          </Form.Group>
        ) : (
          <></>
        )}
        {mode !== "edit" && (
          <>
            <Form.Group controlId="password">
              <InputGroup inside>
                <Form.Control
                  name="password"
                  placeholder="Password"
                  type={visible ? "text" : "password"}
                />
                <InputGroup.Button onClick={handleChange}>
                  {visible ? <EyeIcon /> : <EyeSlashIcon />}
                </InputGroup.Button>
              </InputGroup>
            </Form.Group>
          </>
        )}
      </Form>
    </div>
  );
};

export default UserForm;
