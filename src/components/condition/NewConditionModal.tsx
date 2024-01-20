"use client";
import { useAppSelector } from "@/redux/hook";
import React, { useState } from "react";
import { Button, Modal, Schema, Form, Loader, Input } from "rsuite";
const NewConditionModal = ({
  open,
  postCondition,
  cancelHandler,
}: {
  open: boolean;
  postCondition: ({
    label,
    description,
    value,
  }: {
    value: string;
    label: string;
    description: string;
  }) => void;
  cancelHandler: () => void;
}) => {
  const { StringType, NumberType } = Schema.Types;
  const formRef: React.MutableRefObject<any> = React.useRef();
  const model = Schema.Model({
    label: StringType().isRequired("This field is required."),
    description: StringType().isRequired("This field is required."),
  });

  const [conditioData, setConditioData] = useState<{
    label: string;
    description: string;
    value: string;
  }>({
    label: "",
    description: "",
    value: "",
  });
  const handleSubmit = () => {
    if (formRef.current.check()) {
      conditioData.value = conditioData.label.toLowerCase();
      postCondition(conditioData);
    } else {
    }
  };
  const loading = useAppSelector((state) => state.loading.loading);
  const Textarea = React.forwardRef((props, ref) => (
    <Input {...props} as="textarea" ref={ref} />
  ));

  return (
    <>
      <Modal size={"xs"} open={open}>
        <Modal.Header>
          <Modal.Title>Add New Condition</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-5">
          <Form
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

export default NewConditionModal;
