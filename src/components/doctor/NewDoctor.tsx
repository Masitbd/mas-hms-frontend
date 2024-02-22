"use client";
import ImageUpload from '@/lib/AllReusableFunctions/ImageUploader';
import { usePatchDoctorMutation, usePostDoctorMutation } from '@/redux/api/doctor/doctorSlice';
import { IDoctor } from '@/types/allDepartmentInterfaces';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { Button, ButtonToolbar, Col, Form, Grid, Row, Schema } from 'rsuite';
import swal from 'sweetalert';

const NewDoctor = ({ open, setPostModelOpen, defaultData, mode }: {
    open: boolean;
    setPostModelOpen: (postModelOpen: boolean) => void;
    defaultData?: IDoctor;
    mode: string
}) => {
    const fileInput = useRef<HTMLInputElement>(null)
    const { StringType, NumberType } = Schema.Types;
    const formRef: React.MutableRefObject<any> = useRef();

    const model = Schema.Model({
        name: StringType().isRequired("This field is required."),
        fatherName: StringType().isRequired("This field is required."),
        email: StringType().isEmail("This field is Required for email").isRequired("This field is required."),
        designation: StringType().isRequired("This field is required."),
        phone: NumberType().isRequired("This field is required.").addRule((value: string | number): boolean => {
            const phoneNumber = value.toString();
            if (phoneNumber.length <= 10) {
                return false
            }
            return true;
        }, "Phone number must be 11 digits.")
    });

    const [doctorData, setDoctorData] = useState<IDoctor>({
        name: "",
        fatherName: "",
        email: "",
        designation: "",
        phone: "",
        image: "",
    } || !defaultData);
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

    console.log(mode)


    return (
        <div>
            <div>
                {
                    mode === "watch" && defaultData?.image ? (
                        <Image src={defaultData?.image} alt='profile' width="200" height="150" />
                    ) : null
                }
                <Form
                    formDefaultValue={defaultData}
                    onChange={(formValue, event) => {
                        setDoctorData({
                            name: formValue.name || "",
                            fatherName: formValue.fatherName || "",
                            email: formValue.email || "",
                            designation: formValue.designation || "",
                            phone: formValue.phone || "",
                            image: urlInfo || 'https://res.cloudinary.com/deildnpys/image/upload/v1707574218/myUploads/wrm6s87apasmhne3soyb.jpg'
                        });

                        // Additional logic if needed
                    }}
                    ref={formRef}
                    model={model}
                    readOnly={mode === "watch"}

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
                                <Form.Group controlId="email">
                                    <Form.ControlLabel>{`Doctor's Email`}</Form.ControlLabel>
                                    <Form.Control name="email" />
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
                            {
                                mode !== "watch" &&
                                <Col sm={24} className="mt-6">
                                    <Form.Group controlId="file">
                                        <Form.ControlLabel>{`Please Select image`}</Form.ControlLabel>
                                        <input type='file' onChange={() => {
                                            ImageUpload(fileInput.current?.files?.[0]
                                                , value => {
                                                    return setUrlInfo(value as string);
                                                }
                                            );
                                        }} placeholder="Please select Image" ref={fileInput} />
                                    </Form.Group>
                                </Col>
                            }
                        </Row>
                    </Grid>
                    <Form.Group className="mt-5">
                        <ButtonToolbar>
                            {
                                mode !== "watch" &&
                                <Button appearance="primary" onClick={handleSubmit} className="mr-5">Submit</Button>
                            }
                            <Button appearance="default" onClick={() => setPostModelOpen(!open)}>Cancel</Button>
                        </ButtonToolbar>
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
};

export default NewDoctor;