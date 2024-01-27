import React, { useState } from "react";
import { Form, InputPicker, TagPicker } from "rsuite";

const ForMicroBiology = () => {
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
  return (
    <div>
      <Form onChange={setResultFieldvalue}>
        <Form.Group controlId="sensitivityOption">
          <Form.ControlLabel>Title</Form.ControlLabel>
          <Form.Control
            name="sensitivityOption"
            accepter={TagPicker}
            data={dSensitivityOption}
          />
        </Form.Group>
        <Form.Group controlId="condition">
          <Form.ControlLabel>Condition</Form.ControlLabel>
          <Form.Control
            name="condition"
            accepter={TagPicker}
            data={dConditionOption}
          />
        </Form.Group>
        <Form.Group controlId="bacteria">
          <Form.ControlLabel>Bacteria</Form.ControlLabel>
          <Form.Control
            name="bacteria"
            accepter={TagPicker}
            data={dBacteriaOption}
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default ForMicroBiology;
