import React, { useState } from "react";
import { Button, Form, InputPicker, Table, TagPicker, Toggle } from "rsuite";
import ToggleButton from "rsuite/esm/Picker/ToggleButton";
import ForParameterBased from "./ForParameterBased";
import ForDescriptiveBased from "./TestForDescriptive";
import ForMicroBiology from "./ForMicroBiology";
import ForGroupTest from "./ForGroupTest";

const TestForm = ({
  defaultValue,
  forwardedRef,
  formData,
  setfromData,
}: {
  defaultValue?: any;
  forwardedRef: any;
  formData: any;
  setfromData: (data: any) => void;
}) => {
  // Dummy value for input picker
  const dDataForInputPicker = [
    {
      label: "Radiology",
      value: "65b55642f84e13eee7ceb54b",
    },
    {
      label: "microbiology",
      value: "microbiology",
    },

    {
      label: "Parameter",
      value: "65aac4f7c406d9452cc4ee1f",
    },

    {
      label: "Gino",
      value: "some",
    },
  ];
  const dDataForSpecimen = [
    {
      label: "BLood with id",
      value: "659e264ea03cbc0b47594a58",
    },
    {
      label: "BLood",
      value: "bloeod",
    },

    {
      label: "BLood",
      value: "bqlood",
    },
  ];

  const testCode = "1100de";
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
  const dDataForTestTube = [
    {
      label: "Red with id",
      value: "65b54da3f84e13eee7ceb545",
    },
    {
      label: "Red",
      value: "refd",
    },
    {
      label: "Red",
      value: "reed",
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
  const dDataForHospitalGroup = [
    {
      label: "SOme Group with id",
      value: "65b54df9f84e13eee7ceb547",
    },
    {
      label: "SOme Group",
      value: "Some valeeeue",
    },
    {
      label: "SOme Group",
      value: "Some vaeeefelue",
    },
    {
      label: "SOme Group",
      value: "Some vwwwaslue",
    },
  ];

  const initialData = {
    title: "",
    department: "",
    testCode: "",
    specimen: "",
    testType: "",
    hasTestTube: "",
    testTube: [],
    reportGroup: "",
    hospitalGroup: "",
    price: 0,
    vatRate: 0,
    processTime: 0,
    resultFields: [],
  };
  //   Form handler
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
        // model={model}
        className="grid grid-cols-3 gap-5 justify-center w-full"
        fluid
        formDefaultValue={defaultValue}
      >
        <Form.Group controlId="label">
          <Form.ControlLabel>Title</Form.ControlLabel>
          <Form.Control name="label" htmlSize={100} />
        </Form.Group>
        <Form.Group controlId="price">
          <Form.ControlLabel>Price</Form.ControlLabel>
          <Form.Control name="price" type="number" />
        </Form.Group>

        <Form.Group controlId="testCode">
          <Form.ControlLabel>Test Code</Form.ControlLabel>
          <Form.Control name="testCode" defaultValue={testCode} disabled />
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
            data={dDataForSpecimen}
          />
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
        <Form.Group controlId="hasTestTube">
          <Form.ControlLabel>Include Test Tube</Form.ControlLabel>
          <Form.Control
            name="hasTestTube"
            accepter={Toggle}
            // value={!formData.hasTestTube}
          />
        </Form.Group>
        <Form.Group controlId="testTube">
          <Form.ControlLabel>Test Tube</Form.ControlLabel>
          <Form.Control
            className="w-full"
            name="testTube"
            accepter={TagPicker}
            data={dDataForTestTube}
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
            data={dDataForHospitalGroup}
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
            {formData?.type == "single" &&
            formData.department == "65aac4f7c406d9452cc4ee1f" ? (
              <ForParameterBased
                testFromData={formData}
                setTestFromData={setfromData}
              />
            ) : (
              ""
            )}{" "}
            {formData?.type == "single" &&
            formData.department == "65b55642f84e13eee7ceb54b" ? (
              <ForDescriptiveBased
                testFromData={formData}
                setTestFromData={setfromData}
              />
            ) : (
              ""
            )}
            {formData?.type == "single" &&
            formData.department == "microbiology" ? (
              <ForMicroBiology
                testFromData={formData}
                setTestFromData={setfromData}
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
