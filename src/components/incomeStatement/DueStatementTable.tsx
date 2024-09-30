"use client";
import React, { useEffect, useRef, useState } from "react";
import { formatDateString } from "@/utils/FormateDate";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import test from "node:test";
import { color } from "html2canvas/dist/types/css/types/color";
import { FinancialReportHeaderGenerator } from "../financialStatment/HeaderGenerator";
import { useGetCompnayInofQuery } from "@/redux/api/companyInfo/companyInfoSlice";
import Image from "next/image";
import { useGetMarginDataQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

type TTest = {
  label: string;
  price: number;
};

type TRecord = {
  _id: string;
  patientData: {
    name: string;
  };
  refBy: {
    name: string;
  };
  dueAmount: number;
  paid: number;
  totalPrice: number;
  oid: string;
  createdAt: string;
  totalAmount: number;
  vat: number;
  testDetails: TTest[];
};

type TData = {
  records: TRecord[]; // Array of records
  refBy: string;
};

type TGroup = {
  data: TData[]; // Array of TData groups
};

const DueStatemnetTable: React.FC<TGroup> = ({ data }) => {
  const { data: comapnyInfo } = useGetCompnayInofQuery(undefined);

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

  const allRecords = data.flatMap((group) => group.records);

  // Get the earliest (startDate) and latest (endDate) dates
  const dates = allRecords.map((record) => new Date(record.createdAt)) as any;
  const startDate = new Date(Math.min(...dates));
  const endDate = new Date(Math.max(...dates));

  // Format dates to 'YYYY-MM-DD'
  const formattedStartDate = startDate.toISOString().slice(0, 10);
  const formattedEndDate = endDate.toISOString().slice(0, 10);

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
        // Header Section
        ...(infoHeader ? infoHeader?.map((item) => item) : []),
        {
          text: `Statement Of Investigate of Due Bill: ${
            formattedStartDate === formattedEndDate
              ? formattedStartDate
              : `from ${formattedStartDate} to ${formattedEndDate}`
          }`,
          style: "subheader",
          alignment: "center",
          color: "red",
          italic: true,
          margin: [0, 0, 0, 20],
        },

        // Static Table Header
        {
          table: {
            widths: [80, "*", 60, 60, 60], // Adjust column widths accordingly
            body: [
              [
                { text: "Bill No", style: "tableHeader", alignment: "center" },
                {
                  text: "Patient Name",
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: "Total + Vat",
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: "Amount Paid",
                  style: "tableHeader",
                  alignment: "center",
                },
                { text: "Due", style: "tableHeader", alignment: "center" },
              ],
            ],
          },
          margin: [0, 0, 0, 10],
        },

        // Dynamic Data Rows
        ...data.map((group) => {
          const groupRows = [];

          // Group Header: Refd By
          groupRows.push({
            text: group.refBy,
            alignment: "left",
            style: "groupHeader",
            margin: [0, 5, 0, 5],
            border: [true, true, true, true], // Full border for refBy
          });

          // Rows for each item
          group?.records.forEach((item) => {
            groupRows.push({
              table: {
                widths: [80, "*", 60, 60, 60],
                body: [
                  [
                    {
                      text: item.oid,
                      alignment: "center",
                      border: [true, true, true, true],
                    }, // Bill No
                    {
                      text: item.patientData.name,
                      alignment: "center",
                      border: [true, true, true, true],
                    }, // Patient Name
                    {
                      text: item.totalAmount,
                      alignment: "center",
                      border: [true, true, true, true],
                    }, // Total + VAT
                    {
                      text: item.paid,
                      alignment: "center",
                      border: [true, true, true, true],
                    }, // Amount Paid
                    {
                      text: item.totalAmount - item.paid,
                      alignment: "center",
                      border: [true, true, true, true],
                    }, // Due
                  ],
                ],
              },
              margin: [0, 0, 0, 0],
            });

            // Test Details
            if (item?.testDetails?.length > 0) {
              groupRows.push({
                table: {
                  widths: [80, "*", 60, 60, 60],

                  body: item.testDetails.map((testItem, index) => [
                    {
                      text: "",
                      border: [
                        true,
                        index === 0,
                        true,
                        index === item.testDetails.length - 1,
                      ],
                    }, // Top border for the first row, bottom border for the last row
                    {
                      text: `${testItem.label}`,
                      alignment: "left",
                      border: [
                        false,
                        index === 0,
                        false,
                        index === item.testDetails.length - 1,
                      ],
                    }, // Test Label with top and bottom borders
                    {
                      text: `${testItem.price}`,
                      alignment: "center",
                      border: [
                        false,
                        index === 0,
                        false,
                        index === item.testDetails.length - 1,
                      ],
                    }, // Test Price with top and bottom borders
                    {
                      text: "",
                      border: [
                        true,
                        index === 0,
                        true,
                        index === item.testDetails.length - 1,
                      ],
                    }, // Empty cell with top and bottom borders
                    {
                      text: "",
                      border: [
                        true,
                        index === 0,
                        true,
                        index === item.testDetails.length - 1,
                      ],
                    }, // Empty cell with top and bottom borders
                  ]),
                },
                margin: [0, 0, 0, 0], // Adjust margins if needed
              });
            }
          });

          return groupRows;
        }),

        // Total Summary (Footer)
        {
          table: {
            widths: [80, "*", 60, 60, 60],
            body: [
              [
                { text: "", alignment: "center", bold: true },
                { text: "", alignment: "center" },
                { text: totals.totalAmount, alignment: "center", bold: true },
                { text: totals.paidAmount, alignment: "center", bold: true },
                { text: totals.dueAmount, alignment: "center", bold: true },
              ],
            ],
          },
          margin: [0, 10, 0, 0],
        },

        // Footer Section
        {
          table: {
            widths: [80, "*", 60, 60, 60],
            body: [
              [
                { text: "", border: [true, true, true, true] }, // Empty for alignment
                { text: "Others", alignment: "center", bold: true },
                { text: totals.totalAmount, alignment: "center", bold: true },
                { text: totals.paidAmount, alignment: "center", bold: true },
                { text: totals.dueAmount, alignment: "center", bold: true },
              ],
            ],
          },
          margin: [0, 5, 0, 0],
        },
        {
          table: {
            widths: [80, "*", 60, 60, 60],
            body: [
              [
                { text: "GT.", border: [true, true, true, true] }, // Empty for alignment
                { text: "", alignment: "center", bold: true },
                { text: totals.totalAmount, alignment: "center", bold: true },
                { text: totals.paidAmount, alignment: "center", bold: true },
                { text: totals.dueAmount, alignment: "center", bold: true },
              ],
            ],
          },
          margin: [0, 5, 0, 0],
        },
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

  const totals = data.reduce(
    (acc, group) => {
      group.records.forEach((item) => {
        acc.totalAmount += item.totalAmount;
        acc.paidAmount += item.paid;
        acc.dueAmount += item.totalAmount - item.paid; // or use item.dueAmount if available
      });
      return acc;
    },
    { totalAmount: 0, paidAmount: 0, dueAmount: 0 }
  );

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
          Investigation Due Statement : Between{" "}
          {startDate ? formatDateString(startDate) : "N/A"} to{" "}
          {endDate ? formatDateString(endDate) : "N/A"}
        </p>
      </div>

      <div className="w-full">
        {/* Table Header */}
        <div className="grid grid-cols-7 bg-gray-100 font-semibold text-center border px-2 border-black">
          <div className="w-[138px] border-e border-black ">Bill No</div>
          <div className=" text-center border-e border-black col-span-3">
            Patient Name
          </div>
          <div className=" text-center border-e border-black">Total + Vat</div>
          <div className=" text-center border-e border-black">Amount Paid</div>
          <div className="w-24 text-center">Due</div>
        </div>

        {/* Table Body */}
        {/* Table Body */}
        {data?.map((group, groupIndex) => (
          <div key={groupIndex} className="">
            {/* Table Header */}
            <div className="text-lg font-semibold p-2 border-x border-black">
              {group.refBy}
            </div>

            {/* Table Row for each record */}
            {group?.records?.map((item, itemIndex) => (
              <div key={itemIndex} className="border border-black">
                {/* First Row: General Information */}
                <div className="grid grid-cols-7 gap-5 text-sm px-2 w-full items-center border-black">
                  {/* Bill No */}
                  <div className="w-[138px] border-e border-black">
                    {item?.oid}
                  </div>

                  <div className="border-e border-black text-center col-span-3">
                    {item?.patientData?.name}
                  </div>

                  {/* Total + VAT */}
                  <div className="text-center border-e border-black">
                    {item?.totalAmount}
                  </div>

                  {/* Amount Paid */}
                  <div className="text-center border-e border-black">
                    {item?.paid}
                  </div>

                  {/* Due */}
                  <div className="w-24 text-center">
                    {item?.totalAmount - item?.paid}
                  </div>
                </div>
                {/* test */}

                <div className="border border-black">
                  {item?.testDetails?.map((testItem, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-7 text-sm text-center  gap-y-2 px-2 mt-2"
                    >
                      <div className="28 ">{/* id */}</div>
                      <div className="flex justify-between gap-4 col-span-3 px-2 ">
                        <p>{testItem?.label}</p>
                        <p>{testItem?.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="grid grid-cols-7 px-2 border-x border-black">
          <div className="border-e border-black py-1">
            {/* {item?.createdAt.slice(0, 10)} */}
          </div>
          <div className="col-span-3 border-e pe-2 border-black"></div>
          <div className="text-fuchsia-800 text-center font-bold border-e border-black">
            {totals.totalAmount}
          </div>
          <div className="text-fuchsia-800 text-center font-bold border-e border-black">
            {totals.paidAmount}
          </div>
          <div className="text-fuchsia-800 text-center font-bold">
            {totals.dueAmount}
          </div>
        </div>

        {/* Footer 2 */}
        <div className="grid grid-cols-7 px-2 border-x border-t border-black">
          <div className="border-e border-black py-1"></div>
          <div className="col-span-3 border-e pe-2 border-black text-end font-bold text-fuchsia-900">
            Others
          </div>
          <div className="text-fuchsia-800 text-center font-bold border-e border-black">
            {totals.totalAmount}
          </div>
          <div className="text-fuchsia-800 text-center font-bold border-e border-black">
            {totals.paidAmount}
          </div>
          <div className="text-fuchsia-800 text-center font-bold">
            {totals.dueAmount}
          </div>
        </div>

        {/* Footer 3 */}
        <div className="grid grid-cols-7 text-red-800 px-2 border border-black">
          <div className="border-e border-black py-1 font-bold">GT.1</div>
          <div className="col-span-3 border-e pe-2 border-black"></div>
          <div className="text-center font-bold border-e border-black">
            {totals.totalAmount}
          </div>
          <div className="text-center font-bold border-e border-black">
            {totals.paidAmount}
          </div>
          <div className="text-center font-bold">{totals.dueAmount}</div>
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

export default DueStatemnetTable;
