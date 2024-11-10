import { IOrderData } from "@/app/(withlayout)/order/page";
import React, { useRef, useState } from "react";
import RModal from "../ui/Modal";
import { usePatchOrderMutation } from "@/redux/api/order/orderSlice";
import {
  Button,
  Form,
  Input,
  InputGroup,
  InputPicker,
  Message,
  Schema,
  Table,
  toaster,
} from "rsuite";

const ForDewCollection = ({
  dewModalOpen,
  setDewModalOpen,
  data,
}: {
  dewModalOpen: boolean;
  setDewModalOpen(data: boolean): void;
  data: IOrderData;
}) => {
  const { StringType, NumberType } = Schema.Types;
  const ref: React.MutableRefObject<any> = useRef();
  const [patchOrder, { isSuccess, isLoading, isError }] =
    usePatchOrderMutation();

  const [formData, setFormData] = useState({
    amount: 0,
  });

  const okHanlder = () => {
    if (ref.current.check()) {
      patchOrder({
        id: data._id,
        data: {
          dueAmount: Number(data.dueAmount) - Number(formData.amount),
          paid: Number(data.paid) + Number(formData.amount),
        },
      });
      setDewModalOpen(!dewModalOpen);
    } else {
      toaster.push(
        <Message type="error">Please fill out all the form</Message>
      );
    }
  };
  const cancelHandler = () => {
    setDewModalOpen(!dewModalOpen);
  };
  const model = Schema.Model({
    amount: StringType()
      .isRequired("This field is required.")
      .addRule((value: string | number): boolean => {
        const amount = Number(value);

        if (amount >= 0 && amount <= Number(data.dueAmount)) {
          return true;
        }
        return false;
      }, "Collection amount cannot exceed the deu amount."),
  });

  return (
    <div>
      <RModal
        open={dewModalOpen}
        okHandler={okHanlder}
        cancelHandler={cancelHandler}
        title="Collect due Amount"
        size="md"
      >
        <div>
          <h1 className=" text-xl font-bold">Bill Info</h1>
          <hr />
          <div className="grid grid-cols-3">
            <div className="flex flex-col">
              <div className="font-bold">Total Price</div>
              {data.totalPrice}
            </div>
            <div className="flex flex-col">
              <div className="font-bold">Discount Amount</div>
              {data.cashDiscount}
            </div>
            <div className="flex flex-col">
              <div className="font-bold">Due Amount</div>
              {data.dueAmount}
            </div>
            <div className="flex flex-col my-5">
              <div className="font-bold">Due Amount After Payment</div>
              {Number(data.dueAmount) - Number(formData.amount)}
            </div>
          </div>
          <div>
            <Form
              onChange={(value, event) => {
                setFormData({
                  amount: value.amount,
                });
              }}
              ref={ref}
              model={model}
            >
              <Form.Group controlId="amount">
                <Form.ControlLabel>Collection Amount</Form.ControlLabel>
                <Form.Control name="amount" />
              </Form.Group>
            </Form>
          </div>
        </div>
      </RModal>
    </div>
  );
};

export default ForDewCollection;
