"use client";
import { usePatchDepartmentMutation, usePostDepartmentMutation } from '@/redux/api/department/departmentSlice';
import { useAppSelector } from '@/redux/hook';
import { IDoctor } from '@/types/allDepartmentInterfaces';
import React, { useState } from 'react';
import { Button, Col, Form, Grid, Loader, Modal, Row, Schema, Uploader } from 'rsuite';


async function previewFile(file: Blob | undefined) {
    // const reader = new FileReader();
    // reader.onloadend = () => {
    //     callback(reader.result);
    // };
    const formData = new FormData();
    formData.append('file', file)
    formData.append('upload_preset', 'myUploads')
    const result = await fetch('https://api.cloudinary.com/v1_1/deildnpys/image/upload', {
        method: "POST",
        body: formData
    }).then(r => r.json())
    console.log('result', result);
    // reader.readAsDataURL(file);
}

const NewDoctor = ({ open, setPostModelOpen, defaultData }: {
    open: boolean;
    setPostModelOpen: (postModelOpen: boolean) => void;
    defaultData?: IDoctor
}) => {

    const { StringType, NumberType } = Schema.Types;
    const formRef: React.MutableRefObject<any> = React.useRef();
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
    const [doctorImageUrl, setDoctorImageUrl] = useState<string>("")
    const [
        postDepartment
    ] = usePostDepartmentMutation();
    const [
        patchDepartment,
    ] = usePatchDepartmentMutation();

    const handleSubmit = async () => {
        if (formRef.current.check()) {
            if (defaultData === undefined) {
                // const result = await postDepartment(doctorData)
                // if ('data' in result) {
                //     const message = (result as { data: { message: string } })?.data.message;
                //     swal(`Done! ${message}!`, {
                //         icon: "success",
                //     })
                //     setPostModelOpen(false)
                // }
            } else {
                // const result = await patchDepartment({ data: departmentData, id: defaultData._id as string })
                // if ('data' in result) {
                //     const message = (result as { data: { message: string } })?.data.message;
                //     swal(`Done! ${message}!`, {
                //         icon: "success",
                //     })
                //     setPostModelOpen(false)
                // }

            }

        }
    }
    const [uploading, setUploading] = React.useState(false);
    const [fileInfo, setFileInfo] = React.useState(null);
    console.log(fileInfo)

    // const handleImageUpload = async (file: any) => {

    //     

    // };


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
                                image: doctorImageUrl
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
                                    <Form.Group controlId="image">
                                        <Uploader action='' onUpload={file => {
                                            setUploading(true);
                                            previewFile(file.blobFile);
                                        }} draggable>
                                            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span>Click or Drag image to this area to upload</span>
                                            </div>
                                        </Uploader>
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