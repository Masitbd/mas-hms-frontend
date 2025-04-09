"use client";

import { Button, Form, SelectPicker } from "rsuite";
import CustomModal from "../CustomModal";
import { useState } from "react";
import { useGetAllWorldsQuery } from "@/redux/api/world.api";
import { useCreateBedMutation } from "@/redux/api/bed.api";
import Swal from "sweetalert2";

const AddBedModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [createBed, { isLoading: creating }] = useCreateBedMutation();

  const { data: worlds, isLoading } = useGetAllWorldsQuery(undefined);

  const initialValue = {
    bedName: null,
    phone: null,
    floor: null,
    worldId: null,
  };

  const [formValue, setFormValue] = useState(initialValue);

  const handleFormChange = (updatedValue: Record<string, any>) => {
    setFormValue((prev) => ({ ...prev, ...updatedValue }));
  };

  const handleSubmit = async () => {
    const { bedName, phone, floor, worldId } = formValue;

    const payload = {
      bedName,
      phone,
      floor,
      worldId,
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
      <CustomModal text="Add Bed" title="Bed Add" open={open} setOpen={setOpen}>
        <Form
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          formValue={formValue}
          className="grid grid-cols-2 gap-10 justify-center  w-full"
        >
          <Form.Group controlId="bedName">
            <Form.ControlLabel>Bed Name</Form.ControlLabel>
            <Form.Control name="bedName" />
          </Form.Group>

          <Form.Group controlId="phone">
            <Form.ControlLabel>Phone</Form.ControlLabel>

            <Form.Control name="phone" />
          </Form.Group>
          <Form.Group controlId="floor">
            <Form.ControlLabel>Floor</Form.ControlLabel>

            <Form.Control name="floor" />
          </Form.Group>
          <Form.Group controlId="worldId">
            <Form.ControlLabel>Bed Category</Form.ControlLabel>
            <Form.Control
              name="worldId"
              accepter={SelectPicker}
              data={worlds?.data?.map((world: any) => ({
                label: world.worldName,
                value: world._id,
              }))}
              placeholder="Select World"
              style={{ width: 300 }}
            />
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

export default AddBedModal;
