import React, { useState } from "react";
import { Input, InputGroup, Message, SelectPicker, toaster } from "rsuite";
import CheckIcon from "@rsuite/icons/Check";
import { ENUM_MODE } from "@/enum/Mode";

const FInancialSection = ({
  setData,
  dueAmount,
  data,
  mode,
}: {
  setData(arg0: any): void;
  dueAmount: string;
  data: any;
  mode: string;
}) => {
  const discountOption = [
    { label: "System", value: "system" },
    { label: "Doctor", value: "doctor" },
    { label: "Both", value: "both" },
    { label: "Free Patient", value: "free" },
  ];

  return (
    <div
      className={`grid grid-cols-5 mt-5 gap-16  mb-5 border  shadow-lg px-2 py-2 ${
        mode == ENUM_MODE.VIEW && "hidden"
      } `}
    >
      {/* For financial seciton */}
      <div>
        <h5 className="font-bold">Discount Given By</h5>
        <SelectPicker
          data={discountOption}
          block
          cleanable={false}
          searchable={false}
          onSelect={(value) => {
            console.log(value);
            setData((prevData: any) => ({
              ...prevData,
              discountedBy: value,
            }));
          }}
          defaultValue={data?.discountedBy}
        />
      </div>
      <div>
        <h5 className="font-bold">Vat</h5>
        <InputGroup>
          <Input
            placeholder="Vat"
            name="vat"
            onChange={(value, event) => {
              setData((prevData: any) => ({
                ...prevData,
                vat: Number(value),
              }));
            }}
          />
        </InputGroup>
      </div>
      <div>
        <h5 className="font-bold">Discount Parcent</h5>
        <InputGroup>
          <Input
            name="parcentDiscount"
            onChange={(value, event) =>
              setData((prevData: any) => ({
                ...prevData,
                parcentDiscount: Number(value),
              }))
            }
            placeholder="Parcent Discount"
          />
        </InputGroup>
      </div>
      <div>
        <h5 className="font-bold">Cash Discount</h5>
        <InputGroup>
          <Input
            type="number"
            placeholder="Cash Discount"
            name="cashDiscount"
            onChange={(value, event) => {
              setData((prevData: any) => ({
                ...prevData,
                cashDiscount: Number(value),
              }));
            }}
          />
        </InputGroup>
      </div>
      <div>
        <h5 className="font-bold">Cash Paid</h5>
        <InputGroup>
          <Input
            placeholder="Cash Paid"
            name="cash"
            onChange={(value, event) => {
              setData((prevData: any) => ({
                ...prevData,
                paid: Number(value),
              }));
            }}
          />
        </InputGroup>
      </div>
    </div>
  );
};

export default FInancialSection;
