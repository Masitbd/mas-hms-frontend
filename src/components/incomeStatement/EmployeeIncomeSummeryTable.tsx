"use client";
import React, { useRef } from "react";
import { formatDateString } from "@/utils/FormateDate";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { display } from "html2canvas/dist/types/css/property-descriptors/display";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

type TRecord = {
  name: string;
  uuid?: string;
  totalPaid: number;
};

type TGroup = {
  records: TRecord[];
  groupDate: string;
  grandTotal: number;
};

interface IncomeShowTableProps {
  data: TGroup[];
  startDate: Date | null;
  endDate: Date | null;
}

const EmployeeIncomeSummeryTable: React.FC<IncomeShowTableProps> = ({
  data,
  startDate,
  endDate,
}) => {
  const generatePDF = () => {
    const investigationStatement =
      startDate && endDate
        ? {
            text: `Investigation Income Statement: Between ${formatDateString(
              startDate
            )} to ${formatDateString(endDate)}`,
            style: "subheader",
            alignment: "center",
            margin: [0, 0, 0, 20],
          }
        : null;

    const documentDefinition: any = {
      pageOrientation: "portrait",
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
        investigationStatement,

        // Static Table Header
        {
          table: {
            widths: [150, 150, 150], // Fixed column widths
            style: {
              alignment: "center",
            },
            headerRows: 1,
            body: [
              [
                { text: "Name", style: "tableHeader" },
                { text: "Particular", style: "tableHeader" },
                { text: "Debit", style: "tableHeader" },
              ],
            ],
          },
          margin: [0, 0, 0, 10],
        },

        // Dynamic content for each group
        ...data.map((group) => [
          {
            text: ` ${group.groupDate}`,
            style: "groupHeader",
            margin: [0, 10, 0, 10],
          },

          {
            table: {
              widths: [150, 150, 150], // Fixed column widths
              style: {
                alignment: "center",
              },
              body: [
                ...group.records.map((record) => [
                  record.name,
                  record.uuid,

                  record.totalPaid,
                ]),
              ],
            },
            margin: [0, 0, 0, 10],
          },

          {
            text: `Grand Total: ${group.grandTotal}`,
            style: "grandTotal",
            margin: [0, 10, 0, 10],
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
          color: "blue",
        },

        grandTotal: {
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
        {startDate && endDate && (
          <p className="italic text-red-600 text-center mb-5 font-semibold">
            Investigation Income Statement: Between{" "}
            {startDate ? formatDateString(startDate) : "N/A"} to{" "}
            {endDate ? formatDateString(endDate) : "N/A"}
          </p>
        )}
      </div>

      <div className="w-full">
        <div className="grid grid-cols-3 bg-gray-100 font-semibold text-center p-2">
          <div>Name</div>
          <div>UUID</div>
          <div>Debit</div>
        </div>
        {data.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-8">
            {/* Group Date Row */}
            <div className="text-lg font-semibold p-2 mb-2 text-blue-700">
              {group.groupDate}
            </div>

            {/* Records Table */}
            <div className="w-full border-t">
              {/* Table Header */}

              {/* Records Rows */}
              {group.records.map((record, recordIndex) => (
                <div
                  key={recordIndex}
                  className="grid grid-cols-3 text-center p-2 border-b"
                >
                  <div>{record.name}</div>
                  <div>{record.uuid}</div>
                  <div>{record.totalPaid || 0}</div>
                </div>
              ))}
            </div>

            <div className="p-2 border text-violet-700 font-semibold flex justify-between gap-10 w-full mt-8">
              <p>Grand Total:</p>
              <p>{group.grandTotal}</p>
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

export default EmployeeIncomeSummeryTable;
