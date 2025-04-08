"use client";
import React, { useState } from "react";
import CustomModal from "../CustomModal";

const AddServiceModal = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <CustomModal
        open={open}
        setOpen={setOpen}
        text="Add Service"
        title="Add Service"
      >
        <div></div>
      </CustomModal>
    </div>
  );
};

export default AddServiceModal;
