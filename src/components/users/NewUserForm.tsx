import React, { useState } from "react";
import { Form, InputGroup, InputPicker } from "rsuite";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";
import AdminIcon from "@rsuite/icons/Admin";
import ReloadIcon from "@rsuite/icons/Reload";
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
  const genderType = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "other" },
  ];

  const [visible, setVisible] = useState(false);
  const handleChange = () => {
    setVisible(!visible);
  };

  return (
    <div>
      {" "}
      <Form
        onChange={setfromData}
        ref={forwardedRef}
        model={model}
        className="grid grid-cols-3 gap-5 justify-center w-full"
        fluid
        formValue={defaultValue}
        readOnly={mode === "view"}
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
        {mode !== "edit" && (
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
        )}
      </Form>
    </div>
  );
};

export default UserForm;
