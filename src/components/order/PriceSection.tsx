import React from "react";

const PriceSection = ({
  totalPrice,
  data,
  discountAmount,
  vatAmount,
}: {
  totalPrice: number;
  data: any;
  discountAmount: number;
  vatAmount: number;
}) => {
  console.log();
  return (
    <div>
      <div className="mt-10">
        <div className="mt-5">
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
            {data.cashDiscount ? data.cashDiscount : 0}{" "}
          </div>
        </div>
        <div className=" flex justify-between">
          <div className="font-bold">Discount parcent </div>
          <div className="text-red-600">
            {" "}
            {discountAmount ? discountAmount : 0}{" "}
          </div>
        </div>

        <div className=" flex justify-between">
          <div className="font-bold">Vat</div>
          <div className="text-green-600">
            {data.vat ? data.vat : vatAmount}{" "}
          </div>
        </div>
        <hr />
        <div className=" flex justify-between">
          <div className="font-bold">Net Price</div>
          <div className="font-bold">
            {(
              totalPrice -
              discountAmount +
              (data.vat ? data.vat : vatAmount) -
              (data.cashDiscount ? data.cashDiscount : 0)
            ).toFixed(2)}
          </div>
        </div>
        <div className=" flex justify-between">
          <div className="font-bold">Paid</div>
          <div className="font-bold text-green-600">
            {data.paid ? data.paid : 0}
          </div>
        </div>
        <hr />
        <div className=" flex justify-between">
          <div className="font-bold">Due Amount</div>
          <div className="font-bold  text-red-600">
            {(
              totalPrice -
              discountAmount +
              vatAmount -
              (data.cashDiscount ? data.cashDiscount : 0) -
              (data.paid ? data.paid : 0) +
              (data.vat ? data.vat : 0)
            ).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceSection;
