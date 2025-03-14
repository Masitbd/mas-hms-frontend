import { useCreateWorldsMutation } from "@/redux/api/world.api";
import { useState } from "react";
import Swal from "sweetalert2";

import {
  Modal,
  Toggle,
  Button,
  ButtonToolbar,
  Placeholder,
  Form,
} from "rsuite";
const AddWorldModal = () => {
  const [open, setOpen] = useState(false);
  const [overflow, setOverflow] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [createWorld, { isLoading }] = useCreateWorldsMutation();

  const initialValue = {
    worldName: null,
    charge: null,
    fees: null,
  };

  const [formValue, setFormValue] = useState(initialValue);

  const handleFormChange = (updatedValue: Record<string, any>) => {
    setFormValue((prev) => ({ ...prev, ...updatedValue }));
  };

  const handleSubmit = async () => {
    const { worldName, charge, fees } = formValue;

    const payload = {
      worldName,
      charge: Number(charge),
      fees: Number(fees),
    };



    try {
      const res = await createWorld(payload).unwrap();
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
        <Button appearance="primary" onClick={handleOpen}>
          Add World
        </Button>
      </ButtonToolbar>

      <Modal size="50rem" overflow={overflow} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>World Add</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="px-2">
            <Form
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              formValue={formValue}
              className="grid grid-cols-2 gap-10 justify-center  w-full"
            >
              <Form.Group controlId="worldName">
                <Form.ControlLabel>World Name</Form.ControlLabel>
                <Form.Control name="worldName" />
              </Form.Group>

              <Form.Group controlId="charge">
                <Form.ControlLabel>Charge</Form.ControlLabel>

                <Form.Control type="number" name="charge" />
              </Form.Group>
              <Form.Group controlId="fees">
                <Form.ControlLabel>Fees</Form.ControlLabel>

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

export default AddWorldModal;
