import {
  IReportGroupFormData,
  IReportGroupFormParam,
  testResultType,
} from "@/components/reportGroup/initialDataAndTypes";
import { useGetDepartmentQuery } from "@/redux/api/department/departmentSlice";
import { IDepartment } from "@/types/allDepartmentInterfaces";
import React from "react";
import { Form, InputPicker } from "rsuite";

const ReportGroupForm = (props: IReportGroupFormParam) => {
  const { formData, hanlderFunction, mode } = props;
  const { data: departmentData, isLoading: departmentDataLoading } =
    useGetDepartmentQuery(undefined);

  return (
    <div>
      <Form
        className="grid grid-cols-3 gap-5 w-full"
        fluid
        onChange={hanlderFunction}
      >
        <Form.Group controlId="label">
          <Form.ControlLabel>Title</Form.ControlLabel>
          <Form.Control name="label" />
        </Form.Group>
        <Form.Group controlId="department">
          <Form.ControlLabel>Department</Form.ControlLabel>
          <Form.Control
            name="department"
            accepter={InputPicker}
            data={departmentData?.data.map((department: IDepartment) => {
              return {
                label: department.label,
                value: department._id,
              };
            })}
            loading={departmentDataLoading}
          />
        </Form.Group>
        <Form.Group controlId="resultType">
          <Form.ControlLabel>Result Type</Form.ControlLabel>
          <Form.Control
            name="resultType"
            accepter={InputPicker}
            data={testResultType}
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default ReportGroupForm;
