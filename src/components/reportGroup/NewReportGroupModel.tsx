"use client";
import { useGetDepartmentQuery } from "@/redux/api/department/departmentSlice";
import { useAppSelector } from "@/redux/hook";
import { IDepartment } from "@/types/allDepartmentInterfaces";
import React, { useState } from "react";
import {
  Button,
  Modal,
  Schema,
  Form,
  Loader,
  Input,
  SelectPicker,
} from "rsuite";
const NewReportGroupModal = ({
  open,
  postReportGroup,
  cancelHandler,
}: {
  open: boolean;
  postReportGroup: ({
    label,
    description,
    value,
    department,
  }: {
    value: string;
    label: string;
    description: string;
    department: string;
  }) => void;
  cancelHandler: () => void;
}) => {
  const { StringType, NumberType } = Schema.Types;
  const formRef: React.MutableRefObject<any> = React.useRef();
  const model = Schema.Model({
    label: StringType().isRequired("This field is required."),
    description: StringType().isRequired("This field is required."),
    department: StringType().isRequired("This field is required."),
  });

  const [reportGroupoData, setReportGroupData] = useState<{
    label: string;
    description: string;
    value: string;
    department: string;
  }>({
    label: "",
    description: "",
    value: "",
    department: "",
  });
  const handleSubmit = () => {
    if (formRef.current.check()) {
      reportGroupoData.value = reportGroupoData.label.toLowerCase();
      postReportGroup(reportGroupoData);
    } else {
    }
  };
  const loading = useAppSelector((state) => state.loading.loading);

  //   department data
  const { data: departmentData, isLoading: departmentDataLoading } =
    useGetDepartmentQuery(undefined);

  return (
    <>
      <Modal size={"xs"} open={open}>
        <Modal.Header>
          <Modal.Title>Add New Report Group</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-5">
          <Form
            onChange={(formValue, event) => {
              setReportGroupData({
                label: formValue.label || "",
                description: formValue.description || "",
                value: formValue.value || "",
                department: formValue.department || "",
              });

              // Additional logic if needed
            }}
            ref={formRef}
            model={model}
            className="w-full"
            fluid
          >
            <Form.Group controlId="label">
              <Form.ControlLabel>Title</Form.ControlLabel>
              <Form.Control name="label" />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.ControlLabel>Description</Form.ControlLabel>
              <Form.Control name="description" />
            </Form.Group>
            <Form.Group controlId="department">
              <Form.ControlLabel>Department</Form.ControlLabel>
              <Form.Control
                name="department"
                accepter={SelectPicker}
                data={departmentData?.data.map((data: IDepartment) => {
                  return { label: data.label, value: data._id };
                })}
                loading={departmentDataLoading}
                searchable={false}
                block
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={cancelHandler} appearance="subtle">
            Cancel
          </Button>
          <Button onClick={handleSubmit} appearance="primary" loading={loading}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NewReportGroupModal;
