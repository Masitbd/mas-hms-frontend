"use client";

import { useGetDetailsAdmissionQuery } from "@/redux/api/admission.api";
import { TParams } from "../../[id]/page";
import { Button, SelectPicker, Table } from "rsuite";
import Column from "rsuite/esm/Table/TableColumn";
import { Cell, HeaderCell } from "rsuite-table";
import { useState, useEffect } from "react";
import { discountOption } from "@/components/order/FInancialSection";
import { useUpdateDisCountPaymentMutation } from "@/redux/api/payment.api";
import Swal from "sweetalert2";

const AdmissionEditPage = ({ params }: TParams) => {
  const { id } = params;

  const { data: detailsAdmission, isLoading } = useGetDetailsAdmissionQuery(
    id,
    {
      skip: !id,
    }
  );

  const data = detailsAdmission?.data[0];

  const [update, { isLoading: updating }] = useUpdateDisCountPaymentMutation();

  // Financial state
  const [financialData, setFinancialData] = useState({
    discountedBy: data?.paymentInfo?.discountedBy || "",
    vat: data?.paymentInfo?.vat || 0,
    parcentDiscount: data?.paymentInfo?.parcentDiscount || 0,
    cashDiscount: data?.paymentInfo?.cashDiscount || 0,
    paid: data?.paymentInfo?.totalPaid || 0,
  });

  const handleFinancialChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFinancialData((prevData) => ({
      ...prevData,
      [field]:
        field === "vat" ||
        field === "parcentDiscount" ||
        field === "cashDiscount" ||
        field === "paid"
          ? Number(e.target.value)
          : e.target.value,
    }));
  };

  // Calculate the discount amount, VAT, and the net price
  const totalAmount = data?.totalAmount || 0;
  const discountAmount =
    (totalAmount * (financialData.parcentDiscount || 0)) / 100;
  const vatAmount = (totalAmount * (financialData.vat || 0)) / 100;

  const netPrice =
    totalAmount -
    discountAmount +
    vatAmount -
    (financialData.cashDiscount || 0);

  const handleSubmit = async () => {
    const payload = {
      patientRegNo: data?.regNo,
      data: {
        discountAmount:
          financialData.cashDiscount > 0
            ? financialData.cashDiscount
            : discountAmount,
      },
    };

    try {
      const res = await update(payload).unwrap();

      if (res.success) {
        Swal.fire({
          title: "Updated Successfully",
          showConfirmButton: false,
          position: "top-end",
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          icon: "success",
        });
        setFinancialData({
          discountedBy: "",
          vat: 0,
          parcentDiscount: 0,
          cashDiscount: 0,
          paid: 0,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Something went wrong",
        showConfirmButton: false,
        position: "top-end",
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: "error",
      });
    }
  };

  return (
    <div className="w-full px-10 mt-5">
      <h1 className="bg-blue-500 w-80 py-3 px-1 rounded text-slate-100 text-center mx-auto font-bold text-xl leading-5 ">
        Patient Admission Details
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-16">
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">RegNo:</span>
            {data?.regNo}
          </p>
        </div>
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Name :</span>
            {data?.name}
          </p>
        </div>
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Admission Date:</span>
            {new Date(data?.admissionDate).toLocaleDateString()}
          </p>
        </div>
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Admission Time : </span>
            {new Date(data?.admissionTime).toLocaleTimeString()}
          </p>
        </div>
        {/*  */}
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">World Name : </span>
            {data?.allocatedBedDetails?.world?.worldName}
          </p>
        </div>
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Bed Name : </span>
            {data?.allocatedBedDetails?.bedName}
          </p>
        </div>
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Floor : </span>
            {data?.allocatedBedDetails?.floor}
          </p>
        </div>
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Day Stayed : </span>
            {data?.daysStayed}
          </p>
        </div>
      </div>

      {/* Payment info */}
      <h1 className="bg-blue-500 mt-4 w-80 py-3 px-1 rounded text-slate-100 text-center mx-auto font-bold text-xl leading-5 ">
        Payment Details
      </h1>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-5">
        {/* 1st */}
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Total Amount:</span>
            {totalAmount}
          </p>
        </div>
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Total Paid:</span>
            <span className="text-green-500">
              {data?.paymentInfo?.totalPaid}
            </span>
          </p>
        </div>
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Total Discount:</span>
            <span className="text-blue-500">
              {data?.paymentInfo?.discountAmount}
            </span>
          </p>
        </div>
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Due Amount:</span>
            <span className="text-red-500">
              {totalAmount - data?.paymentInfo?.totalPaid}
            </span>
          </p>
        </div>
      </div>

      {/* Financial Section */}

      <div className="flex justify-between mt-10 ">
        {/* Services Details */}
        <div className="mt-8 border p-3 w-full max-w-[40%]">
          <h1 className="bg-blue-500 w-80 py-3 px-1 my-7 rounded text-slate-100 text-center mx-auto font-bold text-xl leading-5 ">
            Services Details
          </h1>
          <Table height={400} data={data?.services} autoHeight>
            <Column width={180}>
              <HeaderCell>Service Name</HeaderCell>
              <Cell dataKey="label" />
            </Column>

            <Column width={130}>
              <HeaderCell>Unit Price</HeaderCell>
              <Cell dataKey="total" />
            </Column>

            <Column width={120}>
              <HeaderCell> Quantity </HeaderCell>
              <Cell dataKey="quantity" />
            </Column>

            <Column width={135}>
              <HeaderCell>Total</HeaderCell>
              <Cell>{(rowData) => `${rowData.total * rowData?.quantity}`}</Cell>
            </Column>
          </Table>
        </div>

        <div className="bg-slate-100 p-7 rounded w-full max-w-[50%]">
          <h1 className="bg-blue-500 mt-4 w-80 py-3 px-1 rounded text-slate-100 text-center mx-auto font-bold text-xl leading-5 ">
            Financial Section
          </h1>
          <div className="mt-10 grid grid-cols-2  gap-5">
            {/* Discounted By */}
            <div className="border py-2 px-1 rounded">
              <h5 className="font-bold">Discount Given By</h5>
              <SelectPicker
                data={discountOption}
                block
                cleanable={false}
                searchable={false}
                defaultValue={data?.discountedBy}
              />
            </div>
            {/* Vat */}

            {/* Discount Percentage */}
            <div className="border py-2 px-1 rounded">
              <h5 className="font-bold">Discount Percentage</h5>
              <input
                type="number"
                value={financialData.parcentDiscount}
                onChange={(e) => handleFinancialChange(e, "parcentDiscount")}
                placeholder="Percentage Discount"
                className="border px-2 py-1 w-full"
              />
            </div>
            {/* Cash Discount */}
            <div className="border py-2 px-1 rounded">
              <h5 className="font-bold">Cash Discount</h5>
              <input
                type="number"
                value={financialData.cashDiscount}
                onChange={(e) => handleFinancialChange(e, "cashDiscount")}
                placeholder="Cash Discount"
                className="border px-2 py-1 w-full"
              />
            </div>

            {/* Cash Paid */}
            <div className="border py-2 px-1 rounded">
              <h5 className="font-bold">Cash Paid</h5>
              <input
                type="number"
                value={financialData.paid}
                onChange={(e) => handleFinancialChange(e, "paid")}
                placeholder="Cash Paid"
                className="border px-2 py-1 w-full"
              />
            </div>
          </div>

          {/* Summary of Financial Calculations */}
          <div className="mt-8 border p-3 w-full ">
            <h1 className="bg-blue-500 w-80 py-3 px-1 my-7 rounded text-slate-100 text-center mx-auto font-bold text-xl leading-5 ">
              Price Summary
            </h1>
            <div className="flex justify-between">
              <div className="font-bold">Discount Amount:</div>
              <div>{discountAmount}</div>
            </div>
            <div className="flex justify-between">
              <div className="font-bold">VAT Amount:</div>
              <div>{Math.ceil(vatAmount)}</div>
            </div>
            <div className="flex justify-between">
              <div className="font-bold">Net Price:</div>
              <div>{Math.ceil(netPrice)}</div>
            </div>
          </div>

          <div className="my-5 flex justify-center items-center">
            <Button
              onClick={handleSubmit}
              color="green"
              appearance="primary"
              className="w-full "
              disabled={updating}
            >
              {updating ? "Loading..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionEditPage;
