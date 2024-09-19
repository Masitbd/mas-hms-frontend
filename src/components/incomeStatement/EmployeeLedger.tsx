"use client";
import React, { useRef } from "react";
import { formatDateString } from "@/utils/FormateDate";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import moment from "moment";

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
}

const EmployeeLedgerTable: React.FC<IncomeShowTableProps> = ({
  data,
  startDate,
  endDate,
}) => {
  const generatePDF = () => {
    // Prepare the data
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
          text: `Investigation Employee Ledger: Between ${
            startDate ? moment(startDate).format("YYYY-MM-DD") : "N/A"
          } to ${endDate ? moment(endDate).format("YYYY-MM-DD") : "N/A"}`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },

        // Static Table Header
        {
          table: {
            widths: [80, 80, 80, 80, 80, 80], // Fixed column widths
            headerRows: 1,
            body: [
              [
                { text: "Date", style: "tableHeader" },
                { text: "Time", style: "tableHeader" },
                { text: "Bill No", style: "tableHeader" },
                { text: "Patient", style: "tableHeader" },
                { text: "User Name", style: "tableHeader" },
                { text: "Amount", style: "tableHeader" },
              ],
            ],
          },
          margin: [0, 0, 0, 10],
        },

        // Dynamic content for each group
        ...data.flatMap((group) => [
          {
            text: group?.user || "No Name",
            style: "groupHeader",
            margin: [0, 10, 0, 10],
          },
          {
            table: {
              widths: [80, 80, 80, 80, 80, 80],
              body: [
                ["Date", "Time", "Bill No", "Patient", "User Name", "Amount"],
                ...group?.dewBills?.map((record) => [
                  record.createdAt.slice(0, 10),
                  moment(record.createdAt)
                    .utcOffset(6 * 60)
                    .format("HH:mm:ss"),
                  record.oid,
                  record.patient,
                  record.user,
                  record.amount,
                ]),
              ],
            },
          },
        ]),
      ],
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
          Investigation Employee Ledger : Between{" "}
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
            <h2 className="font-semibold text-lg my-3">Due Collection</h2>
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
