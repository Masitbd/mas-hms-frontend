"use client";

import {
  useGetAllWorldsQuery,
  useLazyGetSingleWorldsQuery,
} from "@/redux/api/world.api";

import { IAdmissionInitialDataParams } from "./AdmissionInfo";
import {
  useGetAllPackageQuery,
  useLazyGetSinglePackageQuery,
} from "@/redux/api/package.api";
import { useEffect, useMemo, useState } from "react";
type TAdmissionPricingParams = {
  data: any;
  // discountAmount: number;
  vatAmount: number;
  mode: string;
  order?: {
    parcentDiscount: number;
    vat: number;
  };
  totalAmount: number;
  setFormData: React.Dispatch<
    React.SetStateAction<IAdmissionInitialDataParams>
  >;
};

const AdmissionPricing = (params: TAdmissionPricingParams) => {
  const [getWord] = useLazyGetSingleWorldsQuery();
  const [getPackage] = useLazyGetSinglePackageQuery();

  const { data, vatAmount, mode } = params;
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    (async function () {
      if (data.fixedBill) {
        const sdata = await getPackage(data?.fixedBill).unwrap();
        if (sdata?.data?.price) {
          setTotalAmount(sdata.data.price);
          return;
        }
      }
      if (data?.worldId) {
        const sdata = await getWord(data?.worldId).unwrap();
        if (sdata?.data?.charge) {
          setTotalAmount(sdata.data.charge);
          return;
        }
      }
    })();
  }, [data.worldId, data.fixedBill]);
  const dueAmount = 0;

  let discountAmount = 0;

  if (data.parcentDiscount > 0) {
    const discount = Number(
      ((data.parcentDiscount / 100) * Number(totalAmount)).toFixed(2)
    );
    discountAmount = Number((discountAmount + discount).toFixed(2));
  }

  return (
    <div className=" border  shadow-lg ">
      <div className="bg-[#3498ff] text-white px-2 ">
        <h2 className="text-center text-lg font-semibold">Price Information</h2>
      </div>
      <div className=" px-2">
        <div className=" flex justify-between">
          <div className="font-bold">Total Price</div>
          <div> {totalAmount} </div>
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
            Discount parcent <b>({params?.order?.parcentDiscount} % ) </b>{" "}
          </div>
          <div className="text-red-600">
            {" "}
            {discountAmount ? discountAmount : 0}{" "}
          </div>
        </div>

        <div className=" flex justify-between">
          <div className="font-bold">
            Vat <b>({params.order?.vat} % ) </b>
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
              totalAmount -
                discountAmount +
                (data.vat ? vatAmount : vatAmount) -
                (data?.cashDiscount ? data?.cashDiscount : 0)
            )}
          </div>
        </div>
        {/* <div className=" flex justify-between">
          <div className="font-bold">Refunded</div>
          <div className="text-red-600"> {refundTestPrice} </div>
        </div> */}
        <div className=" flex justify-between">
          <div className="font-bold">Paid</div>
          <div className="font-bold text-red-600">
            {data.paid ? Math.ceil(data.paid) : 0}
          </div>
        </div>
        {/* {doesRefundedExists ? (
          <div className=" flex justify-between">
            <div className="font-bold">Cash Refunded </div>
            <div className="text-red-600">
              {Math.ceil(data?.refundData?.remainingRefund ?? 0) || 0}
            </div>
          </div>
        ) : (
          ""
        )} */}
        <hr />
        {/* <div className=" flex justify-between">
          <div className="font-bold">Due Amount</div>
          <div className="font-bold  text-red-600">
            {(
              (data?.dueAmount >= 0 && mode == ENUM_MODE.VIEW
                ? data?.dueAmount
                : dueAmount) ?? 0
            ).toFixed(2)}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AdmissionPricing;
