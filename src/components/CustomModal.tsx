"use client";

import { ReactNode, useState } from "react";
import { Modal, Button, ButtonToolbar } from "rsuite";

interface IModalProps {
  title: string;
  text: string;
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean | undefined;
  size?: string;
}

type TModalProps = IModalProps;

const CustomModal = ({
  title,
  text,
  children,
  open,
  setOpen,
  disabled,
  size,
}: TModalProps) => {
  // const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <ButtonToolbar>
        <Button
          disabled={disabled}
          size="lg"
          appearance="primary"
          onClick={handleOpen}
        >
          {text}
        </Button>
      </ButtonToolbar>

      <Modal
        size={size ? size : "50rem"}
        overflow={true}
        open={open}
        backdrop="static"
        onClose={handleClose}
        className="p-5"
      >
        <Modal.Header>
          <Modal.Title className="text-center">{title}</Modal.Title>
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
