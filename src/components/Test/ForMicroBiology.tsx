import React, { useState } from "react";
import { Form, InputPicker, TagPicker } from "rsuite";

const ForMicroBiology = ({
  testFromData,
  setTestFromData,
}: {
  testFromData: any;
  setTestFromData: (data: any) => void;
}) => {
  const dSensitivityOption = [
    {
      label: "SOeeme",
      value: "Nofeeting",
    },
    {
      label: "SOmeeeeee",
      value: "Notefeing",
    },
    {
      label: "SOeeme",
      value: "Noteeing",
    },
    {
      label: "SOeeeeme",
      value: "Noeeting",
    },
  ];
  const dConditionOption = [
    {
      label: "SOeeeeme",
      value: "Nofeeeeting",
    },
    {
      label: "SOmeeeeee",
      value: "Noteeefeing",
    },
    {
      label: "SOeeme",
      value: "Noteeeeing",
    },
    {
      label: "SOeeeeme",
      value: "Noeeeeting",
    },
  ];
  const dBacteriaOption = [
    {
      label: "SOeeme",
      value: "Nofeeeting",
    },
    {
      label: "SOmeeeeee",
      value: "Noteofeing",
    },
    {
      label: "SOeeme",
      value: "Noteeking",
    },
    {
      label: "SOeeeeme",
      value: "Noeetivng",
    },
  ];
  const [resultFieldvalue, setResultFieldvalue] = useState();
  const handleChange = (data) => {
    setResultFieldvalue(data);
    testFromData.resultFields = [resultFieldvalue];
  };
  return (
    <div>
      <Form onChange={handleChange} fluid className="grid grid-cols-1 gap">
        <Form.Group controlId="sensitivityOption">
          <Form.ControlLabel>Sensitivity Option</Form.ControlLabel>
          <Form.Control
            name="sensitivityOption"
            accepter={TagPicker}
            data={dSensitivityOption}
            className="w-full py-5"
            size={"lg"}
          />
        </Form.Group>
        <div className="grid grid-cols-2 gap-5">
          <Form.Group controlId="condition">
            <Form.ControlLabel>Condition</Form.ControlLabel>
            <Form.Control
              name="condition"
              accepter={TagPicker}
              data={dConditionOption}
              className="w-full"
              size={"lg"}
            />
          </Form.Group>
          <Form.Group controlId="bacteria">
            <Form.ControlLabel>Bacteria</Form.ControlLabel>
            <Form.Control
              name="bacteria"
              accepter={TagPicker}
              data={dBacteriaOption}
              size={"lg"}
              className="w-full"
            />
          </Form.Group>
        </div>
      </Form>
    </div>
  );
};

export default ForMicroBiology;
