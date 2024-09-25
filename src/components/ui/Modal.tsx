import { useAppSelector } from "@/redux/hook";
import React from "react";
import { Button, Loader, Modal } from "rsuite";

const RModal = ({
  size,
  open,
  title,
  children,
  okHandler,
  cancelHandler,
}: {
  size: string;
  open: boolean;
  title: string;
  children: React.ReactElement;
  okHandler: <T>(data: T) => void;
  cancelHandler: <T>(data: T) => void;
}) => {
  const loading = useAppSelector((state) => state.loading.loading);
  return (
    <div>
      <Modal size={size} open={open}>
        <Modal.Header onClick={cancelHandler}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-5">{children}</Modal.Body>
        <Modal.Footer>
          <Button onClick={cancelHandler} appearance="subtle">
            Cancel
          </Button>
          <Button onClick={okHandler} appearance="primary">
            {loading ? <Loader></Loader> : "OK"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RModal;
