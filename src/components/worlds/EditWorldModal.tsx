import React, { useEffect, useState } from "react";
import { Button, ButtonToolbar, Form, Modal } from "rsuite";
import Swal from "sweetalert2";
import { BedCategoryinitialValue } from "./AddWorldModal";
import { useUpdateWorldsMutation } from "@/redux/api/world.api";
import EditIcon from "@rsuite/icons/Edit";
import { TWorld } from "./WoroldTable";

const EditWorldModal = ({ item }: { item: TWorld  }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [updateWorld, { isLoading }] = useUpdateWorldsMutation();
  const [formValue, setFormValue] = useState(BedCategoryinitialValue);

  useEffect(() => {
    if (item) {
      setFormValue({ ...item });
    }
  }, [item]);

  const handleFormChange = (updatedValue: Record<string, any>) => {
    setFormValue((prev) => ({ ...prev, ...updatedValue }));
  };

  const handleSubmit = async () => {
    const { worldName, charge, fees } = formValue;

    const payload = {
      id: item._id,
      data: {
        worldName,
        charge: Number(charge),
        fees: Number(fees),
      },
    };

    try {
      const res = await updateWorld(payload).unwrap();
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
          <Modal.Title>Bed Category Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="px-2">
            <Form
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              formValue={formValue}
              //   model={model}
              className="grid grid-cols-2 gap-10 justify-center  w-full"
            >
              <Form.Group controlId="worldName">
                <Form.ControlLabel>Bed Category Name</Form.ControlLabel>
                <Form.Control name="worldName" />
              </Form.Group>

              <Form.Group controlId="charge">
                <Form.ControlLabel>Bed Charge</Form.ControlLabel>

                <Form.Control type="number" name="charge" />
              </Form.Group>
              <Form.Group controlId="fees">
                <Form.ControlLabel>Admission Fees</Form.ControlLabel>

                <Form.Control type="number" name="fees" />
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

export default EditWorldModal;
