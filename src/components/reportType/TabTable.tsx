import React, { useState } from "react";
import { Button, Table, TagInput } from "rsuite";
import EditableCell from "./EditableCell";
const TabTable = ({
  testResultType,
  handleChange,
}: {
  testResultType: string;
  handleChange: (SL: number, key: string, value: string) => void;
}) => {
  const { Cell, Column, HeaderCell } = Table;
  console.log(testResultType);

  const ForParameterBased = (
    <>
      <Column flexGrow={1}>
        <HeaderCell>Investigation</HeaderCell>
        <EditableCell dataKey={"investigation"} onChange={handleChange} />
      </Column>
      <Column flexGrow={2}>
        <HeaderCell>Test</HeaderCell>
        <EditableCell dataKey={"test"} onChange={handleChange} />
      </Column>
      <Column flexGrow={1}>
        <HeaderCell>Normal Value</HeaderCell>
        <EditableCell dataKey={"normalValue"} onChange={handleChange} />
      </Column>
      <Column flexGrow={1}>
        <HeaderCell>Unit</HeaderCell>
        <EditableCell dataKey={"unit"} onChange={handleChange} />
      </Column>
      <Column flexGrow={1}>
        <HeaderCell>Remark</HeaderCell>
        <EditableCell dataKey={"remark"} onChange={handleChange} />
      </Column>
      <Column flexGrow={1}>
        <HeaderCell>Default Values</HeaderCell>
        <EditableCell
          dataKey={"defaultValue"}
          onChange={handleChange}
          as={TagInput}
        />
      </Column>
    </>
  );

  const ForDescriptive = (
    <>
      <Column flexGrow={1}>
        <HeaderCell>Title</HeaderCell>
        <EditableCell dataKey={"lable"} onChange={handleChange} />
      </Column>
      <Column flexGrow={1}>
        <HeaderCell>Description</HeaderCell>
        <EditableCell dataKey={"description"} onChange={handleChange} />
      </Column>
    </>
  );

  switch (testResultType) {
    case "parameter":
      return ForParameterBased;
    case "descriptive":
      return ForDescriptive;

    default:
      return "";
  }
};

export default TabTable;
