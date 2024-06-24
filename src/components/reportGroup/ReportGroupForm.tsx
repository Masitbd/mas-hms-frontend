import {
  IReportGroupFormParam,
  testResultType
} from "@/components/reportGroup/initialDataAndTypes";
import { useGetDepartmentQuery } from "@/redux/api/department/departmentSlice";
import { useGetReportGroupQuery } from "@/redux/api/reportGroup/reportGroupSlice";
import { IDepartment } from "@/types/allDepartmentInterfaces";
import { Form, InputPicker } from "rsuite";

const ReportGroupForm = (props: IReportGroupFormParam) => {
  const { formData, hanlderFunction, mode, model, forwordedRef } = props;
  const { data: departmentData, isLoading: departmentDataLoading } =
    useGetDepartmentQuery(undefined);
  const { data: reportGroupData, isLoading: reportGroupLoading } =
    useGetReportGroupQuery(undefined);

  return (
    <div>
      <Form
        className="grid grid-cols-4 gap-5 w-full"
        fluid
        onChange={hanlderFunction}
        formValue={formData}
        model={model}
        ref={forwordedRef}
      >
        <Form.Group controlId="group">
          <Form.ControlLabel>Title</Form.ControlLabel>
          <Form.Control name="group" />
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
        <Form.Group controlId="reportGroup">
          <Form.ControlLabel>Report Group</Form.ControlLabel>
          <Form.Control
            name="reportGroup"
            accepter={InputPicker}
            data={reportGroupData?.data.map((department: IDepartment) => {
              return {
                label: department.label,
                value: department._id,
              };
            })}
            loading={reportGroupLoading}
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default ReportGroupForm;
