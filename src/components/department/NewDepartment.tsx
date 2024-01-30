"use client";

import { usePatchDepartmentMutation, usePostDepartmentMutation } from '@/redux/api/department/departmentSlice';
import { useAppSelector } from '@/redux/hook';
import { IDepartment } from '@/types/allDepartmentInterfaces';
import React, { useState } from 'react';
import { Button, Form, Loader, Modal, Schema, Toggle } from 'rsuite';
import swal from 'sweetalert';

const NewDepartmentTable = ({ open, setPostModelOpen, defaultData }: {
    open: boolean;
    setPostModelOpen: (postModelOpen: boolean) => void;
    defaultData?: IDepartment
}) => {
    const { StringType, NumberType } = Schema.Types;
    const formRef: React.MutableRefObject<any> = React.useRef();
    const model = Schema.Model({
        label: StringType().isRequired("This field is required."),
        description: StringType().isRequired("This field is required."),
        fixedCommission: NumberType().isRequired("This field is required."),
        commissionParcentage: NumberType().isRequired("This field is required."),
    });

    const [departmentData, setDepartmentData] = useState<IDepartment>({
        label: "",
        description: "",
        value: "",
        commissionParcentage: 0,
        fixedCommission: 0,
        isCommissionFiexed: false,

    } || !defaultData);
    const [
        postDepartment
    ] = usePostDepartmentMutation();
    const [
        patchDepartment,
    ] = usePatchDepartmentMutation();

    const handleSubmit = async () => {
        if (formRef.current.check()) {
            departmentData.value = departmentData.label.toLowerCase();
            if (defaultData === undefined) {
                const result = await postDepartment(departmentData)
                if ('data' in result) {
                    const message = (result as { data: { message: string } })?.data.message;
                    swal(`Done! ${message}!`, {
                        icon: "success",
                    })
                    setPostModelOpen(false)
                }
            } else {
                const result = await patchDepartment({ data: departmentData, id: defaultData._id as string })
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

    
    const [fixedCommissionEnabled, setFixedCommissionEnabled] = useState(false);

    return (
        <>
            <Modal size={"xs"} open={open}>
                <Modal.Header>
                    <Modal.Title>Add New Department</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-5">
                    <Form
                        formDefaultValue={defaultData}
                        onChange={(formValue, event) => {
                            setDepartmentData({
                                label: formValue.label || "",
                                description: formValue.description || "",
                                value: formValue.value || "",
                                commissionParcentage: formValue.commissionParcentage || 0,
                                fixedCommission: formValue.fixedCommission || 0,
                                isCommissionFiexed: fixedCommissionEnabled
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
                        <Form.Group>
                            <Form.ControlLabel>
                                <Toggle checked={fixedCommissionEnabled} onChange={(value: boolean) => setFixedCommissionEnabled(value)} />
                                Enable Fixed Commission
                            </Form.ControlLabel>
                        </Form.Group>
                        <Form.Group controlId="commissionParcentage">
                            <Form.ControlLabel>Commission Percentage</Form.ControlLabel>
                            <Form.Control name="commissionParcentage" disabled={fixedCommissionEnabled} />
                        </Form.Group>
                        <Form.Group controlId="fixedCommission">
                            <Form.ControlLabel>Fixed Commission</Form.ControlLabel>
                            <Form.Control name="fixedCommission" disabled={!fixedCommissionEnabled} />
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

export default NewDepartmentTable;