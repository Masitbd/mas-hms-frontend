import { IPdrv } from "@/app/(withlayout)/pdrv/page";
import React from "react";
import { Form } from "rsuite";

const PdrvForm = ({
  defaultValue,
  setFormData,
  forwardedRef,
  model,
}: {
  defaultValue?: Record<string, any> | {};
  setFormData: (data: IPdrv) => void;
  forwardedRef: any;
  model: any;
}) => {
  return (
    <div>
      <Form
        formDefaultValue={defaultValue !== undefined ? defaultValue : {}}
        onChange={(formValue, event) => {
          setFormData({
            label: formValue.label || "",
            description: formValue.description || "",
            value: formValue.value || "",
          });

          // Additional logic if needed
        }}
        ref={forwardedRef}
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
    </div>
  );
};

export default PdrvForm;
