import React from "react";
import { Button, Loader, Modal } from "rsuite";

const RModal = ({
  size,
  open,
  title,
  children,
  okHandler,
  cancelHandler,
  loading,
}: {
  size: string;
  open: boolean;
  title: string;
  children: React.ReactElement;
  okHandler?: <T>(data: T) => void;
  cancelHandler?: <T>(data: T) => void;
  loading?: boolean;
}) => {
  return (
    <div>
      <Modal size={size} open={open} backdrop="static" onClose={cancelHandler}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-5">{children}</Modal.Body>
        {okHandler && cancelHandler && (
          <Modal.Footer>
            <Button
              onClick={cancelHandler}
              appearance="subtle"
              loading={loading ? loading : false}
            >
              Cancel
            </Button>
            <Button onClick={okHandler} appearance="primary">
              {loading ? <Loader></Loader> : "OK"}
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
};

export default RModal;
