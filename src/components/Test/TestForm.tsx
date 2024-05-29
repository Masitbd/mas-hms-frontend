import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  InputPicker,
  Message,
  Schema,
  Table,
  TagPicker,
  Toggle,
  toaster,
} from "rsuite";
import ToggleButton from "rsuite/esm/Picker/ToggleButton";
import ForParameterBased from "./ForParameterBased";
import ForDescriptiveBased from "./TestForDescriptive";
import ForMicroBiology from "./ForMicroBiology";
import ForGroupTest from "./ForGroupTest";
import { useGetSpecimenQuery } from "@/redux/api/specimen/specimenSlice";
import { useGetHospitalGroupQuery } from "@/redux/api/hospitalGroup/hospitalGroupSlice";
import { useGetVacuumTubeQuery } from "@/redux/api/vacuumTube/vacuumTubeSlice";
import { useGetDepartmentQuery } from "@/redux/api/department/departmentSlice";
import {
  IDepartment,
  IHospitalGroup,
  ISpecimen,
  IVacuumTube,
} from "@/types/allDepartmentInterfaces";

const TestForm = ({
  defaultValue,
  forwardedRef,
  formData,
  setfromData,
  mode,
  model,
}: {
  defaultValue?: any;
  forwardedRef: any;
  formData: any;
  setfromData: (data: any) => void;
  mode: string;
  model: any;
}) => {
  const { StringType, NumberType, ArrayType } = Schema.Types;
  const { data: departmentData } = useGetDepartmentQuery(undefined);
  const { data: specimenData } = useGetSpecimenQuery(undefined);
  const { data: vaccumeTubeData } = useGetVacuumTubeQuery(undefined);
  const { data: hospitalGroupData } = useGetHospitalGroupQuery(undefined);
  const testType = [
    {
      label: "Signle",
      value: "single",
    },
    {
      label: "Group",
      value: "group",
    },
  ];
  const dDataForReportGroup = [
    {
      label: "SOme Group with _id",
      value: "65b54df9f84e13eee7ceb547",
    },
    {
      label: "SOme Group",
      value: "Some valeeeue",
    },
    {
      label: "SOme Group",
      value: "Some vaeeeelue",
    },
    {
      label: "SOme Group",
      value: "Some vwwwalue",
    },
  ];
  const testResultType = [
    {
      label: "Parameter Based",
      value: "parameter",
    },
    {
      label: "Descriptive",
      value: "descriptive",
    },
    {
      label: "Bacterial",
      value: "bacterial",
    },
    {
      label: "Group",
      value: "group",
    },
  ];
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
        formValue={defaultValue}
        readOnly={mode === "watch"}
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
            data={dDataForReportGroup}
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
              ></ForMicroBiology>
            ) : (
              ""
            )}
            {formData?.type === "group" ? (
              <ForGroupTest fromData={formData} setFormData={setfromData} />
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
