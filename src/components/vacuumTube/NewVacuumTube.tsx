"use client";

import { usePatchVacuumTubeMutation, usePostVacuumTubeMutation } from '@/redux/api/vacuumTube/vacuumTubeSlice';
import { useAppSelector } from '@/redux/hook';
import { ISpecimen, IVacuumTube } from '@/types/allDepartmentInterfaces';
import React, { useState } from 'react';
import { Button, Form, Loader, Modal, Schema } from 'rsuite';
import swal from 'sweetalert';

const NewVacuumTube = ({ open, setPostModelOpen, defaultData }: {
  open: boolean;
  setPostModelOpen: (postModelOpen: boolean) => void;
  defaultData?: ISpecimen
}) => {
  const { StringType, NumberType } = Schema.Types;
  const formRef: React.MutableRefObject<any> = React.useRef();
  const model = Schema.Model({
    label: StringType().isRequired("This field is required."),
    description: StringType().isRequired("This field is required."),
    price: NumberType().isRequired("This field is required."),
  });

  const [vacuumTube, setVacuumTube] = useState<IVacuumTube>({
    label: "",
    value: "",
    price: 0,
    description: "",
  } || !defaultData);
  const [
    postVacuumTube
  ] = usePostVacuumTubeMutation();
  const [
    patchVacuumTube,
  ] = usePatchVacuumTubeMutation();

  const handleSubmit = async () => {
    if (formRef.current.check()) {
      vacuumTube.value = vacuumTube.label.toLowerCase();
      if (defaultData === undefined) {
        const result = await postVacuumTube(vacuumTube)
        if ('data' in result) {
          const message = (result as { data: { message: string } })?.data.message;
          swal(`Done! ${message}!`, {
            icon: "success",
          })
          setPostModelOpen(false)
        }
      } else {
        const result = await patchVacuumTube({ data: vacuumTube, id: defaultData._id as string })
        if ('data' in result) {
          const message = (result as { data: { message: string } })?.data.message;
          swal(`Done! ${message}!`, {
            icon: "success",
          })
          setPostModelOpen(false)
        }

      }

    }
  }

  const loading = useAppSelector((state) => state.loading.loading);

  //patch


  // const [vacuumTubePatch, setvacuumTubePatch] = useState<ISpecimen>(defaultData);

  return (
    <>
      <Modal size={"xs"} open={open}>
        <Modal.Header>
          <Modal.Title>Add New Vacuum Tube</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-5">
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setPostModelOpen(!open)} appearance="subtle">
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

export default NewVacuumTube;