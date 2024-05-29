import React, { useEffect, useRef, useState } from "react";
import {
  ChangePasswordFromInitialData,
  IChangePassword,
  IChangePasswordFromdata,
} from "./interfacsAndTypes";
import { ENUM_MODE } from "@/enum/Mode";
import { Button, Form, Message, toaster } from "rsuite";
import { useChangePasswordMutation } from "@/redux/api/authentication/authenticationSlice";
import { FormSetValueFunction } from "@/types/componentsType";

const ChangePassword = (props: IChangePassword) => {
  const { mode, setMode, userData } = props;
  const ref: React.MutableRefObject<any> = useRef();
  const [patchPassword, { isError, isSuccess, isLoading }] =
    useChangePasswordMutation();
  const [formData, setFormData] = useState<IChangePasswordFromdata>();

  const patchHandler = () => {
    if (ref.current.check()) {
      patchPassword(formData);
    } else {
      <Message type="error">Please Fill out all the form </Message>;
    }
  };
  const cancelHandler = () => {
    setMode(ENUM_MODE.VIEW);
    setFormData(ChangePasswordFromInitialData);
  };

  useEffect(() => {
    if (isSuccess) {
      toaster.push(
        <Message type="success"> Password change successfully</Message>
      );
      setFormData(ChangePasswordFromInitialData);
      setMode(ENUM_MODE.VIEW);
    }
    if (isError) {
      toaster.push(
        <Message type="error">
          Please check your old password and try again
        </Message>
      );
    }
  }, [isSuccess, isError]);

  // Form Data Handleer
  const handleFormData: FormSetValueFunction = (formValue, event) => {
    setFormData(formValue as IChangePasswordFromdata);
  };
  if (mode == ENUM_MODE.CHANGE_PASSWROD) {
    return (
      <div className="border border-stone-200 p-11">
        <div className="mb-10">
          <h1 className="text-2xl font-bold font-sans  text-center">
            Change Password
          </h1>
          <hr />
        </div>
        <Form formValue={formData} onChange={handleFormData} ref={ref}>
          <Form.Group controlId="oldPassword">
            <Form.ControlLabel>Old Password</Form.ControlLabel>
            <Form.Control name="oldPassword" />
          </Form.Group>
          <Form.Group controlId="newPassword">
            <Form.ControlLabel>New Password</Form.ControlLabel>
            <Form.Control name="newPassword" />
          </Form.Group>
        </Form>
        <div className="my-5">
          <Button
            appearance="primary"
            color="red"
            className="mr-5"
            onClick={() => cancelHandler()}
          >
            Cancel
          </Button>
          <Button
            appearance="primary"
            color="blue"
            onClick={() => patchHandler()}
          >
            Save
          </Button>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default ChangePassword;
