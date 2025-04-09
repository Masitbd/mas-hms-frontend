import React, { useEffect, useState } from "react";
import CustomModal from "../CustomModal";
import { Button, ButtonToolbar, Form, Modal } from "rsuite";
import Swal from "sweetalert2";
import { useUpdatePackageMutation } from "@/redux/api/package.api";
import { TPackage } from "./PackageTable";
import EditIcon from "@rsuite/icons/Edit";

type TInit = {
  name: string | null;
  price: number | null;
};

const initialValue: TInit = {
  name: null,
  price: null,
};

const EditPackageModal = ({ item }: { item: TPackage }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [createPackage, { isLoading }] = useUpdatePackageMutation();

  const [formValue, setFormValue] = useState(initialValue);

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
      <ButtonToolbar>
        <Button appearance="ghost" color="green" onClick={handleOpen}>
          <EditIcon color="green" />
        </Button>
      </ButtonToolbar>

      <Modal size="50rem" overflow={true} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Package Edit</Modal.Title>
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
              <Form.Group controlId="name">
                <Form.ControlLabel>Package Name</Form.ControlLabel>
                <Form.Control name="name" />
              </Form.Group>
              <Form.Group controlId="price">
                <Form.ControlLabel>Price</Form.ControlLabel>
                <Form.Control name="price" />
              </Form.Group>

              <div className="col-span-2 w-full">
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

export default EditPackageModal;
