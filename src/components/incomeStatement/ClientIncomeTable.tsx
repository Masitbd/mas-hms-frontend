"use client";
import React, { useEffect, useRef, useState } from "react";
import { formatDateString } from "@/utils/FormateDate";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { FinancialReportHeaderGenerator } from "../financialStatment/HeaderGenerator";
import {
  useGetCompnayInofQuery,
  useGetDefaultQuery,
} from "@/redux/api/companyInfo/companyInfoSlice";
import Image from "next/image";
import { useGetMarginDataQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

type TRecord = {
  oid: string;
  totalDiscount: number;
  totalPrice: number;
  totalTestPrice: number;
  _id: string;
  createdAt: string;
  dueAmount: number;
  paid: number;
  vat: number;
};

type TGroup = {
  records: TRecord[];
  name: string;
};

interface IncomeShowTableProps {
  data: TGroup[];
  startDate: Date | null;
  endDate: Date | null;
}

const ClientIncomeTable: React.FC<IncomeShowTableProps> = ({
  data,
  startDate,
  endDate,
}) => {
  // header generator

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

  // if not company info

  const { data: marginInfo } = useGetMarginDataQuery(undefined);

  const pageMargin = marginInfo?.data?.value
    .split(",")
    .map((val: any) => Number(val.trim()));

  const generatePDF = () => {
    const documentDefinition: any = {
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 12,
      },
      pageMargins: infoHeader ? [20, 20, 20, 20] : pageMargin,
      content: [
        // Dynamically header array spread
        ...(infoHeader ? infoHeader?.map((item) => item) : []),
        {
          text: `Investigation Income Statement for each client: Between ${
            startDate ? formatDateString(startDate) : "N/A"
          } to ${endDate ? formatDateString(endDate) : "N/A"}`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },

        // Static Table Header
        {
          table: {
            widths: [80, 80, 70, 60, 60, 80, 50, 80, 80, 80], // Fixed column widths
            headerRows: 1,
            body: [
              [
                { text: "Date", style: "tableHeader" },
                { text: "Bill No", style: "tableHeader" },
                { text: "Bill Amount", style: "tableHeader" },
                { text: "Total Discount", style: "tableHeader" },
                { text: "Total Amount", style: "tableHeader" },
                { text: "VAT", style: "tableHeader" },
                { text: "Total + VAT", style: "tableHeader" },
                { text: "Amount Paid", style: "tableHeader" },
                { text: "Due", style: "tableHeader" },
              ],
            ],
          },
          margin: [0, 0, 0, 10],
        },

        // Dynamic content for each group
        ...data.map((group) => [
          {
            table: {
              widths: ["*"], // Single column table
              body: [
                [
                  {
                    text: group?.name,
                    style: "groupHeader",
                    margin: [0, 10, 0, 10],
                    border: [true, true, true, true],
                  },
                ],
              ],
            },
            layout: "lightHorizontalLines", // Optional, adds light horizontal lines
          },
          {
            table: {
              widths: [80, 80, 70, 60, 60, 80, 50, 80, 80, 80], // Fixed column widths
              body: group.records.map((record) => [
                record.createdAt.slice(0, 10), // Date
                record._id, // Bill No
                record.totalPrice.toFixed(2), // Bill Amount
                record.totalDiscount.toFixed(2), // Total Discount
                (record.totalPrice - record.totalDiscount).toFixed(2), // Total Amount
                record.vat.toFixed(2), // VAT
                (record.totalPrice + record.vat - record.totalDiscount).toFixed(
                  2
                ), // Total + VAT
                record.paid.toFixed(2), // Amount Paid
                record.dueAmount.toFixed(2), // Due
              ]),
            },
          },
        ]),
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
        },
        subheader: {
          fontSize: 12,
          italics: true,
          color: "red",
        },
        groupHeader: {
          fontSize: 12,
          bold: true,
          border: true,
        },
        tableHeader: {
          bold: true,
          fillColor: "#eeeeee",
          alignment: "center",
        },
      },
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
          Investigation Income Statement for each client : Between{" "}
          {startDate ? formatDateString(startDate) : "N/A"} to{" "}
          {endDate ? formatDateString(endDate) : "N/A"}
        </p>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-10 bg-gray-100 font-semibold text-center p-2">
          <div>Date</div>
          <div>Bill No</div>
          <div>Bill Amount</div>
          <div>Total Discount</div>
          <div>Total Amount</div>
          <div>VAT</div>
          <div>Total + VAT</div>
          <div>Amount Paid</div>
          <div>Due</div>
        </div>
        {data?.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-3">
            {/* Group Date Row */}

            <div className="border border-black p-2 font-bold" key={groupIndex}>
              {group?.name}
            </div>

            {group?.records?.map((patient, ptindex) => (
              <div
                key={ptindex}
                className="grid grid-cols-9 border border-black "
              >
                <div className="py-1 ps-1">
                  {patient?.createdAt.slice(0, 10)}
                </div>
                <div className="py-1 ps-1">{patient?._id}</div>
                <div className="py-1 ps-1">{patient?.totalPrice}</div>
                <div className="py-1 ps-1">{patient?.totalDiscount}</div>
                <div className="py-1 ps-1">
                  {patient?.totalPrice - patient.totalDiscount}
                </div>
                <div className="py-1 ps-1">{patient.vat}</div>
                <div className="py-1 ps-1">
                  {patient?.totalPrice + patient.vat - patient.totalDiscount}
                </div>
                <div className="py-1 ps-1">{patient?.paid}</div>
                <div className="py-1 ps-1">{patient?.dueAmount}</div>
              </div>
            ))}
          </div>
        ))}
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

export default ClientIncomeTable;
