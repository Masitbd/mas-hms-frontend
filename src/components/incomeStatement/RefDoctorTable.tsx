"use client";
import React, { useRef } from "react";
import { formatDateString } from "@/utils/FormateDate";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

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

export type TGroup = {
  refByWiseDocs: {
    refBy: string; // Added based on its usage
    records: TRecord[];
  }[];
  grandTotalDocs: {
    dueAmount: number;
    paid: number;
    totalDiscount: number;
    totalPrice: number;
    quantity: number;
  };
};

interface IncomeShowTableProps {
  data: TGroup;
  startDate: Date | null;
  endDate: Date | null;
}

const RefDoctorTable: React.FC<IncomeShowTableProps> = ({
  data,
  startDate,
  endDate,
}) => {
  const generatePDF = () => {
    const documentDefinition: any = {
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 12,
      },
      pageMargins: [20, 20, 20, 20],
      content: [
        {
          text: "TMSS SAHERA WASEQUE HOSPITAL & RESEARCH CENTER",
          style: "header",
          alignment: "center",
        },
        {
          text: "Kachari Paira Danga, Nageswori, Kurigram",
          alignment: "center",
        },
        {
          text: "HelpLine: 01755546392 (24 Hours Open)",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        {
          text: `Investigation Income Statement By Ref Doctor: Between ${
            startDate ? formatDateString(startDate) : "N/A"
          } to ${endDate ? formatDateString(endDate) : "N/A"}`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },

        // Static Table Header
        {
          table: {
            widths: ["*", "*", "*", "*", 60, 80, 50, 80, 80], // Fixed column widths
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
        ...data?.refByWiseDocs?.map((group) => [
          {
            table: {
              widths: ["*"], // Single column table
              body: [
                [
                  {
                    text: group?.refBy,
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
              widths: ["*", "*", "*", "*", 60, 80, 50, 80, 80], // Fixed column widths
              body: group?.records?.map((record: TRecord) => [
                record.createdAt.slice(0, 10), // Date
                record._id, // Bill No
                record.totalPrice, // Bill Amount
                record.totalDiscount, // Total Discount
                record.totalPrice - record.totalDiscount, // Total Amount
                record.vat, // VAT
                (record.totalPrice + record.vat - record.totalDiscount).toFixed(
                  2
                ), // Total + VAT
                record.paid, // Amount Paid
                record.dueAmount, // Due
              ]),
            },
          },
        ]),

        // Grand total row
        {
          table: {
            widths: ["*", "*", "*", "*", 60, 80, 50, 80, 80], // Adjust column widths for grand total
            body: [
              [
                { text: "", bold: true },
                {
                  text: `GT. ${data?.grandTotalDocs?.quantity}`,

                  alignment: "center",
                  bold: true,
                },
                {
                  text: data?.grandTotalDocs?.totalPrice,
                  bold: true,
                },
                {
                  text: data?.grandTotalDocs?.totalDiscount,
                  bold: true,
                },
                {
                  text: data?.grandTotalDocs?.totalPrice,
                  bold: true,
                }, // Assuming this is the total after discount
                { text: "", bold: true }, // No VAT
                {
                  text: data?.grandTotalDocs?.totalPrice,
                  bold: true,
                }, // Total + VAT
                { text: data?.grandTotalDocs?.paid, bold: true },
                {
                  text: data?.grandTotalDocs?.dueAmount,
                  bold: true,
                },
              ],
            ],
          },
          layout: "headerLineOnly", // Optional: Adds a line separating the grand total
          margin: [0, 10, 0, 0],
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
      <div className="text-center mb-10">
        <h1 className="text-xl font-bold">
          TMSS SAHERA WASEQUE HOSPITAL & RESEARCH CENTER
        </h1>
        <p>Kachari Paira Danga, Nageswori, Kurigram</p>
        <p>HelpLine: 01755546392 (24 Hours Open)</p>
        <p className="italic text-red-600 text-center mb-5 font-semibold">
          Investigation Income Statement By Ref Doctor : Between{" "}
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
        {data?.refByWiseDocs?.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-3">
            {/* Group Date Row */}

            <div className="border border-black p-2 font-bold" key={groupIndex}>
              {group?.refBy}
            </div>

            {group?.records?.map((patient, ptindex) => (
              <div
                key={ptindex}
                className="grid grid-cols-9 border border-black  gap-5"
              >
                <div className="py-1 ps-1">
                  {patient?.createdAt.slice(0, 10)}
                </div>
                <div className="py-1 ps-1 w-full">{patient?._id}</div>
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

        {/* grand total */}

        <div className="grid grid-cols-9 border text-red-600 font-semibold text-center py-1">
          <div className="col-span-2  ">
            GT. {data?.grandTotalDocs?.quantity}{" "}
          </div>
          <div>{data?.grandTotalDocs?.totalPrice}</div>
          <div>{data?.grandTotalDocs?.totalDiscount}</div>
          <div>{data?.grandTotalDocs?.totalPrice}</div>
          <div></div>
          <div>{data?.grandTotalDocs?.totalPrice}</div>
          <div>{data?.grandTotalDocs?.paid}</div>
          <div>{data?.grandTotalDocs?.dueAmount}</div>

          {/* main close */}
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

export default RefDoctorTable;
