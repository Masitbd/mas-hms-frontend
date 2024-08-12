import React, { useEffect, useState } from "react";
import {
  Button,
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

  const handleMargin = (index: number, data: number) => {
    const inch = (Number(data) * 72).toFixed(2);
    const margindata = [...margin];
    margindata[index] = Number(inch);
    setMargins(margindata);
    localStorage.setItem(marginTitle, JSON.stringify(margindata));
  };

  useEffect(() => {
    const storedMargin = JSON.parse(
      localStorage.getItem(marginTitle) as string
    );
    if (storedMargin) {
      setMargins(storedMargin);
    }
  }, []);

  return (
    <div className="my-5  grid grid-cols-4 gap-4 px-10">
      <div>
        Margin Top
        <Input
          onChange={(value) => handleMargin(0, Number(value))}
          defaultValue={margin[0]}
          type="number"
        />
      </div>
      <div>
        Margin Left
        <Input
          onChange={(value) => handleMargin(1, Number(value))}
          defaultValue={margin[1]}
          type="number"
        />
      </div>
      <div>
        Margin Bottom
        <Input
          onChange={(value) => handleMargin(2, Number(value))}
          defaultValue={margin[2]}
          type="number"
        />
      </div>
      <div>
        Margin Right
        <Input
          onChange={(value) => handleMargin(3, Number(value))}
          defaultValue={margin[3]}
          type="number"
        />
      </div>
    </div>
  );
};

export default Margin;
