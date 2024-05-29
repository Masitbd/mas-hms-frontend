import { IPermission } from "@/app/(withlayout)/permission/page";
import React from "react";
import { Form } from "rsuite";

const PermissonForm = ({
  defaultValue,
  setFormData,
  forwardedRef,
  model,
}: {
  defaultValue?: Record<string, any> | {};
  setFormData: (data: IPermission) => void;
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
            code: formValue.code || "",
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
        <Form.Group controlId="code">
          <Form.ControlLabel>code</Form.ControlLabel>
          <Form.Control name="code" />
        </Form.Group>
      </Form>
    </div>
  );
};

export default PermissonForm;
