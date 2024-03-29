"use client";

import { useAppSelector } from "@/redux/hook";
import { ICondition } from "@/types/allDepartmentInterfaces";
import React, { useState } from "react";
import { Button, Modal, Schema, Form, Loader, Input } from "rsuite";
const PatchConditonModal = ({
  open,
  patchCondition,
  cancelHandler,
  defalutValue,
}: {
  open: boolean;
  patchCondition: ({
    data: { label, description, value },
    id,
  }: {
    data: ICondition;
    id: string;
  }) => void;
  cancelHandler: () => void;
  defalutValue: ICondition;
}) => {
  const { StringType } = Schema.Types;
  const formRef: React.MutableRefObject<any> = React.useRef();
  const model = Schema.Model({
    label: StringType().isRequired("This field is required."),
    description: StringType().isRequired("This field is required."),
  });

  const [conditioData, setConditioData] = useState<{
    label: string;
    description: string;
    value: string;
  }>(defalutValue);
  const handleSubmit = () => {
    if (formRef.current.check()) {
      conditioData.value = conditioData.label.toLowerCase();
      patchCondition({ data: conditioData, id: defalutValue._id as string });
    } else {
    }
  };
  const loading = useAppSelector((state) => state.loading.loading);

  return (
    <>
      <Modal size={"xs"} open={open}>
        <Modal.Header>
          <Modal.Title>Add New Condition</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-5">
          <Form
            formDefaultValue={defalutValue}
            onChange={(formValue, event) => {
              setConditioData({
                label: formValue.label || "",
                description: formValue.description || "",
                value: formValue.value || "",
              });

              // Additional logic if needed
            }}
            ref={formRef}
            model={model}
          >
            <Form.Group controlId="label">
              <Form.ControlLabel>Title</Form.ControlLabel>
              <Form.Control name="label" />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.ControlLabel>Description</Form.ControlLabel>
              <Form.Control name="description" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={cancelHandler} appearance="subtle">
            Cancel
          </Button>
          <Button onClick={handleSubmit} appearance="primary">
            {loading ? <Loader></Loader> : "OK"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PatchConditonModal;
