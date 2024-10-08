import React, { Dispatch, SetStateAction, useState } from "react";
import RModal from "../ui/Modal";
import { Input } from "rsuite";
import { IProfile, IUserData } from "./interfacesAndInitalData";
import { useChangeUserPasswordByAdminMutation } from "@/redux/api/authentication/authenticationSlice";
import swal from "sweetalert";

const PasswordChangeByAdmin = (params: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  user: IProfile;
}) => {
  const { open, setOpen, user } = params;
  const [password, setPassword] = useState("");
  const [post, { isLoading: postLoading }] =
    useChangeUserPasswordByAdminMutation();

  const submitHandler = async () => {
    try {
      const result = await post({
        id: user.uuid as string,
        password: password,
      }).unwrap();

      if (result?.success) {
        swal("Success", "User Password Successfully Changed", "success");
        setOpen(false);
      }
    } catch (error) {
      swal("Error", `${error ?? "Please Try Again"}`, "error");
    }
  };
  const cancelHandler = () => {
    setOpen(false);
  };

  return (
    <div>
      <RModal
        open={open}
        size="sm"
        okHandler={submitHandler}
        cancelHandler={cancelHandler}
        title="Change User Password"
        loading={postLoading}
      >
        <div>
          <h3 className="text-center text-lg font-bold text-gray-700">
            User Information:
            <hr />
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-gray-700 font-bold">Username:</div>
              <div>{user?.name}</div>
            </div>
            <div>
              <div className="text-gray-700 font-bold">User Id</div>
              <div>{user?.uuid}</div>
            </div>
            <div>
              <div className="text-gray-700 font-bold">Email:</div>
              <div>{user?.email}</div>
            </div>
            <div>
              <div className="text-gray-700 font-bold">Phone:</div>
              <div>{user?.phone}</div>
            </div>
          </div>
          <div className="my-5">
            <label>New Password</label>
            <Input onChange={(v) => setPassword(v)} />
          </div>
        </div>
      </RModal>
    </div>
  );
};

export default PasswordChangeByAdmin;
