"use client";
import React, { useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputGroup,
  Message,
  Schema,
  toaster,
} from "rsuite";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";
import AdminIcon from "@rsuite/icons/Admin";
import ReloadIcon from "@rsuite/icons/Reload";

const LoginPage = () => {
  const { StringType } = Schema.Types;
  const formRef: React.MutableRefObject<any> = useRef();
  const [visible, setVisible] = useState(false);
  const handleChange = () => {
    setVisible(!visible);
  };

  // handling mode
  const [mode, setMode] = useState("login");

  // Handling login
  type ILoginData = {
    uuid: string;
    password: string;
  };
  const initialFormData: ILoginData = {
    uuid: "",
    password: "",
  };
  const [loginData, setLoginData] = useState(initialFormData);
  const model = Schema.Model({
    uuid: StringType().isRequired("This field is required."),
    password: StringType().isRequired("This field is required."),
  });
  const handleLogin = () => {
    if (formRef.current.check()) {
      console.log(loginData);
      toaster.push(<Message type="success">Logged In successfully</Message>);
    }
  };

  // Handling password reset
  const resetModel = Schema.Model({
    uuid: StringType().isRequired("This field is required."),
  });
  const resetFormRef: React.MutableRefObject<any> = useRef();
  type IResetFromData = {
    uuid: string;
  };
  const initialResetFromData: IResetFromData = {
    uuid: "",
  };
  const [resetFromData, setResetFromData] = useState(initialResetFromData);
  const handlePasswordReset = () => {
    if (resetFormRef.current.check()) {
      toaster.push(
        <Message type="success">Reset Request sent successfully</Message>
      );
    }
  };
  return (
    <div
      className="bg-cover bg-center h-screen  bg-no-repeat flex items-center justify-center"
      style={{
        background:
          "linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)),url('/login_page_bg.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="flex flex-col h-[300px] mx-5">
        <div
          className={`${
            mode == "login" ? "bg-green-500 text-white" : "bg-white text-black"
          } h-full w-28 mb-5 rounded-md cursor-pointer flex items-center justify-center flex-col`}
          onClick={() => setMode("login")}
        >
          <AdminIcon className="size-11" />
          <span className="font-bold text-lg">Login</span>
        </div>
        <div
          className={`${
            mode == "forget_password"
              ? "bg-green-500 text-white"
              : "bg-white text-black"
          } h-full w-28 rounded-md cursor-pointer flex items-center justify-center flex-col`}
          onClick={() => setMode("forget_password")}
        >
          <ReloadIcon className="size-10" />
          <span className="text-center font-bold">
            Reset <br /> Password
          </span>
        </div>
      </div>
      <div className="h-[300px] bg-white rounded-md p-5 w-[500px]">
        {mode == "login" ? (
          <>
            {" "}
            <h1 className="text-3xl font-bold text-center my-5">Login</h1>
            <Form
              fluid
              className="w-full"
              onChange={setLoginData}
              ref={formRef}
              model={model}
            >
              <Form.Group controlId="uuid">
                <Form.Control name="uuid" placeholder="USER ID" />
              </Form.Group>
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
            </Form>
            <div className="flex items-end justify-end mt-5">
              <Button
                appearance="primary"
                color="blue"
                size="lg"
                onClick={handleLogin}
              >
                Login
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center my-5">
              Reset Password
            </h1>
            <div className="text-sm text-slate-500 my-5">
              After reset request, admin notified. Valid requests get password
              changed. Retrieve new password from admin
            </div>
            <Form
              fluid
              model={resetModel}
              ref={resetFormRef}
              onChange={setResetFromData}
            >
              <Form.Group controlId="uuid">
                <Form.Control name="uuid" type="text" placeholder="UUID" />
              </Form.Group>
            </Form>
            <div className="flex items-end justify-end mt-5">
              <Button
                appearance="primary"
                color="blue"
                onClick={handlePasswordReset}
              >
                Reset Password
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
