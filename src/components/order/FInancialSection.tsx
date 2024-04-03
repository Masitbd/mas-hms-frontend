import React, { useState } from "react";
import { Input, InputGroup, Message, toaster } from "rsuite";
import CheckIcon from "@rsuite/icons/Check";

const FInancialSection = ({
  setData,
  dueAmount,
  data,
}: {
  setData(arg0: any): void;
  dueAmount: string;
  data: any;
}) => {
  return (
    <div className="grid grid-cols-4 mt-5 gap-16">
      {/* For financial seciton */}
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
          <InputGroup.Addon>0.</InputGroup.Addon>
          <Input
            type="number"
            placeholder="Cash Discount"
            name="cashDiscount"
            value={data.cashDiscount}
            onChange={(value, event) => {
              const dueValue = parseFloat(dueAmount).toString();

              if (
                (value.includes(".") || Number(value) === 0) &&
                Number("." + dueValue.split(".")[1]) >= Number(value)
              ) {
                setData((prevData: any) => ({
                  ...prevData,
                  cashDiscount: Number(value),
                }));
              } else {
                toaster.push(
                  <Message type="error">
                    Cash Discount cannot be more then decimal point{" "}
                    {dueAmount.split(".")}
                  </Message>
                );
              }
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
