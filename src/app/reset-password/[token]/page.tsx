"use client";
import { PasswordValidator } from "@/components/reset-password/functions";
import { useResetPasswordMutation } from "@/redux/api/authentication/authenticationSlice";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Input } from "rsuite";
import swal from "sweetalert";

const ResetPassword = ({ params }: { params: { token: string } }) => {
  const router = useRouter();

  const [post, { isLoading: passwordResetLoading }] =
    useResetPasswordMutation();
  const [firstPassword, setFirstPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const passwordValidator = new PasswordValidator(
    firstPassword,
    secondPassword
  );

  const postHandler = async () => {
    const data = {
      newPassword: firstPassword,
      token: params.token,
    };
    try {
      const result = await post(data).unwrap();
      if (result?.success) {
        swal("Success", "Password changed successfully", "success");
        router.push("/signin");
        setFirstPassword("");
        setSecondPassword("");
      }
    } catch (error) {
      swal("Error", `${error}`, "error");
    }
  };

  return (
    <div className=" h-[100vh] flex items-center justify-center">
      <div className="h-96 w-96 shadow-lg p-4 border border-stone-200">
        <h1 className="font-[Roboto] text-3xl font-bold text-center mt-5 text-stone-700">
          Enter your new Password
        </h1>

        <div className="mt-10">
          <div>
            <label htmlFor="1st">New Password</label>
            <Input
              className="1st"
              size="lg"
              onChange={(v) => setFirstPassword(v)}
            />
          </div>
          <div className="mt-5">
            <label htmlFor="2nd">Re-enter Your password</label>
            <Input
              size="lg"
              color="red"
              onChange={(v) => setSecondPassword(v)}
            />
          </div>
          <div className="mt-5 flex items-end justify-end">
            <Button
              appearance="primary"
              color="blue"
              size="lg"
              disabled={!passwordValidator.validate()}
              onClick={() => postHandler()}
              loading={passwordResetLoading}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
