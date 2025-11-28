"use client";
import React, { useEffect, useRef, useState } from "react";
import { formatDateString } from "@/utils/FormateDate";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import moment from "moment";
import { FinancialReportHeaderGenerator } from "../financialStatment/HeaderGenerator";
import { useGetDefaultQuery } from "@/redux/api/companyInfo/companyInfoSlice";
import Image from "next/image";
import { useGetMarginDataQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";
import { computeGrandTotalForEmployeeLedger } from "./incomeStatementUtils";
import { pdfPrintingHelper } from "@/utils/PdfPrintingHelper";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

type TRecord = {
  oid: string;
  patient: string;
  time: string;
  user: string;
  createdAt: string;
  amount: number;
};

type TGroup = {
  dewBills: TRecord[];
  newBills: TRecord[];
  user: string;
};

interface IncomeShowTableProps {
  data: TGroup[];
  startDate: Date | null;
  endDate: Date | null;
  rawData: any;
}

const EmployeeLedgerTable: React.FC<IncomeShowTableProps> = ({
  data,
  startDate,
  endDate,
  rawData,
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
    const calculateTotal = () => {
      const totalData = data[data?.length - 1];
      const total =
        Number(totalData?.dewBills[0]?.amount ?? 0) +
        Number(totalData?.newBills[0]?.amount ?? 0);
      return total ?? 0;
    };
    // Prepare the data
    const documentDefinition: any = {
      pageOrientation: "portrait",
      defaultStyle: {
        fontSize: 10,
      },
      pageMargins: infoHeader ? [20, 20, 20, 20] : pageMargin,
      content: [
        ...(infoHeader ? infoHeader?.map((item) => item) : []),
        {
          text: `Employee Income Ledger: Between ${
            startDate ? moment(startDate).format("YYYY-MM-DD") : "N/A"
          } to ${endDate ? moment(endDate).format("YYYY-MM-DD") : "N/A"}`,
          // style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 0],
        },

        // Static Table Header

        // Dynamic content for each group
        ...data.flatMap((group) => [
          {
            text: group?.user || "No Name",
            style: "groupHeader",
            margin: [0, 5, 0, 5],
          },
          {
            table: {
              widths: ["*"], // Single column table
              body: [
                [
                  {
                    text: "Due Bills",
                    style: "groupHeader",
                    margin: [0, 10, 0, 10],
                    border: [true, true, true, true],
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ["*", "*", "*", 120, 120, "*"],
              body: [
                ["Date", "Time", "Bill No", "Patient", "User Name", "Amount"],
                ...group?.dewBills?.map((record) => [
                  record?.createdAt.slice(0, 10),
                  moment(record.createdAt)
                    .utcOffset(6 * 60)
                    .format("HH:mm:ss"),
                  record?.oid ?? " ",
                  record?.patient ?? " ",
                  record?.user ?? " ",
                  record?.amount ?? " ",
                ]),
              ],
            },
          },

          {
            table: {
              widths: ["*"], // Single column table
              body: [
                [
                  {
                    text: "New Bills",
                    style: "groupHeader",
                    margin: [0, 10, 0, 10],
                    border: [true, true, true, true],
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ["*", "*", "*", 120, 120, "*"],
              body: [
                ["Date", "Time", "Bill No", "Patient", "User Name", "Amount"],
                ...group?.newBills?.map((record) => [
                  record?.createdAt.slice(0, 10),
                  moment(record.createdAt)
                    .utcOffset(6 * 60)
                    .format("HH:mm:ss"),
                  record?.oid ?? " ",
                  record?.patient ?? " ",
                  record?.user ?? " ",
                  record?.amount ?? " ",
                ]),
              ],
            },
          },
        ]),
        {
          table: {
            widths: ["*", "*"], // Single column table
            body: [
              [
                {
                  text: "Grand Total",
                  style: {
                    fontSize: 15,
                    alignment: "right",
                    bold: true,
                  },
                  margin: [0, 10, 0, 10],
                },
                {
                  text:
                    computeGrandTotalForEmployeeLedger(rawData?.data)
                      .grandTotal + " TK",
                  style: {
                    fontSize: 15,
                    alignment: "right",
                    bold: true,
                  },
                  margin: [0, 10, 0, 10],
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
    };

    // Open the print dialog
    pdfPrintingHelper(documentDefinition);
  };

  console.log(rawData);

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
        <div className="grid grid-cols-6 bg-gray-100 font-semibold text-center p-2">
          <div>Date</div>
          <div>Time</div>
          <div>Bill No.</div>
          <div>Patient</div>
          <div>User Name</div>
          <div>Amount</div>
        </div>
        {data?.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-3">
            {/* Group Date Row */}

            <div
              className="border border-black p-2 font-bold text-blue-700"
              key={groupIndex}
            >
              {group?.user}
            </div>
            <h2 className="font-semibold text-lg my-3">Due Collection </h2>
            {group?.dewBills?.map((dueBill, ptindex) => (
              <div
                key={ptindex}
                className="grid grid-cols-6 border border-black "
              >
                <div className="py-1 ps-1">
                  {dueBill?.createdAt.slice(0, 10)}
                </div>
                <div className="py-1 ps-1">
                  {moment(dueBill?.createdAt)
                    .utcOffset(6 * 60)
                    .format("HH:mm:ss")}
                </div>
                <div className="py-1 ps-1">{dueBill?.oid}</div>
                <div className="py-1 ps-1">{dueBill?.patient}</div>
                <div className="py-1 ps-1">{dueBill?.user}</div>
                <div className="py-1 ps-1">{dueBill?.amount}</div>
              </div>
            ))}

            {/* new bills */}

            <h2 className="font-semibold text-lg my-3">New Bills</h2>
            {group?.newBills?.map((item, ptindex) => (
              <div
                key={ptindex}
                className="grid grid-cols-6 border border-black "
              >
                <div className="py-1 ps-1">{item?.createdAt.slice(0, 10)}</div>
                <div className="py-1 ps-1">
                  {moment(item?.createdAt)
                    .utcOffset(6 * 60)
                    .format("HH:mm:ss")}
                </div>
                <div className="py-1 ps-1">{item?.oid}</div>
                <div className="py-1 ps-1">{item?.patient}</div>
                <div className="py-1 ps-1">{item?.user}</div>
                <div className="py-1 ps-1">{item?.amount}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-10">
        <div className="col-span-7 text-right font-bold">Grand Total</div>
        <div className="text-center col-span-3 font-bold">
          {(function () {
            return computeGrandTotalForEmployeeLedger(rawData?.data).grandTotal;
          })()}
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

export default EmployeeLedgerTable;
