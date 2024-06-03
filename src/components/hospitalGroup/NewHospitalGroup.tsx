"use client";


import { usePatchHospitalGroupMutation, usePostHospitalGroupMutation } from '@/redux/api/hospitalGroup/hospitalGroupSlice';
import { IHospitalGroup } from '@/types/allDepartmentInterfaces';
import { NewFormType } from '@/types/componentsType';
import React, { useState } from 'react';
import { Button, Form, Schema } from 'rsuite';
import swal from 'sweetalert';



const NewHospitalGroup = ({
    open,
    setPostModelOpen,
    defaultData,
    setMode,
    mode
}: NewFormType<IHospitalGroup>) => {
    const { StringType } = Schema.Types;
    const formRef: React.MutableRefObject<any> = React.useRef();
    const model = Schema.Model({
        label: StringType().isRequired("This field is required."),
        // description: StringType().isRequired("This field is required."),
    });

    const [hospitalGroupData, setHospitalGroupData] = useState<IHospitalGroup>(defaultData);
    const [
        postHospitalGroup
    ] = usePostHospitalGroupMutation()
    const [
        patchHospitalGroup,
    ] = usePatchHospitalGroupMutation()

    const handleSubmit = async () => {
        if (formRef.current.check()) {
            hospitalGroupData.value = hospitalGroupData.label.toLowerCase();
            if (mode === 'new') {
                const result = await postHospitalGroup(hospitalGroupData)
                if ('data' in result) {
                    const message = (result as { data: { message: string } })?.data.message;
                    swal(`Done! ${message}!`, {
                        icon: "success",
                    })
                    setPostModelOpen(false)
                }
            } else {
                const result = await patchHospitalGroup({ data: hospitalGroupData, id: defaultData._id as string })
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
                    setHospitalGroupData({
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
                <Button onClick={() => {
                    setPostModelOpen(!open)
                    setMode("new")
                    setHospitalGroupData({
                        label: "",
                        description: "",
                        value: "",
                    })
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

export default NewHospitalGroup;