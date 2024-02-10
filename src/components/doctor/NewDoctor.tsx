"use client";
import { usePatchDoctorMutation, usePostDoctorMutation } from '@/redux/api/doctor/doctorSlice';
import { useAppSelector } from '@/redux/hook';
import { IDoctor } from '@/types/allDepartmentInterfaces';
import React, { useRef, useState } from 'react';
import { Button, Col, Form, Grid, Loader, Modal, Row, Schema } from 'rsuite';
import swal from 'sweetalert';


async function previewFile(file: File | undefined,
    callback: { (value: string): void; (arg0: string): void; }
) {

    const formData = new FormData();
    formData.append('file', file!)
    formData.append('upload_preset', 'myUploads')
    const result = await fetch('https://api.cloudinary.com/v1_1/deildnpys/image/upload', {
        method: "POST",
        body: formData
    }).then(r => r.json())
    callback(result.secure_url)
}

const NewDoctor = ({ open, setPostModelOpen, defaultData }: {
    open: boolean;
    setPostModelOpen: (postModelOpen: boolean) => void;
    defaultData?: IDoctor
}) => {
    const fileInput = useRef<HTMLInputElement>(null)
    const { StringType, NumberType } = Schema.Types;
    const formRef: React.MutableRefObject<any> = useRef();

    const model = Schema.Model({
        name: StringType().isRequired("This field is required."),
        fatherName: StringType().isRequired("This field is required."),
        designation: StringType().isRequired("This field is required."),
        phone: StringType().isRequired("This field is required."),
    });

    const [doctorData, setDoctorData] = useState<IDoctor>({
        name: "",
        fatherName: "",
        designation: "",
        phone: "",
        image: "",
    } || !defaultData);
    const [uploading, setUploading] = useState<boolean>(false);
    const [urlInfo, setUrlInfo] = useState<string>("");
    console.log(urlInfo)
    const [
        postDoctor
    ] = usePostDoctorMutation();
    const [
        patchDoctor,
    ] = usePatchDoctorMutation();

    const handleSubmit = async () => {
        if (formRef.current.check()) {
            if (defaultData === undefined) {
                const result = await postDoctor(doctorData)
                if ('data' in result) {
                    const message = (result as { data: { message: string } })?.data.message;
                    swal(`Done! ${message}!`, {
                        icon: "success",
                    })
                    setPostModelOpen(false)
                }
            } else {
                const result = await patchDoctor({ data: doctorData, id: defaultData._id as string })
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
            <Modal size={"md"} open={open}>
                <Modal.Header>
                    <Modal.Title>Add New Doctor</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-5">
                    <Form
                        formDefaultValue={defaultData}
                        onChange={(formValue, event) => {
                            setDoctorData({
                                name: formValue.name || "",
                                fatherName: formValue.fatherName || "",
                                designation: formValue.designation || "",
                                phone: formValue.phone || "",
                                image: urlInfo || ""
                            });

                            // Additional logic if needed
                        }}
                        ref={formRef}
                        model={model}
                    >
                        <Grid fluid>
                            <Row>
                                <Col sm={12} className="mt-6">
                                    <Form.Group controlId="name">
                                        <Form.ControlLabel>Doctor Name</Form.ControlLabel>
                                        <Form.Control name="name" />
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className="mt-6">
                                    <Form.Group controlId="fatherName">
                                        <Form.ControlLabel>{`Doctor's Father Name`}</Form.ControlLabel>
                                        <Form.Control name="fatherName" />
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className="mt-6">
                                    <Form.Group controlId="designation">
                                        <Form.ControlLabel>{`Doctor's designation`}</Form.ControlLabel>
                                        <Form.Control name="designation" />
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className="mt-6">
                                    <Form.Group controlId="phone">
                                        <Form.ControlLabel>{`Doctor's Phone number`}</Form.ControlLabel>
                                        <Form.Control name="phone" />
                                    </Form.Group>
                                </Col>
                                <Col sm={24} className="mt-6">
                                    <Form.Group controlId="file">
                                        <Form.ControlLabel>{`Please Select image`}</Form.ControlLabel>
                                        <input type='file' onChange={() => {
                                            previewFile(fileInput.current?.files?.[0]
                                                , value => {
                                                    return setUrlInfo(value as string);
                                                }
                                            );
                                        }} placeholder="Please select Image" ref={fileInput} />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Grid>
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

export default NewDoctor;