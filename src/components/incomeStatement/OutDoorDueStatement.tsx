"use client";
import React, { useEffect, useRef, useState } from "react";
import { formatDateString } from "@/utils/FormateDate";

import moment from "moment";
import { FinancialReportHeaderGenerator } from "../financialStatment/HeaderGenerator";
import { useGetDefaultQuery } from "@/redux/api/companyInfo/companyInfoSlice";
import Image from "next/image";
import { useGetMarginDataQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

type TRecord = {
  amount: number;
  createdAt: string;
  oid: string;
  totalPrice: number;
  cashDiscount: number;
  parcentDiscount: number;
  totalDiscount: number;
  totalPaid: number;
  totalDue: 0;
};

type TGroup = {
  _id: string;
  records: TRecord[];
  groupTotalCollection: number;
  grouptotaDueCollection: number;
  grouptotaDueAmount: number;
  grouptotaBill: number;
  grouptotaDiscount: number;
};

interface IncomeShowTableProps {
  data: {
    groupDate: TGroup[];
    grandTotalCollection: number;
    grandTotalDueCollection: number;
    grandTotalDueAmount: number;
    grandTotalBill: number;
    grandTotalDiscount: number;
  }[];
  startDate: Date | null;
  endDate: Date | null;
}

const OutDueStatementTable: React.FC<IncomeShowTableProps> = ({
  data,
  startDate,
  endDate,
}) => {
  //

  const { data: comapnyInfo } = useGetDefaultQuery(undefined);

  const [infoHeader, setInfoHeader] = useState<
    null | { text?: string; image?: string }[]
  >(null);

  // console.log("heaer", infoHeader);

  useEffect(() => {
    const generateHeader = async () => {
      const header = await FinancialReportHeaderGenerator(comapnyInfo?.data);
      setInfoHeader(header); // Set the state with the generated header
    };

    if (comapnyInfo?.data) {
      generateHeader();
    }
  }, [comapnyInfo, data]);

  const { data: marginInfo } = useGetMarginDataQuery(undefined);

  const pageMargin = marginInfo?.data?.value
    .split(",")
    .map((val: any) => Number(val.trim()));

  // pdf
  const generatePDF = () => {
    // Prepare the data
    const documentDefinition: any = {
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 12,
      },
      pageMargins: infoHeader ? [20, 20, 20, 20] : pageMargin,
      content: [
        ...(infoHeader ? infoHeader?.map((item) => item) : []),
        {
          text: `Due Collection Satement: Between ${
            startDate ? moment(startDate).format("YYYY-MM-DD") : "N/A"
          } to ${endDate ? moment(endDate).format("YYYY-MM-DD") : "N/A"}`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 5],
        },

        // Static Table Header

        // Dynamic content for each group
        ...data?.[0]?.groupDate?.flatMap((group) => [
          {
            text: group?._id || "No Name",
            bold: true,
            alignment: "center",
            margin: [0, 20, 0, 5],
          },

          {
            table: {
              widths: ["*", "*", "*", "*", "*", "*", "*", "*"],
              body: [
                [
                  { text: "SL", bold: true, alignment: "center" },
                  { text: "OID", bold: true, alignment: "center" },
                  { text: "T.Amount", bold: true, alignment: "center" },
                  { text: "Pre Collection", bold: true, alignment: "center" },
                  { text: "Due Amount", bold: true, alignment: "center" },
                  { text: "Collection", bold: true, alignment: "center" },
                  { text: "T. Discount", bold: true, alignment: "center" },
                  { text: "Balance Due", bold: true, alignment: "center" },
                ],

                // Data rows
                ...group?.records?.map((record, index: number) => [
                  { text: index + 1, alignment: "center" },
                  { text: record?.oid, alignment: "center" },
                  { text: record?.totalPrice ?? 0, alignment: "center" },
                  { text: record?.totalPaid ?? 0, alignment: "center" },
                  { text: record?.totalDue ?? 0, alignment: "center" },
                  { text: record?.amount ?? 0, alignment: "center" },
                  { text: record?.totalDiscount ?? 0, alignment: "center" },
                  { text: record?.totalDue ?? 0, alignment: "center" },
                ]),

                //  Totals row
                [
                  {
                    text: "Total",
                    colSpan: 2,
                    bold: true,
                    alignment: "center",
                  },
                  {},
                  {
                    text: group?.grouptotaBill ?? 0,
                    bold: true,
                    alignment: "center",
                  },
                  {
                    text: group?.grouptotaDueCollection ?? 0,
                    bold: true,
                    alignment: "center",
                  },
                  {
                    text: group?.grouptotaDueAmount ?? 0,
                    bold: true,
                    alignment: "center",
                  },
                  {
                    text: group?.groupTotalCollection ?? 0,
                    bold: true,
                    alignment: "center",
                  },
                  {
                    text: group?.grouptotaDiscount ?? 0,
                    bold: true,
                    alignment: "center",
                  },
                  "",
                ],
              ],
            },
          },

          //   total
        ]),
        {
          table: {
            widths: ["*", "*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                {
                  text: "Grand Total",
                  colSpan: 2,
                  bold: true,
                  alignment: "center",
                  fillColor: "#e5e7eb",
                },
                {},
                {
                  text: data?.[0]?.grandTotalBill ?? 0,
                  bold: true,
                  alignment: "center",
                  fillColor: "#e5e7eb",
                },
                {
                  text: data?.[0]?.grandTotalDueCollection ?? 0,
                  bold: true,
                  alignment: "center",
                  fillColor: "#e5e7eb",
                },
                {
                  text: data?.[0]?.grandTotalDueAmount ?? 0,
                  bold: true,
                  alignment: "center",
                  fillColor: "#e5e7eb",
                },
                {
                  text: data?.[0]?.grandTotalCollection ?? 0,
                  bold: true,
                  alignment: "center",
                  fillColor: "#e5e7eb",
                },
                {
                  text: data?.[0]?.grandTotalDiscount ?? 0,
                  bold: true,
                  alignment: "center",
                  fillColor: "#e5e7eb",
                },
                "",
              ],
            ],
          },
        },
      ],
    };

    // Open the print dialog
    pdfMake.createPdf(documentDefinition).print();
  };

  return (
    <div className="p-5">
      <div className="text-center mb-10 flex flex-col items-center justify-center">
        <div className="text-xl font-bold flex items-center justify-center gap-5 mb-4">
          <Image
            src={comapnyInfo?.data?.photoUrl}
            alt="Header"
            width={50}
            height={50}
          />{" "}
          <p>{comapnyInfo?.data?.name}</p>
        </div>
        <p>{comapnyInfo?.data?.address}</p>
        <p>HelpLine:{comapnyInfo?.data?.phone} (24 Hours Open)</p>
        <p className="italic text-red-600 text-center mb-5 font-semibold">
          Employee Income Ledger: Between{" "}
          {startDate ? formatDateString(startDate) : "N/A"} to{" "}
          {endDate ? formatDateString(endDate) : "N/A"}
        </p>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-8 bg-gray-400 font-semibold text-center p-2">
          <div>SL</div>
          <div>OID</div>
          <div>Total Amount</div>
          <div>Pre Collected</div>
          <div>Due Amount</div>
          <div>Collection</div>
          <div>Total Disc</div>
          <div>Balance Due</div>
        </div>
        {data[0]?.groupDate?.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-3">
            {/* Group Date Row */}

            <div
              className="border border-black p-2 font-bold text-blue-700"
              key={groupIndex}
            >
              {group?._id}
            </div>

            {group?.records?.map((dueBill, ptindex) => (
              <div
                key={ptindex}
                className="grid grid-cols-8 border border-black text-center "
              >
                <div className="py-1 ps-1">{ptindex + 1}</div>
                <div className="py-1 ps-1">{dueBill?.oid}</div>
                <div className="py-1 ps-1">{dueBill?.totalPrice}</div>
                <div className="py-1 ps-1">{dueBill?.totalPaid}</div>
                <div className="py-1 ps-1">{dueBill?.totalDue}</div>
                <div className="py-1 ps-1">{dueBill?.amount}</div>
                <div className="py-1 ps-1">{dueBill?.totalDiscount}</div>
                <div className="py-1 ps-1">
                  {dueBill?.totalDue > 0 ? "Paid" : dueBill.totalDue}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-8 bg-slate-200 border  border-black font-bold p-2 ">
              <p className="col-span-2">Total</p>
              <p className="text-center">{group?.grouptotaBill}</p>
              <p className="text-center">{group?.grouptotaDueCollection}</p>
              <p className="text-center">{group?.grouptotaDueAmount}</p>
              <p className="text-center">{group?.groupTotalCollection}</p>
              <p className="text-center">{group?.grouptotaDiscount}</p>
            </div>

            {/* new bills */}
          </div>
        ))}
      </div>

      <div className="my-6 ">
        <h1 className="text-center text-2xl font-bold text-blue-500">
          Grand Total
        </h1>
        <div className="grid grid-cols-5 gap-5 border border-black">
          <div className="flex border-e border-black">
            <p>Grand Total bill:</p>

            <p>{data?.[0]?.grandTotalBill}</p>
          </div>

          <div className="flex border-e border-black">
            <p>Grand Total Pre Collected:</p>

            <p>{data?.[0]?.grandTotalDueCollection}</p>
          </div>
          <div className="flex border-e border-black">
            <p>Grand Total Due Amount:</p>

            <p>{data?.[0]?.grandTotalDueAmount}</p>
          </div>
          <div className="flex border-e border-black">
            <p>Grand Total Collected:</p>

            <p>{data?.[0]?.grandTotalCollection}</p>
          </div>
          <div className="flex border-e border-black">
            <p>Grand Total Discount:</p>

            <p>{data?.[0]?.grandTotalDiscount}</p>
          </div>
        </div>
      </div>

      <button
        onClick={generatePDF}
        className="bg-blue-600 px-3 py-2 rounded-md text-white font-semibold mt-4"
      >
        Print
      </button>
    </div>
  );
};

export default OutDueStatementTable;
