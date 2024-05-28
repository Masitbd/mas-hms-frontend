"use client";
import { usePatchSpecimenMutation, usePostSpecimenMutation } from '@/redux/api/specimen/specimenSlice';
import { ISpecimen } from '@/types/allDepartmentInterfaces';
import { NewFormType } from '@/types/componentsType';
import React, { useState } from 'react';
import { Button, Form, Schema } from 'rsuite';
import swal from 'sweetalert';



const NewSpecimenModel = ({ open,
  setPostModelOpen,
  defaultData,
  setMode,
  mode }: NewFormType<ISpecimen>) => {
  const { StringType, NumberType } = Schema.Types;
  const formRef: React.MutableRefObject<any> = React.useRef();
  const model = Schema.Model({
    label: StringType().isRequired("This field is required."),
    // description: StringType().isRequired("This field is required."),
  });

  const [specimenData, setSpecimenData] = useState<ISpecimen>(defaultData);
  const [
    postSpecimen
  ] = usePostSpecimenMutation();
  const [
    patchSpecimen,
  ] = usePatchSpecimenMutation();

  const handleSubmit = async () => {
    if (formRef.current.check()) {
      specimenData.value = specimenData.label.toLowerCase();
      if (mode == "new") {
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
          setMode("new")
        }
      }

    }
  }

  return (
    <>
      <Form
        formDefaultValue={defaultData}
        onChange={(formValue, event) => {
          setSpecimenData({
            label: formValue.label,
            description: formValue.description,
            value: formValue.value,
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
        <Button onClick={() => {
          setMode("new")
          setSpecimenData({
            label: "",
            description: "",
            value: "",
          });
          setPostModelOpen(!open)
        }} appearance="subtle">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className='ml-5' appearance="primary">
          OK
        </Button>
      </Form>
    </>
  );
};

export default NewSpecimenModel;