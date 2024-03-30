import React, { useState } from "react";
import { Input, InputGroup } from "rsuite";
import CheckIcon from "@rsuite/icons/Check";

const FInancialSection = ({ setData }: { setData(arg0: any): void }) => {
  const [amounts, setAmounts] = useState({
    vat: 0,
    cashDisocunt: 0,
    parcentDiscount: 0,
    paid: 0,
  });
  return (
    <div className="grid grid-cols-4 mt-5 gap-16">
      {/* For financial seciton */}
      <div>
        <h5 className="font-bold">Vat</h5>
        <InputGroup>
          <InputGroup.Button
            appearance="subtle"
            onClick={() => {
              setData((prevData: any) => ({
                ...prevData,
                vatParcent: amounts.vat,
              }));
            }}
          >
            <CheckIcon color="white" fill="blue" />
          </InputGroup.Button>
          <Input
            placeholder="Vat"
            name="vat"
            onChange={(value, event) => {
              setAmounts({ ...amounts, vat: Number(value) });
            }}
          />
        </InputGroup>
      </div>
      <div>
        <h5 className="font-bold">Discount Parcent</h5>
        <InputGroup>
          <InputGroup.Button
            onClick={() =>
              setData((prevData: any) => ({
                ...prevData,
                parcentDiscount: amounts.parcentDiscount,
              }))
            }
          >
            <CheckIcon color="white" fill="blue" />
          </InputGroup.Button>
          <Input
            name="parcentDiscount"
            onChange={(value, event) => {
              setAmounts({
                ...amounts,
                parcentDiscount: Number(value),
              });
            }}
            placeholder="Parcent Discount"
          />
        </InputGroup>
      </div>
      <div>
        <h5 className="font-bold">Cash Discount</h5>
        <InputGroup>
          <InputGroup.Button
            onClick={() =>
              setData((prevData: any) => ({
                ...prevData,
                cashDiscount: amounts.cashDisocunt,
              }))
            }
          >
            <CheckIcon color="white" fill="blue" />
          </InputGroup.Button>
          <Input
            placeholder="Cash Discount"
            name="cashDiscount"
            onChange={(value, event) => {
              setAmounts({ ...amounts, cashDisocunt: Number(value) });
            }}
          />
        </InputGroup>
      </div>
      <div>
        <h5 className="font-bold">Cash Paid</h5>
        <InputGroup>
          <InputGroup.Button
            onClick={() =>
              setData((prevData: any) => ({
                ...prevData,
                paid: amounts.paid,
              }))
            }
          >
            <CheckIcon color="white" fill="blue" />
          </InputGroup.Button>
          <Input
            placeholder="Cash Paid"
            name="cash"
            onChange={(value, event) => {
              setAmounts({ ...amounts, paid: Number(value) });
            }}
          />
        </InputGroup>
      </div>
    </div>
  );
};

export default FInancialSection;
