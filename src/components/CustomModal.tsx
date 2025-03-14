"use client";

import { ReactNode, useState } from "react";
import { Modal, Button, ButtonToolbar } from "rsuite";

interface IModalProps {
  title: string;
  text: string;
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}

type TModalProps = IModalProps;

const CustomModal = ({ title, text, children, open, setOpen }: TModalProps) => {
  // const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <ButtonToolbar>
        <Button appearance="primary" onClick={handleOpen}>
          {text}
        </Button>
      </ButtonToolbar>

      <Modal size="50rem" overflow={true} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="px-2">{children}</div>
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

export default CustomModal;
