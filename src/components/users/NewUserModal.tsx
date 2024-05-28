import React, { useEffect, useRef, useState } from "react";
import RModal from "../ui/Modal";
import UserForm from "./NewUserForm";
import {
  IInitilFormDataForNewUser,
  IPropsForNewUserModel,
  initialFormDataForNewUser,
  newUserFormModel,
} from "./interfacesAndInitalData";
import { usePostUserMutation } from "@/redux/api/users/usersSlice";
import { Message, toaster } from "rsuite";

const NewUserModal = (props: IPropsForNewUserModel) => {
  const fromref: React.MutableRefObject<any> = useRef();
  const { mode, open, setMode, setOpen } = props;
  const [
    postUser,
    {
      isError: postUserFaild,
      isSuccess: postUserSuccess,
      isLoading: postUserLoading,
    },
  ] = usePostUserMutation();
  const [formData, setFromData] = useState<IInitilFormDataForNewUser>(
    initialFormDataForNewUser
  );

  const okHandler = () => {
    if (fromref.current.check()) {
      const profile = {
        name: formData.name,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
      };
      const userData = {
        password: formData.password,
        profile: profile,
        role: formData.role,
      };
      postUser(userData);
      setOpen(!open);
      setFromData(initialFormDataForNewUser);
    } else {
      toaster.push(
        <Message type="error">Please fill out all the form </Message>
      );
    }
  };

  const cancelHandler = () => {
    setOpen(!open);
    setFromData(initialFormDataForNewUser);
  };

  useEffect(() => {
    if (postUserSuccess) {
      toaster.push(<Message type="success">User Posted successfully</Message>);
    }
    if (postUserFaild) {
      toaster.push(<Message type="error">Something went wrong.</Message>);
    }
  }, [postUserSuccess, postUserFaild]);
  return (
    <RModal
      open={open}
      okHandler={okHandler}
      cancelHandler={cancelHandler}
      size="md"
      title="Add new user"
    >
      <UserForm
        defaultValue={formData}
        setfromData={setFromData}
        forwardedRef={fromref}
        mode={mode}
        model={newUserFormModel}
      />
    </RModal>
  );
};

export default NewUserModal;
