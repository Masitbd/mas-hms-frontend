"use client";

import { useGetDepartmentQuery } from "@/redux/api/department/departmentSlice";
import { useAppSelector } from "@/redux/hook";
import {
  ICondition,
  IDepartment,
  IReportGroup,
} from "@/types/allDepartmentInterfaces";
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
const ReportGroupPatchModal = ({
  open,
  patchReportGroup,
  cancelHandler,
  defalutValue,
}: {
  open: boolean;
  patchReportGroup: ({
    data: { label, description, value },
    id,
  }: {
    data: IReportGroup;
    id: string;
  }) => void;
  cancelHandler: () => void;
  defalutValue: IReportGroup;
}) => {
  const { StringType } = Schema.Types;
  const formRef: React.MutableRefObject<any> = React.useRef();
  const model = Schema.Model({
    label: StringType().isRequired("This field is required."),
    description: StringType().isRequired("This field is required."),
    department: StringType().isRequired("This field is required."),
  });

  const [reportGroupData, setReportGroupData] = useState<{
    label: string;
    description: string;
    value: string;
    department: string;
  }>(defalutValue);
  const handleSubmit = () => {
    if (formRef.current.check()) {
      reportGroupData.value = reportGroupData.label.toLowerCase();
      patchReportGroup({
        data: reportGroupData,
        id: defalutValue._id as string,
      });
    } else {
    }
  };
  const loading = useAppSelector((state) => state.loading.loading);
  const { data: departmentData, isLoading: departmentDataLoading } =
    useGetDepartmentQuery(undefined);

  return (
    <>
      <Modal size={"xs"} open={open}>
        <Modal.Header>
          <Modal.Title>Update Report Group</Modal.Title>
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
            formDefaultValue={defalutValue}
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
          <Button onClick={handleSubmit} appearance="primary">
            {loading ? <Loader></Loader> : "OK"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReportGroupPatchModal;
