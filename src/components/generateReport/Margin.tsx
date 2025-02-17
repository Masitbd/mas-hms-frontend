import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputGroup,
  InputPicker,
  Modal,
  SelectPicker,
  Table,
} from "rsuite";
import { IPropsForMargin } from "./initialDataAndTypes";
const Margin = (props: IPropsForMargin) => {
  const { margin, marginTitle, setMargins } = props;
  const [doesChanged, setDoesChanged] = useState(false);
  const [mData, setMData] = useState<Record<string, number>>({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });
  const pixelTOInch = (data: any) => {
    return (Number(data) * 72).toFixed(2);
  };
  const inchToPixels = (data: any) => {
    return Number((Number(data) / 72).toFixed(2) ?? 0);
  };
  useEffect(() => {
    const storedMargin = JSON.parse(
      localStorage.getItem(marginTitle) as string
    );
    if (storedMargin) {
      setMargins(storedMargin);
      setMData({
        top: inchToPixels(storedMargin[0]),
        left: inchToPixels(storedMargin[1]),
        bottom: inchToPixels(storedMargin[2]),
        right: inchToPixels(storedMargin[3]),
      });
    }
    setDoesChanged(true);
  }, [marginTitle, setMargins]);
  useEffect(() => {
    if (!doesChanged) {
      return;
    }
    const marginCopiedData = [
      Number(pixelTOInch(mData["top"])),
      Number(pixelTOInch(mData["left"])),
      Number(pixelTOInch(mData["bottom"])),
      Number(pixelTOInch(mData["right"])),
    ];
    localStorage.setItem(marginTitle, JSON.stringify(marginCopiedData));

    setMargins(marginCopiedData);
  }, [mData]);

  return (
    <>
      <Form
        className="my-5  grid grid-cols-4 gap-2 px-4"
        formValue={mData}
        onChange={setMData}
        fluid
      >
        <Form.Group>
          <Form.ControlLabel>Margin Top</Form.ControlLabel>
          <Form.Control name="top" type="number" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Margin Left</Form.ControlLabel>
          <Form.Control name="left" type="number" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Margin Bottom</Form.ControlLabel>
          <Form.Control name="bottom" type="number" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Margin Right</Form.ControlLabel>
          <Form.Control name="right" type="number" />
        </Form.Group>
      </Form>
    </>
  );
};

export default Margin;
