"use client";
import ImageUpload from "@/lib/AllReusableFunctions/ImageUploader";
import {
  usePatchDoctorMutation,
  usePostDoctorMutation,
} from "@/redux/api/doctor/doctorSlice";
import { useGetSingleByUuidTransactionQuery } from "@/redux/api/transaction/transactionSlice";

import { useGetSingleAccountQuery } from "@/redux/api/account/accountSlice";
import { IDoctor } from "@/types/allDepartmentInterfaces";
import { NewFormType } from "@/types/componentsType";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  ButtonToolbar,
  Col,
  Form,
  Grid,
  Row,
  Schema,
  Table,
} from "rsuite";
import swal from "sweetalert";
import RModal from "../ui/Modal";
import PayModel from "./PayModel";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";

const { Column, HeaderCell, Cell } = Table;

const NewDoctor = ({
  open,
  setPostModelOpen,
  defaultData,
  mode,
  setMode,
}: NewFormType<IDoctor>) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const { StringType, NumberType } = Schema.Types;
  const formRef: React.MutableRefObject<any> = useRef();

  const { data: account, refetch } = useGetSingleAccountQuery(
    defaultData.account_number as string
  );

  const { data: transaction, isLoading } = useGetSingleByUuidTransactionQuery(
    defaultData.account_number as string
  );

  const model = Schema.Model({
    title: StringType().isRequired("This field is required."),
    name: StringType().isRequired("This field is required."),
  });

  const [doctorData, setDoctorData] = useState<IDoctor>(defaultData);

  const [postDoctor] = usePostDoctorMutation();
  const [patchDoctor] = usePatchDoctorMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSubmit = async () => {
    console.log(fileInput.current?.files?.[0]);
    if (formRef.current.check()) {
      await ImageUpload(fileInput.current?.files?.[0], (value) => {
        return (doctorData.image = value as string);
      });
      if (mode == "new") {
        doctorData.image =
          doctorData.image ||
          "https://res.cloudinary.com/deildnpys/image/upload/v1707574218/myUploads/wrm6s87apasmhne3soyb.jpg";
        const result = await postDoctor(doctorData);
        console.log(doctorData, "doctorData");
        if ("data" in result) {
          const message = (result as { data: { message: string } })?.data
            .message;
          swal(`Done! ${message}!`, {
            icon: "success",
          });
          setPostModelOpen(false);
        }
      } else {
        doctorData.image = doctorData.image || defaultData.image;
        const result = await patchDoctor({
          data: doctorData,
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
  const [selected, setSelected] = useState<ArrayBuffer | string | undefined>(
    ""
  );

  const [payModel, setPayModel] = useState(false);

  return (
    <>
      <div>
        <div>
          {mode === "watch" && defaultData.image ? (
            <Image
              src={defaultData.image}
              alt="profile"
              width={300}
              height={250}
            />
          ) : null}
          <Form
            formDefaultValue={defaultData}
            onChange={(formValue, event) => {
              setDoctorData({
                title: formValue.title,
                name: formValue.name,
                fatherName: formValue.fatherName,
                email: formValue.email,
                designation: formValue.designation,
                phone: formValue.phone,
                image: "",
                code: formValue.code,
              });
            }}
            ref={formRef}
            model={model}
            readOnly={mode === "watch"}
          >
            <Grid fluid>
              <Row>
                <Col sm={12} className="mt-6">
                  <Form.Group controlId="title">
                    <Form.ControlLabel>Title</Form.ControlLabel>
                    <Form.Control name="title" />
                  </Form.Group>
                </Col>
                <Col sm={12} className="mt-6">
                  <Form.Group controlId="name">
                    <Form.ControlLabel>Doctor Name</Form.ControlLabel>
                    <Form.Control name="name" />
                  </Form.Group>
                </Col>{" "}
                <Col sm={12} className="mt-6">
                  <Form.Group controlId="code">
                    <Form.ControlLabel>Code</Form.ControlLabel>
                    <Form.Control name="code" />
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
                    <Form.ControlLabel>{`Doctor's phone number`}</Form.ControlLabel>
                    <Form.Control name="phone" />
                  </Form.Group>
                </Col>
                {mode === "watch" && (
                  <>
                    <Col sm={12} className="mt-6">
                      <Form.Group controlId="">
                        <Form.ControlLabel>{`Doctor's UUID`}</Form.ControlLabel>
                        <Form.Control name="" value={account?.data[0].uuid} />
                      </Form.Group>
                    </Col>
                    <Col sm={12} className="mt-6">
                      <Form.Group controlId="">
                        <Form.ControlLabel>{`Doctor's Balance`}</Form.ControlLabel>
                        <Form.Control
                          name=""
                          value={account?.data[0].balance}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={12} className="mt-6">
                      <Form.Group controlId="">
                        <Form.ControlLabel>{`Doctor's Balance Type`}</Form.ControlLabel>
                        <Form.Control
                          name=""
                          value={account?.data[0].balanceType}
                        />
                      </Form.Group>
                    </Col>
                  </>
                )}
                {mode !== "watch" && (
                  <>
                    <Col sm={24} className="mt-6">
                      <Form.Group controlId="file">
                        <Form.ControlLabel>{`Please Select image`}</Form.ControlLabel>
                        <input
                          type="file"
                          accept="image/jpeg, image/png"
                          onChange={() => {
                            const reader = new FileReader();
                            const file = fileInput.current?.files?.[0];
                            if (!file) {
                              console.log("no file selected");
                              return;
                            }
                            if (!file.type.startsWith("image/")) {
                              swal(
                                `InValid file type. please select on image`,
                                {
                                  icon: "warning",
                                }
                              );
                              return;
                            }
                            reader.readAsDataURL(file as Blob);
                            reader.onload = (e) => {
                              setSelected(e.target?.result ?? "");
                            };
                          }}
                          ref={fileInput}
                        />
                      </Form.Group>
                      {selected && (
                        <Avatar
                          size="lg"
                          src={selected as string}
                          alt="@SevenOutman"
                        />
                      )}
                    </Col>
                  </>
                )}
              </Row>
            </Grid>
            {mode === "watch" && transaction !== undefined && (
              <AuthCheckerForComponent
                requiredPermission={[ENUM_USER_PEMISSION.GET_DOCTORS_COMISSION]}
              >
                <Table
                  autoHeight
                  data={transaction?.data}
                  loading={isLoading}
                  bordered
                  cellBordered
                  rowHeight={65}
                  className="text-md mt-6"
                  wordWrap
                >
                  <Column flexGrow={2}>
                    <HeaderCell>{"Doctor's uuid"}</HeaderCell>
                    <Cell dataKey="uuid" />
                  </Column>
                  <Column flexGrow={2}>
                    <HeaderCell>{"Doctor's amount"}</HeaderCell>
                    <Cell dataKey="amount" />
                  </Column>
                  <Column flexGrow={1}>
                    <HeaderCell>{"Doctor's transaction Type"}</HeaderCell>
                    <Cell dataKey="transactionType" />
                  </Column>

                  <Column flexGrow={3}>
                    <HeaderCell>{"Doctor's description"}</HeaderCell>
                    <Cell dataKey="description" />
                  </Column>
                </Table>
              </AuthCheckerForComponent>
            )}

            <Form.Group className="mt-5">
              <ButtonToolbar>
                {mode !== "watch" ? (
                  <Button
                    appearance="primary"
                    type="submit"
                    onClick={handleSubmit}
                    className="mr-5"
                  >
                    Submit
                  </Button>
                ) : (
                  <AuthCheckerForComponent
                    requiredPermission={[
                      ENUM_USER_PEMISSION.MANAGE_DOCTOR_COMMISSION,
                    ]}
                  >
                    <Button
                      appearance="primary"
                      onClick={() => setPayModel(!payModel)}
                      className="mr-1"
                    >
                      Pay
                    </Button>
                  </AuthCheckerForComponent>
                )}
                <Button
                  appearance="default"
                  className="ml-5"
                  onClick={() => {
                    setMode("new");
                    setPostModelOpen(!open);
                    setDoctorData({
                      title: "",
                      name: "",
                      fatherName: "",
                      email: "",
                      designation: "",
                      phone: "",
                      image: "",
                      code: "",
                    });
                  }}
                >
                  Cancel
                </Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </div>
      </div>
      <RModal open={payModel} size="md" title={"Pay Doctor Commission"}>
        <PayModel
          uuid={account?.data[0]?.uuid as string}
          setPayModel={setPayModel}
        />
      </RModal>
    </>
  );
};

export default NewDoctor;
