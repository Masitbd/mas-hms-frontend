"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import CustomModal from "../CustomModal";
import { Button, Form } from "rsuite";
import { useCreateDeseaseMutation } from "@/redux/api/desease.api";

const AddDeseaseModal = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const [createBed, { isLoading: creating }] = useCreateDeseaseMutation();

  const [formValue, setFormValue] = useState({ name: "" });

  const handleFormChange = (updatedValue: Record<string, any>) => {
    setFormValue((prev) => ({ ...prev, ...updatedValue }));
  };

  const handleSubmit = async () => {
    const { name } = formValue;

    const payload = {
      name,
    };

    try {
      const res = await createBed(payload).unwrap();
      if (res.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          title: "Added successfully",
          icon: "success",
        });
        await handleClose();
      }
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: "Something Went Wrong",
        icon: "error",
      });
    }
  };

  return (
    <>
      <CustomModal
        text="Add Desease"
        title="Desease Add"
        open={open}
        setOpen={setOpen}
      >
        <Form
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          formValue={formValue}
          className="grid grid-cols-1 gap-10 justify-center  w-full"
        >
          <Form.Group className="w-full" controlId="name">
            <Form.ControlLabel>Desease Name</Form.ControlLabel>
            <Form.Control name="name" />
          </Form.Group>

          <Button
            className="max-h-11 mt-5 col-span-2"
            size="sm"
            appearance="primary"
            type="submit"
          >
            Submit
          </Button>
        </Form>
      </CustomModal>
    </>
  );
};

export default AddDeseaseModal;
