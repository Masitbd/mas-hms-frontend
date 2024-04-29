import React, { useRef, useState } from "react";
import RModal from "../ui/Modal";
import UserForm from "./NewUserForm";

const NewUserModal = ({
  open,
  setOpen,
  mode,
  setMode,
}: {
  open: boolean;
  setOpen: (prop: boolean) => void;
  mode: string;
  setMode: (prop: string) => void;
}) => {
  const [formData, setFromData] = useState();
  const fromref = useRef();
  return (
    <RModal
      open={open}
      okHandler={() => setOpen(!open)}
      cancelHandler={() => setOpen(!open)}
      size="md"
      title="Add new user"
    >
      <UserForm
        defaultValue={formData}
        setfromData={setFromData}
        forwardedRef={fromref}
        mode={mode}
      />
    </RModal>
  );
};

export default NewUserModal;
