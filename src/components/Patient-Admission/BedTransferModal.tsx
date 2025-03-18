"use client";
import React, { useState } from "react";
import CustomModal from "../CustomModal";

const BedTransferModal = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <CustomModal
        open={open}
        setOpen={setOpen}
        text="Bed Transfer"
        title="Bed Transfer"
      >
        <div></div>
      </CustomModal>
    </div>
  );
};

export default BedTransferModal;
