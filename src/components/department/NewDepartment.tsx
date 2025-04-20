"use client";

import {
  usePatchDepartmentMutation,
  usePostDepartmentMutation,
} from "@/redux/api/department/departmentSlice";
import { IDepartment } from "@/types/allDepartmentInterfaces";
import { NewFormType } from "@/types/componentsType";
import React, { useState } from "react";
import { Button, Form, Message, Schema, toaster, Toggle } from "rsuite";
import swal from "sweetalert";

const NewDepartmentTable = ({
  open,
  setPostModelOpen,
  defaultData,
  setMode,
  mode,
}: NewFormType<IDepartment>) => {
  const { StringType } = Schema.Types;
  const formRef: React.MutableRefObject<any> = React.useRef();
  const model = Schema.Model({
    label: StringType().isRequired("This field is required."),
    // description: StringType().isRequired("This field is required."),
    // fixedCommission: NumberType().isRequired("This field is required."),
    // commissionParcentage: NumberType().isRequired("This field is required."),
  });

  const model1 = Schema.Model({
    roomName: StringType().isRequired("This field is required."),
    roomNo: StringType().isRequired("This field is required."),
  });
  const [departmentData, setDepartmentData] =
    useState<IDepartment>(defaultData);
  const [postDepartment] = usePostDepartmentMutation();
  const [patchDepartment] = usePatchDepartmentMutation();

  const handleSubmit = async () => {
    if (formRef.current.check()) {
      departmentData.value = departmentData.label.toLowerCase();
      if (mode == "new") {
        departmentData.fixedCommission = Number(departmentData.fixedCommission);
        departmentData.commissionParcentage = Number(
          departmentData.commissionParcentage
        );
        const result = await postDepartment(departmentData);
        if ("data" in result) {
          const message = (result as { data: { message: string } })?.data
            .message;
          swal(`Done! ${message}!`, {
            icon: "success",
          });
          setPostModelOpen(false);
        }
      } else {
        const result = await patchDepartment({
          data: departmentData,
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
    } else {
      toaster.push(<Message type="error">Fill out all the fields</Message>);
    }
  };
  const [fixedCommissionEnabled, setFixedCommissionEnabled] = useState(false);

  return (
    <>
      <Form
        formDefaultValue={defaultData}
        onChange={(formValue, event) => {
          setDepartmentData({
            label: formValue.label,
            description: formValue.description,
            value: formValue.value,
            commissionParcentage: Number(formValue.commissionParcentage),
            fixedCommission: Number(formValue.fixedCommission),
            isCommissionFiexed: fixedCommissionEnabled,
            isRoomInfo: formValue?.isRoomInfo,
            roomName: formValue?.roomName,
            roomNo: formValue?.roomNo,
          });

          // Additional logic if needed
        }}
        ref={formRef}
        model={
          departmentData?.isRoomInfo
            ? Schema.Model.combine(model, model1)
            : model
        }
      >
        <Form.Group controlId="label">
          <Form.ControlLabel>Department Name</Form.ControlLabel>
          <Form.Control name="label" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>
            <Toggle
              checked={fixedCommissionEnabled}
              onChange={(value: boolean) => setFixedCommissionEnabled(value)}
            />
            Enable Fixed Commission
          </Form.ControlLabel>
        </Form.Group>
        <Form.Group controlId="commissionParcentage">
          <Form.ControlLabel>Commission Percentage</Form.ControlLabel>
          <Form.Control
            name="commissionParcentage"
            disabled={fixedCommissionEnabled}
            type="number"
          />
        </Form.Group>
        <Form.Group controlId="fixedCommission">
          <Form.ControlLabel>Fixed Commission</Form.ControlLabel>
          <Form.Control
            name="fixedCommission"
            disabled={!fixedCommissionEnabled}
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.ControlLabel>Description</Form.ControlLabel>
          <Form.Control name="description" />
        </Form.Group>
        <Form.Group controlId="isRoomInfo">
          <Form.ControlLabel>Room Info</Form.ControlLabel>
          <Form.Control name="isRoomInfo" accepter={Toggle}></Form.Control>
        </Form.Group>
        {departmentData?.isRoomInfo && (
          <>
            <Form.Group controlId="roomName">
              <Form.ControlLabel>Room Name</Form.ControlLabel>
              <Form.Control name="roomName"></Form.Control>
            </Form.Group>
            <Form.Group controlId="roomNo">
              <Form.ControlLabel>Room No.</Form.ControlLabel>
              <Form.Control name="roomNo"></Form.Control>
            </Form.Group>
          </>
        )}
        <Button
          onClick={() => {
            setMode("new");
            setPostModelOpen(!open);
            setDepartmentData({
              label: "",
              description: "",
              value: "",
              commissionParcentage: 0,
              fixedCommission: 0,
              isCommissionFiexed: false,
              isRoomInfo: false,
            });
          }}
          appearance="subtle"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} appearance="primary" className="ml-5">
          OK
        </Button>
      </Form>
    </>
  );
};

export default NewDepartmentTable;
