import React, { useRef, useEffect, ReactNode, Component } from "react";
import { Cell } from "rsuite-table";
import { ENUM_MODE } from "@/enum/Mode";
import { Input } from "rsuite";

// eslint-disable-next-line react/display-name
const EditableCell = React.memo(
  ({
    rowData,
    dataKey,
    onChange,
    as,
    value,
    ...props
  }: {
    rowData?: any;
    dataKey: string;
    onChange: (SL: number, key: string, value: string) => void;
    as?: any;
    value?: any;
  }) => {
    const editing =
      rowData.status === ENUM_MODE.EDIT || rowData.status === ENUM_MODE.NEW;

    return (
      <Cell {...props} className={editing ? "table-content-editing" : ""}>
        {editing ? (
          <Input
            defaultValue={rowData[dataKey]}
            onChange={(event) => {
              onChange && onChange(rowData.SL, dataKey, event);
            }}
            as={as}
            value={value}
          />
        ) : (
          <span className="table-content-edit-span">{rowData[dataKey]}</span>
        )}
      </Cell>
    );
  }
);

export default EditableCell;
