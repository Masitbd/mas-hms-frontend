"use client";

import {
  usePatchVacuumTubeMutation,
  usePostVacuumTubeMutation,
} from "@/redux/api/vacuumTube/vacuumTubeSlice";
import { IVacuumTube } from "@/types/allDepartmentInterfaces";
import { NewFormType } from "@/types/componentsType";
import React, { useState } from "react";
import { Button, Form, Schema } from "rsuite";
import swal from "sweetalert";

const NewVacuumTube = ({
  open,
  setPostModelOpen,
  defaultData,
  setMode,
  mode,
}: NewFormType<IVacuumTube>) => {
  const { StringType, NumberType } = Schema.Types;
  const formRef: React.MutableRefObject<any> = React.useRef();
  const model = Schema.Model({
    label: StringType().isRequired("This field is required."),

    price: NumberType().isRequired("This field is required."),
  });

  const [vacuumTube, setVacuumTube] = useState<IVacuumTube>(defaultData);
  const [postVacuumTube] = usePostVacuumTubeMutation();
  const [patchVacuumTube] = usePatchVacuumTubeMutation();

  const handleSubmit = async () => {
    if (formRef.current.check()) {
      vacuumTube.value = vacuumTube.label.toLowerCase();
      if (mode == "new") {
        const result = await postVacuumTube(vacuumTube);
        if ("data" in result) {
          const message = (result as { data: { message: string } })?.data
            .message;
          swal(`Done! ${message}!`, {
            icon: "success",
          });
          setPostModelOpen(false);
        }
      } else {
        const result = await patchVacuumTube({
          data: vacuumTube,
          id: defaultData._id as string,
        });
        if ("data" in result) {
          const message = (result as { data: { message: string } })?.data
            .message;
          swal(`Done! ${message}!`, {
            icon: "success",
          });
          setPostModelOpen(false);
          setMode("new");
        }
      }
    }
  };

  return (
    <>
      <Form
        formDefaultValue={defaultData}
        onChange={(formValue, event) => {
          setVacuumTube({
            label: formValue.label || "",
            value: formValue.value || "",
            price: formValue.price || 0,
            description: formValue.description || "",
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
        <Form.Group controlId="price">
          <Form.ControlLabel>Price</Form.ControlLabel>
          <Form.Control name="price" />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.ControlLabel>Description</Form.ControlLabel>
          <Form.Control name="description" />
        </Form.Group>
        <Button
          onClick={() => {
            setPostModelOpen(!open);
            setMode("new");
            setVacuumTube({
              label: "",
              description: "",
              value: "",
              price: 0,
            });
          }}
          appearance="subtle"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="ml-5" appearance="primary">
          OK
        </Button>
      </Form>
    </>
  );
};

export default NewVacuumTube;
