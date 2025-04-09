import React, { useState } from "react";
import CustomModal from "../CustomModal";
import { Button, Form } from "rsuite";
import Swal from "sweetalert2";
import { useCreatePackageMutation } from "@/redux/api/package.api";

const AddPackageModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [createPackage, { isLoading: creating }] = useCreatePackageMutation();

  const initialValue = {
    name: null,
    price: null,
  };

  const [formValue, setFormValue] = useState(initialValue);

  const handleFormChange = (updatedValue: Record<string, any>) => {
    setFormValue((prev) => ({ ...prev, ...updatedValue }));
  };

  const handleSubmit = async () => {
    const { price, name } = formValue;

    const payload = {
      name,
      price: Number(price),
    };

    try {
      const res = await createPackage(payload).unwrap();
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
        text="Add Package"
        title="Add Package"
        open={open}
        setOpen={setOpen}
      >
        <Form
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          formValue={formValue}
          className="grid grid-cols-2 gap-10 justify-center  w-full"
        >
          <Form.Group controlId="name">
            <Form.ControlLabel>Package Name</Form.ControlLabel>
            <Form.Control name="name" />
          </Form.Group>

          <Form.Group controlId="price">
            <Form.ControlLabel>Price</Form.ControlLabel>

            <Form.Control type="number" name="price" />
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

export default AddPackageModal;
