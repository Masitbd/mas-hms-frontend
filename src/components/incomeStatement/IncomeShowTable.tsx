"use client";
import React, { useEffect, useRef, useState } from "react";
import { formatDateString } from "@/utils/FormateDate";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  useGetCompnayInofQuery,
  useGetDefaultQuery,
} from "@/redux/api/companyInfo/companyInfoSlice";
import { FinancialReportHeaderGenerator } from "../financialStatment/HeaderGenerator";
import Image from "next/image";
import { useGetMarginDataQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

type TRecord = {
  oid: string;
  uuid?: string;
  totalPrice: number;
  totalDis: number;
  cashDiscount: number;
  parcentDiscountAmount: number;
  totalAmount: number;
  paid: number;
  vat: number;
};

type TGroup = {
  records: TRecord[];
  groupDate: string;
};

interface IncomeShowTableProps {
  data: TGroup[];
  startDate: Date | null;
  endDate: Date | null;
}

const IncomeShowTable: React.FC<IncomeShowTableProps> = ({
  data,
  startDate,
  endDate,
}) => {
  const { data: comapnyInfo } = useGetDefaultQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

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
  //

  const { data: marginInfo } = useGetMarginDataQuery(undefined);

  const pageMargin = marginInfo?.data?.value
    .split(",")
    .map((val: any) => Number(val.trim()));

  // pdf
  const generatePDF = () => {
    const documentDefinition: any = {
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 12,
      },
      pageMargins: infoHeader ? [20, 20, 20, 20] : pageMargin,
      content: [
        ...(infoHeader ? infoHeader?.map((item) => item) : []),
        {
          text: `Investigation Income Statement: Between ${
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
                { text: "Bill No", style: "tableHeader" },
                { text: "Bill Amount", style: "tableHeader" },
                { text: "Discount(%)", style: "tableHeader" },
                { text: "Discount +", style: "tableHeader" },
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
            text: ` ${group?.groupDate}`,
            style: "groupHeader",
            margin: [0, 10, 0, 10],
          },
          {
            table: {
              widths: [80, 80, 70, 60, 60, 80, 50, 80, 80, 80], // Fixed column widths
              body: group.records.map((record) => [
                record.oid ?? " ",
                record.totalPrice,
                record.parcentDiscountAmount,
                record.cashDiscount,
                record.totalDis,
                record.totalPrice - record.totalDis,
                record.vat,
                record.totalAmount,
                record.paid,
                record.totalAmount - record.paid > 0
                  ? record.totalAmount - record.paid
                  : 0,
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
          Investigation Income Statement : Between{" "}
          {startDate ? formatDateString(startDate) : "N/A"} to{" "}
          {endDate ? formatDateString(endDate) : "N/A"}
        </p>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-10 bg-gray-100 font-semibold text-center p-2">
          <div>Bill No</div>
          <div>Bill Amount</div>
          <div>Discount(%)</div>
          <div>Discount +</div>
          <div>Total Discount</div>
          <div>Total Amount</div>
          <div>VAT</div>
          <div>Total + VAT</div>
          <div>Amount Paid</div>
          <div>Due</div>
        </div>
        {data.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-8">
            {/* Group Date Row */}
            <div className="text-lg font-semibold p-2 mb-2">
              {group.groupDate}
            </div>

            {/* Records Table */}
            <div className="w-full border-t ">
              {/* Table Header */}

              {/* Records Rows */}
              {group.records.map((record, recordIndex) => (
                <div
                  key={recordIndex}
                  className="grid grid-cols-10 text-center p-2 border-b"
                >
                  <div>{record.oid}</div>
                  <div>{record.totalPrice}</div>
                  <div>{record.parcentDiscountAmount}</div>
                  <div>{record.cashDiscount}</div>
                  <div>{record.totalDis}</div>
                  <div>{record.totalPrice - record.totalDis}</div>
                  <div>{record.vat}</div>
                  <div>{record.totalAmount}</div>
                  <div>{record.paid}</div>
                  <div>{record.totalAmount - record.paid}</div>
                </div>
              ))}
            </div>
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

export default IncomeShowTable;
