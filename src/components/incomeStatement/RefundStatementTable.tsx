"use client";
import React, { useEffect, useRef, useState } from "react";
import { formatDateString } from "@/utils/FormateDate";

import {
  useGetCompnayInofQuery,
  useGetDefaultQuery,
} from "@/redux/api/companyInfo/companyInfoSlice";
import { FinancialReportHeaderGenerator } from "../financialStatment/HeaderGenerator";
import Image from "next/image";
import { useGetMarginDataQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { pdfPrintingHelper } from "@/utils/PdfPrintingHelper";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Type for individual records associated with each user
type TRecord = {
  oid: string;
  totalPrice: number;
  totalTestPrice: number;
  totalRefundAmount: number;
  vat: number;
  priceWithVat: number;
  totalCashDiscount: number;
  totalParcentDiscountAmount: number;
  cashDiscount: number;
  parcentDiscountAmount: number;
  testNames: string[];
  totalDis: number;
  netPayable: number;
  totalAmount: number;
  paid: number;
  due: number;
};

// Type for each user

// Type for each group containing users and a date
type TGroup = {
  _id: string;
  records: TRecord[];
};

// Main data type (array of groups)

interface IncomeShowTableProps {
  data: { records: TGroup[]; overallGrandTotal: number }[];
  startDate: Date | null;
  endDate: Date | null;
}

const RefundStatementShowTable: React.FC<IncomeShowTableProps> = ({
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
    const investigationStatement =
      startDate && endDate
        ? {
            text: `Refund Statement: Between ${formatDateString(
              startDate
            )} to ${formatDateString(endDate)}`,
            style: "subheader",
            alignment: "center",
            margin: [0, 0, 0, 20],
          }
        : null;

    const preparedData = data[0]?.records ?? [];

    const documentDefinition: any = {
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 10,
      },
      pageMargins: infoHeader ? [20, 20, 20, 20] : pageMargin,
      content: [
        ...(infoHeader ? infoHeader?.map((item) => item) : []),
        investigationStatement,

        // Table Header (matches the React grid)
        {
          table: {
            widths: [50, 60, 40, 40, 50, 60, 40, 60, 60, 50, 100, 70],
            headerRows: 1,
            body: [
              [
                { text: "Bill No", style: "tableHeader" },
                { text: "Bill Amount", style: "tableHeader" },
                { text: "Dis %", style: "tableHeader" },
                { text: "Dis +", style: "tableHeader" },
                { text: "Total Dis", style: "tableHeader" },
                { text: "Total Amount", style: "tableHeader" },
                { text: "Vat", style: "tableHeader" },
                { text: "Total + Vat", style: "tableHeader" },
                { text: "Amount Paid", style: "tableHeader" },
                { text: "Due", style: "tableHeader" },
                { text: "Particulars", style: "tableHeader" },
                { text: "Refund Amount", style: "tableHeader" },
              ],
            ],
          },
          margin: [0, 0, 0, 10],
        },

        // Grouped Data
        ...preparedData.flatMap((group: any) => [
          {
            text: `${group?._id ?? ""}`,
            style: "groupHeader",
            margin: [0, 10, 0, 5],
          },
          {
            table: {
              widths: [50, 60, 40, 40, 50, 60, 40, 60, 60, 50, 100, 70],
              body: [
                ...group.records.map((record: any) => [
                  record?.oid ?? "",
                  record?.totalPrice ?? 0,
                  record?.parcentDiscountAmount ?? 0,
                  record?.cashDiscount ?? 0,
                  record?.totalDis ?? 0,
                  record?.netPayable ?? 0,
                  record?.vat ?? 0,
                  record?.priceWithVat ?? 0,
                  record?.paid ?? 0,
                  record?.due ?? 0,
                  record?.testNames?.join(", ") ?? "",
                  record?.totalRefundAmount ?? 0,
                ]),
              ],
            },

            margin: [0, 0, 0, 10],
          },
        ]),

        // Grand Total
        {
          text: `Grand Total: ${Number(
            data?.[0]?.overallGrandTotal ?? 0
          ).toFixed(2)}`,
          style: "grandTotalHeader",
          margin: [0, 20, 0, 0],
          alignment: "right",
        },
      ],
      styles: {
        subheader: {
          fontSize: 12,
          italics: true,
          color: "red",
        },
        groupHeader: {
          fontSize: 11,
          bold: true,
          color: "blue",
        },
        tableHeader: {
          bold: true,
          fillColor: "#eeeeee",
          alignment: "center",
        },
        grandTotalHeader: {
          fontSize: 13,
          bold: true,
          color: "purple",
        },
      },
    };

    pdfPrintingHelper(documentDefinition);
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
          Refund Statement : Between{" "}
          {startDate ? formatDateString(startDate) : "N/A"} to{" "}
          {endDate ? formatDateString(endDate) : "N/A"}
        </p>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-12 bg-gray-100 font-semibold text-center p-2">
          <div>Bill No</div>
          <div>Bill Amount</div>
          <div>Dis %</div>
          <div>Dis +</div>
          {/*  */}
          <div>Total Dis </div>
          <div>Total Amount </div>
          <div>Vat</div>
          <div>Total + Vat</div>
          <div>Amount Paid</div>
          <div>Due</div>
          <div>Particulars</div>
          <div>Refund Amount</div>
        </div>
        {data[0]?.records?.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-8">
            {/* Group Date Row */}
            <div className="text-lg font-semibold p-2 mb-2 text-blue-700">
              {group?._id}
            </div>

            {/* Users Data */}
            {group?.records?.map((record, recordIndex) => (
              <div
                key={recordIndex}
                className="grid grid-cols-12 text-center p-2 border-b"
              >
                <div>{record?.oid}</div>
                <div>{record?.totalPrice}</div>
                <div>{record?.parcentDiscountAmount}</div>
                <div>{record?.cashDiscount || 0}</div>
                <div>{record?.totalDis || 0}</div>
                <div>{record?.netPayable || 0}</div>
                <div>{record?.vat || 0}</div>
                <div>{record?.priceWithVat || 0}</div>
                <div>{record?.paid || 0}</div>
                <div>{record?.due || 0}</div>
                <div>{record?.testNames?.join(" , ") || ""}</div>
                <div>{record?.totalRefundAmount || 0}</div>
              </div>
            ))}
          </div>
        ))}

        <p className="flex justify-end font-bold text-xl text-purple-500">
          Grand Total: {data[0]?.overallGrandTotal}
        </p>
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

export default RefundStatementShowTable;
