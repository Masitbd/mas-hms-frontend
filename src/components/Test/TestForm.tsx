import { useGetDepartmentQuery } from "@/redux/api/department/departmentSlice";
import { useGetHospitalGroupQuery } from "@/redux/api/hospitalGroup/hospitalGroupSlice";
import { useGetReportGroupQuery } from "@/redux/api/reportGroup/reportGroupSlice";
import { useGetSpecimenQuery } from "@/redux/api/specimen/specimenSlice";
import { useGetVacuumTubeQuery } from "@/redux/api/vacuumTube/vacuumTubeSlice";
import {
  IDepartment,
  IHospitalGroup,
  ISpecimen,
  IVacuumTube,
} from "@/types/allDepartmentInterfaces";
import { Form, InputPicker, Schema, TagPicker, Toggle } from "rsuite";
import ForGroupTest from "./ForGroupTest";
import ForMicroBiology from "./ForMicroBiology";
import ForParameterBased from "./ForParameterBased";
import ForDescriptiveBased from "./TestForDescriptive";
import { ITestFormProps, testType } from "./initialDataAndTypes";
import { testResultType } from "../reportType/initialDataAndTypes";
import { ENUM_MODE } from "@/enum/Mode";

const TestForm = (props: ITestFormProps) => {
  const { defaultValue, forwardedRef, formData, setfromData, mode, model } =
    props;
  const { data: departmentData } = useGetDepartmentQuery(undefined);
  const { data: specimenData } = useGetSpecimenQuery(undefined);
  const { data: vaccumeTubeData } = useGetVacuumTubeQuery(undefined);
  const { data: reportGroupData } = useGetReportGroupQuery(undefined);
  const { data: hospitalGroupData } = useGetHospitalGroupQuery(undefined);
  return (
    <div className=" px-5 ">
      <div className="my-5">
        <h1 className="font-bold text-2xl">General Information</h1>
        <hr></hr>
      </div>
      <div></div>
      <Form
        onChange={setfromData}
        ref={forwardedRef}
        model={model}
        className="grid grid-cols-3 gap-5 justify-center w-full"
        fluid
        formValue={formData}
        readOnly={mode === ENUM_MODE.VIEW}
      >
        <Form.Group controlId="label">
          <Form.ControlLabel>Title</Form.ControlLabel>
          <Form.Control name="label" htmlSize={100} />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.ControlLabel>Description</Form.ControlLabel>
          <Form.Control name="description" htmlSize={100} />
        </Form.Group>
        <Form.Group controlId="type">
          <Form.ControlLabel>Test Type</Form.ControlLabel>
          <Form.Control
            name="type"
            accepter={InputPicker}
            data={testType}
            className="w-full"
          />
        </Form.Group>
        <Form.Group controlId="testResultType">
          <Form.ControlLabel>Test ResultType</Form.ControlLabel>
          <Form.Control
            name="testResultType"
            accepter={InputPicker}
            data={testResultType}
            className="w-full"
          />
        </Form.Group>
        <Form.Group controlId="department">
          <Form.ControlLabel>Department</Form.ControlLabel>
          <Form.Control
            name="department"
            accepter={InputPicker}
            data={departmentData?.data.map((data: IDepartment) => ({
              label: data.label,
              value: data._id,
            }))}
            className="w-full"
          />
        </Form.Group>
        <Form.Group controlId="price">
          <Form.ControlLabel>Price</Form.ControlLabel>
          <Form.Control name="price" type="number" />
        </Form.Group>

        <Form.Group controlId="vatRate">
          <Form.ControlLabel>Vat Rate</Form.ControlLabel>
          <Form.Control name="vatRate" type="number" />
        </Form.Group>
        <Form.Group controlId="processTime">
          <Form.ControlLabel>Process Time</Form.ControlLabel>
          <Form.Control name="processTime" type="number" />
        </Form.Group>
        {/*  */}
        <Form.Group controlId="specimen">
          <Form.ControlLabel>Specimen</Form.ControlLabel>
          <Form.Control
            className="w-full"
            name="specimen"
            accepter={TagPicker}
            data={specimenData?.data.map((data: ISpecimen) => ({
              label: data.label,
              value: data._id,
            }))}
          />
        </Form.Group>

        <Form.Group controlId="hasTestTube">
          <Form.ControlLabel>Include Test Tube</Form.ControlLabel>
          <Form.Control name="hasTestTube" accepter={Toggle} />
        </Form.Group>
        <Form.Group controlId="testTube">
          <Form.ControlLabel>Test Tube</Form.ControlLabel>
          <Form.Control
            className="w-full"
            name="testTube"
            accepter={TagPicker}
            data={vaccumeTubeData?.data.map((data: IVacuumTube) => ({
              label: data.label,
              value: data._id,
            }))}
            disabled={!formData?.hasTestTube}
          />
        </Form.Group>
        <Form.Group controlId="reportGroup">
          <Form.ControlLabel>Report Group</Form.ControlLabel>
          <Form.Control
            className="w-full"
            name="reportGroup"
            accepter={InputPicker}
            data={reportGroupData?.data.map((data: any) => ({
              label: data.label,
              value: data._id,
            }))}
          />
        </Form.Group>
        <Form.Group controlId="hospitalGroup">
          <Form.ControlLabel>Hospital Group</Form.ControlLabel>
          <Form.Control
            className="w-full"
            name="hospitalGroup"
            accepter={InputPicker}
            data={hospitalGroupData?.data.map((data: IHospitalGroup) => ({
              label: data.label,
              value: data._id,
            }))}
          />
        </Form.Group>
      </Form>
      {/* Result Fields */}

      <div>
        <div>
          <div className="my-5">
            <h1 className="font-bold text-2xl">Test Result Information</h1>
            <hr></hr>
          </div>
          <div>
            {(formData?.type == "single" &&
              formData.testResultType == "parameter") ||
            (defaultValue?.type == "single" &&
              defaultValue.testResultType == "parameter") ? (
              <ForParameterBased
                defaultMode={mode}
                testFromData={formData}
                setTestFromData={setfromData}
              />
            ) : (
              ""
            )}{" "}
            {formData?.type == "single" &&
            formData.testResultType == "descriptive" ? (
              <ForDescriptiveBased
                testFromData={formData}
                setTestFromData={setfromData}
              />
            ) : (
              ""
            )}
            {formData?.type == "single" &&
            formData.testResultType == "bacterial" ? (
              <ForMicroBiology
                testFromData={formData}
                setTestFromData={setfromData}
                mode={mode}
              />
            ) : (
              ""
            )}
            {formData?.type === "group" ? (
              <ForGroupTest
                fromData={formData}
                setFormData={setfromData}
                mode={mode}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestForm;
