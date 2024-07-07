import React, { useRef, useEffect, ReactNode, Component } from "react";
import { Cell } from "rsuite-table";
import { ENUM_MODE } from "@/enum/Mode";
import { Input, Tag } from "rsuite";
import { isArray } from "util";

// eslint-disable-next-line react/display-name
const EditableCell = React.memo(
  ({
    rowData,
    dataKey,
    onChange,
    rowIndex,
    as,
    value,
    ...props
  }: {
    rowData?: any;
    dataKey: string;
    onChange: (SL: number, key: string, value: string) => void;
    as?: any;
    value?: any;
    rowIndex?: number;
  }) => {
    const editing =
      rowData.status === ENUM_MODE.EDIT || rowData.status === ENUM_MODE.NEW;

    const isArray = Array.isArray(rowData[dataKey]);

    return (
      <Cell {...props} className={editing ? "table-content-editing" : ""}>
        {editing ? (
          <Input
            defaultValue={rowData[dataKey]}
            onChange={(event, eventKey) => {
              if (as) {
                onChange &&
                  onChange(
                    rowIndex as number,
                    dataKey,
                    eventKey as unknown as string
                  );
              } else {
                onChange && onChange(rowIndex as number, dataKey, event);
              }
            }}
            as={as}
            value={value}
            data={value}
          />
        ) : isArray ? (
          <>
            {rowData[dataKey]?.length > 0 ? (
              <>
                {rowData[dataKey].map((data: string, index: number) => (
                  <Tag key={index}>{data}</Tag>
                ))}
              </>
            ) : (
              ""
            )}
          </>
        ) : (
          <span className="table-content-edit-span">{rowData[dataKey]}</span>
        )}
      </Cell>
    );
  }
);

export default EditableCell;
