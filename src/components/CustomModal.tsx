"use client";

import { ReactNode, useState } from "react";
import { Modal, Button, ButtonToolbar } from "rsuite";

interface IModalProps {
  title: string;
  text: string | JSX.Element;
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean | undefined;
  size?: string;
  buttonSize?: "xs" | "sm" | "md" | "lg";
  color?: "blue" | "red" | "green" | "yellow" | "violet";
  appearance?: "primary" | "ghost";
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
  color,
  buttonSize,
  appearance,
}: TModalProps) => {
  // const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <ButtonToolbar>
        <Button
          disabled={disabled}
          size={buttonSize || "lg"}
          color={color || "blue"}
          appearance={appearance || "primary"}
          onClick={handleOpen}
          className={`${!buttonSize ? "w-48" : "w-10"}  ${
            !buttonSize ? "h-11" : "h-6"
          }`}
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
