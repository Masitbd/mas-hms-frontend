"use client";
import { usePatchConditionMutation, usePostConditionMutation } from '@/redux/api/condition/conditionSlice';
import { usePatchSpecimenMutation, usePostSpecimenMutation } from '@/redux/api/specimen/specimenSlice';
import { useAppSelector } from '@/redux/hook';
import { ISpecimen } from '@/types/allDepartmentInterfaces';
import React, { useState } from 'react';
import { Button, Form, Loader, Modal, Schema } from 'rsuite';
import swal from 'sweetalert';

const NewSpecimenModel = ({ open, setPostModelOpen, defaultData }: {
  open: boolean;
  setPostModelOpen: (postModelOpen: boolean) => void;
  defaultData?: ISpecimen
}) => {
  const { StringType, NumberType } = Schema.Types;
  const formRef: React.MutableRefObject<any> = React.useRef();
  const model = Schema.Model({
    label: StringType().isRequired("This field is required."),
    description: StringType().isRequired("This field is required."),
  });

  const [specimenData, setSpecimenData] = useState<ISpecimen>({
    label: "",
    description: "",
    value: "",
  } || !defaultData);
  const [
    postSpecimen
  ] = usePostSpecimenMutation();
  const [
    patchSpecimen,
  ] = usePatchSpecimenMutation();

  const handleSubmit = async () => {
    if (formRef.current.check()) {
      specimenData.value = specimenData.label.toLowerCase();
      if (defaultData === undefined) {
        const result = await postSpecimen(specimenData)
        if ('data' in result) {
          const message = (result as { data: { message: string } })?.data.message;
          swal(`Done! ${message}!`, {
            icon: "success",
          })
          setPostModelOpen(false)
        }
      } else {
        const result = await patchSpecimen({ data: specimenData, id: defaultData._id as string })
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


  // const [specimenDataPatch, setSpecimenDataPatch] = useState<ISpecimen>(defaultData);

  return (
    <>
      <Modal size={"xs"} open={open}>
        <Modal.Header>
          <Modal.Title>Add New Specimen</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-5">
          <Form
            formDefaultValue={defaultData}
            onChange={(formValue, event) => {
              setSpecimenData({
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

export default NewSpecimenModel;