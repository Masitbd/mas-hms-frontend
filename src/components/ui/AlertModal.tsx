import { Modal, ButtonToolbar, Button, Loader } from "rsuite";
import RemindIcon from "@rsuite/icons/legacy/Remind";
import { useState } from "react";
import { useAppSelector } from "@/redux/hook";

const AlartDialog = ({
  title,
  description,
  open,
  onOk,
  onCancel,
  loading,
}: {
  title: string;
  description: string;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  loading?: boolean;
}) => {
  return (
    <>
      <Modal backdrop="static" role="alertdialog" open={open} size="xs">
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RemindIcon style={{ color: "#ffb300", fontSize: 24 }} />
          {description}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={onOk}
            appearance="primary"
            loading={loading ? loading : false}
          >
            OK
          </Button>
          <Button onClick={onCancel} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AlartDialog;
