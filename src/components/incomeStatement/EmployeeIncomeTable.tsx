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

// Type for individual records associated with each user
type TRecord = {
  oid: string; // Order ID
  uuid?: string; // Optional UUID (may or may not exist)
  amount: number; // Amount for the record
  totalPaid: number; // Total paid in the record
  date: string; // Date as a string (ISO format)
};

// Type for each user
type TUser = {
  postedBy: string; // The person who posted the record
  totalPaid: number; // Total amount paid by the user
  records: TRecord[]; // Array of records associated with the user
};

// Type for each group containing users and a date
type TGroup = {
  groupDate: string; // The date associated with the group
  users: TUser[]; // Array of users in the group
};

// Main data type (array of groups)

interface IncomeShowTableProps {
  data: TGroup[];
  startDate: Date | null;
  endDate: Date | null;
}

const EmployeeIncomeShowTable: React.FC<IncomeShowTableProps> = ({
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
            text: `Investigation Income Statement: Between ${formatDateString(
              startDate
            )} to ${formatDateString(endDate)}`,
            style: "subheader",
            alignment: "center",
            margin: [0, 0, 0, 20],
          }
        : null;

    // Prepare and validate data
    const preparedData = data?.map((group) => ({
      ...group,
      users: group.users?.map((user) => ({
        ...user,
        records: user.records?.map((record) => ({
          ...record,
          amount: isNaN(Number(record.amount)) ? 0 : Number(record.amount), // Ensure amount is a number
          date: record.date?.slice(0, 10) || "", // Safeguard for date
        })),
        totalPaid: isNaN(Number(user.totalPaid)) ? 0 : Number(user.totalPaid), // Ensure totalPaid is a number
      })),
    }));

    const documentDefinition: any = {
      pageOrientation: "portrait",
      defaultStyle: {
        fontSize: 12,
      },
      pageMargins: infoHeader ? [20, 20, 20, 20] : pageMargin,
      content: [
        ...(infoHeader ? infoHeader?.map((item) => item) : []),
        investigationStatement,

        // Static Table Header
        {
          table: {
            widths: [150, 150, 150], // Fixed column widths
            headerRows: 1,
            body: [
              [
                { text: "Time", style: "tableHeader" },
                { text: "Particular", style: "tableHeader" },
                { text: "Debit", style: "tableHeader" },
              ],
            ],
          },
          margin: [0, 0, 0, 10],
        },

        // Dynamic content for each group
        ...preparedData?.flatMap((group) => [
          {
            text: ` ${group?.groupDate ?? " "}`,
            style: "groupHeader",
            margin: [0, 10, 0, 10],
          },
          ...group?.users?.map((user) => [
            {
              text: ` ${user?.postedBy ?? " "}`,
              style: "nameHeader",
              margin: [0, 10, 0, 10],
            },

            {
              table: {
                widths: [150, 150, 150], // Fixed column widths
                body: [
                  ...user?.records?.map((record) => [
                    record?.date ?? " ", // Safeguard for date
                    record?.oid ?? " ", // Safeguard for oid
                    Number(record?.amount ?? 0).toFixed(2) ?? "0", // Ensure amount is formatted correctly
                  ]),
                ],
              },
              margin: [0, 0, 0, 10],
            },

            {
              text: `Total : ${Number(user?.totalPaid ?? 0).toFixed(2) ?? "0"}`,
              style: "totalpaidHeader",
              margin: [10],
            },
          ]),
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
        nameHeader: {
          fontSize: 12,
          bold: true,
          border: true,
        },
        totalpaidHeader: {
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
          Investigation Income Statement : Between{" "}
          {startDate ? formatDateString(startDate) : "N/A"} to{" "}
          {endDate ? formatDateString(endDate) : "N/A"}
        </p>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-3 bg-gray-100 font-semibold text-center p-2">
          <div>Time</div>
          <div>Particular</div>
          <div>Debit</div>
        </div>
        {data.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-8">
            {/* Group Date Row */}
            <div className="text-lg font-semibold p-2 mb-2 text-blue-700">
              {group?.groupDate}
            </div>

            {/* Users Data */}
            {group.users.map((user, userIndex) => (
              <div key={userIndex} className="border-t">
                {/* User Header */}
                <div className=" font-semibold p-2 border">
                  Name: {user?.postedBy}
                </div>

                {/* Records Table */}
                <div className="w-full border-t">
                  {/* Table Header */}

                  {/* Records Rows */}
                  {user.records.map((record, recordIndex) => (
                    <div
                      key={recordIndex}
                      className="grid grid-cols-3 text-center p-2 border-b"
                    >
                      <div>{record?.date.slice(0, 10)}</div>
                      <div>{record?.oid}</div>
                      <div>{record?.amount || 0}</div>
                    </div>
                  ))}
                </div>

                <div className="p-2 border text-violet-700 font-semibold grid col-span-2 justify-end">
                  Total: {user.totalPaid}
                </div>
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

export default EmployeeIncomeShowTable;
