import React from "react";
import { IPriceSectionProps } from "./initialDataAndTypes";
import { ITestsFromOrder } from "../generateReport/initialDataAndTypes";

const PriceSection = (props: IPriceSectionProps) => {
  const { data, discountAmount, totalPrice, vatAmount, tubePrice } = props;
  const dueAmount =
    totalPrice -
    discountAmount -
    (data.cashDiscount ? data.cashDiscount : 0) -
    (data.paid ? data.paid : 0) +
    (data.vat ? vatAmount : 0);

  const doesRefundedExists =
    data.tests.length > 0 &&
    data.tests.filter((t: ITestsFromOrder) => t.status === "refunded");
  let grossTotalPrice = totalPrice;
  let refundTestPrice = 0;
  if (doesRefundedExists.length) {
    refundTestPrice = data?.refundData?.refundApplied || 0;
  }

  return (
    <div className=" border  shadow-lg">
      <div className="bg-[#3498ff] text-white px-2 py-2">
        <h2 className="text-center text-xl font-semibold">Price Information</h2>
      </div>
      <div className=" px-2">
        <div className="mt-2">
          <h2 className="text-xl font-bold">Price Info</h2>
          <hr />
        </div>
        <div className=" flex justify-between">
          <div className="font-bold">Total Price</div>
          <div> {totalPrice} </div>
        </div>

        <div className=" flex justify-between">
          <div className="font-bold">Cash Discount</div>
          <div className="text-red-600">
            {" "}
            {data?.cashDiscount ? data?.cashDiscount : 0}{" "}
          </div>
        </div>
        <div className=" flex justify-between">
          <div className="font-bold">
            Discount parcent <b>({props?.order?.parcentDiscount} % ) </b>{" "}
          </div>
          <div className="text-red-600">
            {" "}
            {discountAmount ? discountAmount : 0}{" "}
          </div>
        </div>

        <div className=" flex justify-between">
          <div className="font-bold">
            Vat <b>({props.order?.vat} % ) </b>
          </div>
          <div className="text-green-600">
            {data?.vat ? Math.ceil(vatAmount) : 0}{" "}
          </div>
        </div>

        <hr />
        <div className=" flex justify-between">
          <div className="font-bold">Net Price</div>
          <div className="font-bold">
            {Math.ceil(
              totalPrice -
                discountAmount +
                (data.vat ? vatAmount : vatAmount) -
                (data?.cashDiscount ? data?.cashDiscount : 0) ?? 0
            )}
          </div>
        </div>
        <div className=" flex justify-between">
          <div className="font-bold">Refunded</div>
          <div className="text-red-600"> {refundTestPrice} </div>
        </div>
        <div className=" flex justify-between">
          <div className="font-bold">Paid</div>
          <div className="font-bold text-red-600">
            {data.paid ? Math.ceil(data.paid) : 0}
          </div>
        </div>
        {doesRefundedExists ? (
          <div className=" flex justify-between">
            <div className="font-bold">Cash Refunded </div>
            <div className="text-red-600">
              {Math.ceil(data?.refundData?.remainingRefund ?? 0) || 0}
            </div>
          </div>
        ) : (
          ""
        )}
        <hr />
        <div className=" flex justify-between">
          <div className="font-bold">Due Amount</div>
          <div className="font-bold  text-red-600">
            {(
              (data?.dueAmount >= 0 ? data?.dueAmount : dueAmount) ?? 0
            ).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceSection;
