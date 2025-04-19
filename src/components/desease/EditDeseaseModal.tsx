"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { Button, ButtonToolbar, Form, Modal } from "rsuite";
import { useCreateDeseaseMutation } from "@/redux/api/desease.api";
import EditIcon from "@rsuite/icons/Edit";

const EditDeseaseModal = ({ item }: { item: { name: string } }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [createBed, { isLoading }] = useCreateDeseaseMutation();

  const [formValue, setFormValue] = useState({ name: "" });

  useEffect(() => {
    if (item) {
      setFormValue({ ...item });
    }
  }, [item]);

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
      <ButtonToolbar>
        <Button appearance="ghost" color="green" onClick={handleOpen}>
          <EditIcon color="green" />
        </Button>
      </ButtonToolbar>

      <Modal size="50rem" overflow={true} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Desease Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="px-2">
            <Form
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              formValue={formValue}
              //   model={model}
              className="grid grid-cols-1 gap-10 justify-center  w-full"
            >
              <Form.Group controlId="name">
                <Form.ControlLabel>Desease Name</Form.ControlLabel>
                <Form.Control name="name" />
              </Form.Group>

              {isLoading ? (
                <Button appearance="primary" loading>
                  {" "}
                </Button>
              ) : (
                <Button
                  className="max-h-11 mt-5"
                  size="sm"
                  appearance="primary"
                  type="submit"
                >
                  Submit
                </Button>
              )}
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} color="red" appearance="ghost">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditDeseaseModal;
