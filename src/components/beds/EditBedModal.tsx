"use client";

import { useEffect, useState } from "react";
import CustomModal from "../CustomModal";
import EditIcon from "@rsuite/icons/Edit";
import { useUpdateBedMutation } from "@/redux/api/bed.api";
import { Button, Form, SelectPicker } from "rsuite";
import Swal from "sweetalert2";
import { useGetAllWorldsQuery } from "@/redux/api/world.api";

type FormValueType = {
  bedName: string | null;
  charge: number | null;
  fees: number | null;
  worldId: string | null;
};

const initialValue: FormValueType = {
  bedName: null,
  charge: null,
  fees: null,
  worldId: null,
};

const EditBedModal = ({ item }: { item: any }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { data: worlds } = useGetAllWorldsQuery(undefined);
  const [updatedBed, { isLoading }] = useUpdateBedMutation();

  const [formValue, setFormValue] = useState(initialValue);

  useEffect(() => {
    if (item) {
      const worldId = item?.worldId?._id || item?.worldId || null;

      setFormValue({
        ...item,
        //@ts-ignore
        worldId,
      });
    }
  }, [item]);

  const handleFormChange = (updatedValue: Record<string, any>) => {
    setFormValue((prev) => ({ ...prev, ...updatedValue }));
  };

  const handleSubmit = async () => {
    const { bedName, worldId } = formValue;

    const payload = {
      id: item._id,
      data: {
        bedName,
        worldId,
      },
    };
    // console.log(payload, "payload");

    try {
      const res = await updatedBed(payload).unwrap();
      if (res.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          title: "Updated successfully",
          icon: "success",
        });
        handleClose();
      }
    } catch (err) {
      console.log(err, "error");
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
    <div>
      <CustomModal
        open={open}
        setOpen={setOpen}
        title="Update Bed"
        color="green"
        size="sm"
        appearance="ghost"
        text={<EditIcon />}
      >
        <div className="px-2">
          <Form
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            formValue={formValue}
            className=" w-full"
          >
            <Form.Group controlId="bedName">
              <Form.ControlLabel>Bed Name</Form.ControlLabel>
              <Form.Control name="bedName" style={{ width: 500 }} />
            </Form.Group>

            <Form.Group controlId="worldId" className="w-full">
              <Form.ControlLabel>World</Form.ControlLabel>
              <Form.Control
                size="lg"
                name="worldId"
                accepter={SelectPicker}
                data={worlds?.data?.map(
                  (item: { worldName: string; _id: string }) => ({
                    label: item.worldName,
                    value: item._id,
                  })
                )}
                placeholder="Select a world"
                searchable={false}
                value={formValue.worldId}
                style={{ width: 500 }}
              />
            </Form.Group>

            <div className=" w-full">
              {isLoading ? (
                <Button appearance="primary" loading>
                  {" "}
                </Button>
              ) : (
                <Button
                  className="max-h-11 mt-5 w-full"
                  size="sm"
                  appearance="primary"
                  type="submit"
                >
                  Submit
                </Button>
              )}
            </div>
          </Form>
          <Button
            onClick={handleClose}
            color="red"
            appearance="ghost"
            className="mt-3"
          >
            Cancel
          </Button>
        </div>
      </CustomModal>
    </div>
  );
};

export default EditBedModal;
