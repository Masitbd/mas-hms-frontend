import { IBacteria } from "@/app/(withlayout)/bacteria/page";
import { useGetBacteriaQuery } from "@/redux/api/bacteria/bacteriaSlice";
import { useGetConditionQuery } from "@/redux/api/condition/conditionSlice";
import { useGetSensitivityQuery } from "@/redux/api/sensitivity/sensitivitySlict";
import { ICondition, ISensitivity } from "@/types/allDepartmentInterfaces";
import React, { useState } from "react";
import { Form, InputPicker, TagPicker } from "rsuite";

const ForMicroBiology = ({
  testFromData,
  setTestFromData,
  mode,
}: {
  testFromData: any;
  setTestFromData: (data: any) => void;
  mode: string;
}) => {
  const { data: sensitivityData } = useGetSensitivityQuery(undefined);
  const { data: conditionData } = useGetConditionQuery(undefined);
  const { data: bacteriaData } = useGetBacteriaQuery(undefined);
  const [resultFieldvalue, setResultFieldvalue] = useState(
    mode === "patch" || mode == "watch"
      ? testFromData?.resultFields[0]
      : {
          sensitivityOptions: [],
          conditions: [],
          bacterias: [],
        }
  );
  return (
    <div>
      <Form
        onChange={(data) => {
          setResultFieldvalue(data);
          testFromData.resultFields = [resultFieldvalue];
          setTestFromData(testFromData);
        }}
        fluid
        className="grid grid-cols-1 gap"
        formValue={resultFieldvalue}
      >
        <Form.Group controlId="sensitivityOptions">
          <Form.ControlLabel>Sensitivity Option</Form.ControlLabel>
          <Form.Control
            name="sensitivityOptions"
            accepter={TagPicker}
            data={sensitivityData?.data.map((data: ISensitivity) => ({
              label: data.label,
              value: data._id,
            }))}
            className="w-full py-5"
            size={"lg"}
          />
        </Form.Group>
        <div className="grid grid-cols-2 gap-5">
          <Form.Group controlId="conditions">
            <Form.ControlLabel>Condition</Form.ControlLabel>
            <Form.Control
              name="conditions"
              accepter={TagPicker}
              data={conditionData?.data.map((data: ICondition) => ({
                label: data.label,
                value: data._id,
              }))}
              className="w-full"
              size={"lg"}
            />
          </Form.Group>
          <Form.Group controlId="bacterias">
            <Form.ControlLabel>Bacteria</Form.ControlLabel>
            <Form.Control
              name="bacterias"
              accepter={TagPicker}
              data={bacteriaData?.data.map((data: IBacteria) => ({
                label: data.label,
                value: data._id,
              }))}
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
