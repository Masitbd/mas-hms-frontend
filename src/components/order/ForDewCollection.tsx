import React, { useRef, useState } from "react";
import RModal from "../ui/Modal";
import {
  useDewColletcionMutation,
  useGetOrderQuery,
  useLazyGetOrderQuery,
  usePatchOrderMutation,
} from "@/redux/api/order/orderSlice";
import { Form, Message, Schema, toaster } from "rsuite";
import { IDewCollectionProps } from "./initialDataAndTypes";
import swal from "sweetalert";

const ForDewCollection = (props: IDewCollectionProps) => {
  const { data, dewModalOpen, setDewModalOpen } = props;
  const { StringType, NumberType } = Schema.Types;
  const ref: React.MutableRefObject<any> = useRef();
  const [
    patchOrder,
    {
      isSuccess: patchOrderSucced,
      isLoading: patchOrderLoading,
      isError: patchOrderError,
      data: patchOrderData,
    },
  ] = usePatchOrderMutation();

  const [
    postDewCollection,
    {
      isLoading: dewCollectionLoading,
      isSuccess: dewCollectionSuccess,
      isError: dewCollectionError,
    },
  ] = useDewColletcionMutation();
  const [formData, setFormData] = useState({
    amount: 0,
  });

  const okHanlder = async () => {
    if (ref.current.check()) {
      const result = await postDewCollection({
        oid: data.oid as string,
        amount: Number(formData.amount),
      });

      if ("data" in result) {
        const clonedData = Object.assign({}, props.data);
        clonedData.dueAmount = result.data.data.dueAmount;
        clonedData.paid = result.data.data.paid;
        props.setFormData(clonedData);
        swal("success", "Due Amount Collected Successfully", "success");
        setFormData({ amount: 0 });
      }
      setDewModalOpen(!dewModalOpen);
    } else {
      toaster.push(
        <Message type="error">Please fill out all the Fields</Message>
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
        loading={dewCollectionLoading}
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
