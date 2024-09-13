import React, { SetStateAction, useEffect, useState } from "react";
import RModal from "../ui/Modal";
import { IOrderData } from "./initialDataAndTypes";
import { ITest } from "@/types/allDepartmentInterfaces";
import { ITestsFromOrder } from "../generateReport/initialDataAndTypes";
import { Input } from "rsuite";
import { useAppSelector } from "@/redux/hook";
import { usePostRefundMutation } from "@/redux/api/refund/refundSlice";
import swal from "sweetalert";
const Refund = (props: {
  open: boolean;
  order: IOrderData;
  test: ITestsFromOrder;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [post, { isLoading, isError }] = usePostRefundMutation();
  const { open, order, test, setOpen } = props;
  const [text, setText] = useState("");
  const refundedBy = useAppSelector((state) => state.auth.user.uuid);
  const okHandler = async () => {
    const refundData = {
      oid: order.oid,
      id: test?.SL,
      refundedBy: refundedBy,
    };
    const result = await post(refundData);
    if ("data" in result) {
      swal("Success", "Refunded Successfylly", "success");
      setOpen(false);
    } else {
      swal("Error", "Refund Faild", "error");
    }
  };

  const cancelHandler = () => {
    setOpen(false);
  };

  const [refundabelAmount, setRefundableAmount] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [refundMethod, setRefundMethod] = useState("");
  const [dueDeducted, setDueDeducted] = useState(0);
  const [netTestPrice, setNetTestPrice] = useState(0);

  useEffect(() => {
    const totalAmountOfOrder = order?.totalPrice;
    const dueAmount = order?.dueAmount;
    const refundTest = test?.test;
    const gruntedDiscount = Number(test?.discount);
    const parcentDiscount = order?.parcentDiscount;
    const cashDiscount = order?.cashDiscount;
    const vat = Number(order?.vat);
    let netPriceOfTest = Number(refundTest?.price);
    if (gruntedDiscount > 0) {
      const discountAmount = Math.ceil(
        (Number(refundTest.price) * gruntedDiscount) / 100
      );

      netPriceOfTest = Number(refundTest.price) - discountAmount;
    }

    if (parcentDiscount > 0) {
      const discountAmount =
        Math.ceil(Number(refundTest?.price) * parcentDiscount) / 100;
      netPriceOfTest = Number(refundTest?.price) - discountAmount;
    }

    // if (cashDiscount > 0) {
    //   const cashDiscountGranted = Math.ceil(
    //     (cashDiscount / totalAmountOfOrder) * refundTest.price
    //   );
    //   netPriceOfTest = netPriceOfTest - cashDiscountGranted;
    // }

    if (vat) {
      const VatAmount = (netPriceOfTest * vat) / 100;
      netPriceOfTest + VatAmount;
      setVatAmount(VatAmount);
    }

    if (netPriceOfTest <= dueAmount) {
      setRefundableAmount(netPriceOfTest);
      setRefundMethod("Amount Will be Deducted From Due Amount");
    } else {
      const payablePirce = netPriceOfTest - dueAmount;
      setDueDeducted((dueAmount - netPriceOfTest - order?.paid) * -1);
      setRefundableAmount(payablePirce);
      setRefundMethod("Cash Will Be Paid To Customer");
    }
    setNetTestPrice(netPriceOfTest);
  }, [props]);

  return (
    <RModal
      title="Initiate Refund"
      open={open}
      okHandler={okHandler}
      cancelHandler={cancelHandler}
      size="md"
      loading={isLoading}
    >
      <div className="grid grid-cols-12 gap-2">
        <h3 className="col-span-4 font-bold">Name</h3>
        <h3 className="col-span-4 font-bold">Amount:</h3>
        <h3 className="col-span-4 font-bold">Discount:</h3>
        <div className="col-span-4">{test?.test?.label}</div>
        <div className="col-span-4">{test?.test?.price}</div>
        <div className="col-span-4">
          {test?.discount ? test?.discount : "N/A"}
        </div>
        <div className="col-span-12 grid grid-cols-12">
          <div className="col-span-12 font-bold">
            Total {refundMethod}
            <hr />
          </div>

          <div className="col-span-8">Price:</div>
          <div className="col-span-4">{test?.test?.price}</div>

          <div className="col-span-8">Discount:</div>
          <div className="col-span-4  text-red-600">
            {test?.test?.price - netTestPrice - vatAmount}
          </div>
          {dueDeducted ? (
            <>
              {" "}
              <div className="col-span-8">Deducted From Dew:</div>
              <div className="col-span-4 text-red-600">{dueDeducted}</div>
            </>
          ) : (
            ""
          )}

          <div className="col-span-8">Vat:</div>
          <div className="col-span-4  text-green-600">{vatAmount}</div>
          <hr className="col-span-12" />
          <div className="col-span-8 font-bold">Net:</div>
          <div className="col-span-4 font-bold">
            {refundabelAmount}
            <div className="font-bold">
              <hr className="mb-[1px]" />

              <hr />
            </div>
          </div>
        </div>
        <div className="col-span-12">
          <h3 className="font-bold">Refund Reason</h3>
          <Input as={"textarea"} onChange={(value) => setText(value)} />
        </div>
      </div>
    </RModal>
  );
};

export default Refund;
