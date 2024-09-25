"use client";


import { usePatchHospitalGroupMutation, usePostHospitalGroupMutation } from '@/redux/api/hospitalGroup/hospitalGroupSlice';
import { useAppSelector } from '@/redux/hook';
import { IHospitalGroup } from '@/types/allDepartmentInterfaces';
import React, { useState } from 'react';
import { Button, Form, Loader, Modal, Schema, Toggle } from 'rsuite';
import swal from 'sweetalert';

const NewHospitalGroup = ({ open, setPostModelOpen, defaultData }: {
    open: boolean;
    setPostModelOpen: (postModelOpen: boolean) => void;
    defaultData?: IHospitalGroup
}) => {
    const { StringType } = Schema.Types;
    const formRef: React.MutableRefObject<any> = React.useRef();
    const model = Schema.Model({
        label: StringType().isRequired("This field is required."),
        description: StringType().isRequired("This field is required."),
    });

    const [hospitalGroupData, setHospitalGroupData] = useState<IHospitalGroup>({
        label: "",
        description: "",
        value: "",

    } || !defaultData);
    const [
        postHospitalGroup
    ] = usePostHospitalGroupMutation()
    const [
        patchHospitalGroup,
    ] = usePatchHospitalGroupMutation()

    const handleSubmit = async () => {
        if (formRef.current.check()) {
            hospitalGroupData.value = hospitalGroupData.label.toLowerCase();
            if (defaultData === undefined) {
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
                }

            }

        }
    }

    const loading = useAppSelector((state) => state.loading.loading);

    return (
        <>
            <Modal size={"xs"} open={open}>
                <Modal.Header>
                    <Modal.Title>Add New Hospital Group</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-5">
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

export default NewHospitalGroup;