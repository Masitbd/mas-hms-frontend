"use client";
import React, { useEffect, useState } from "react";
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
import DueCollectionModal from "../Patient-Admission/DueCollectionModal";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

type TRecord = {
  regNo: string;
  name: string;
  admissionDate: string; // ISO date string
  releaseDate: string; // ISO date string or empty if not yet released
  bedName: string;
  doctName: string;
  totalPaid: number;
  amount: number;
  dueAmount: number;
};

type TGroup = {
  records: TRecord[];
  paymentDate: string;
  totalPaid: number;
  totalAmountPaid: number;
};

interface IncomeShowTableProps {
  data: TGroup[];
  startDate: Date | null;
  endDate: Date | null;
}

const DueCollectionTable: React.FC<IncomeShowTableProps> = ({
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
        ...(infoHeader ? infoHeader.map((item) => item) : []),
        {
          text: `Investigation Income Statement: Between ${
            startDate ? formatDateString(startDate) : "N/A"
          } to ${endDate ? formatDateString(endDate) : "N/A"}`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        ...data
          .map((group) => {
            return [
              {
                text: `${group?.paymentDate}`,
                style: "groupHeader",
                margin: [0, 10, 0, 5],
              },
              {
                table: {
                  widths: [60, 60, 80, 70, 70, 90, 60],
                  headerRows: 1,
                  body: [
                    [
                      { text: "Reg No", style: "tableHeader" },
                      { text: "Bed", style: "tableHeader" },
                      { text: "Name", style: "tableHeader" },
                      { text: "Admission", style: "tableHeader" },
                      { text: "Release", style: "tableHeader" },

                      { text: "Paid", style: "tableHeader" },
                      { text: "Total Paid", style: "tableHeader" },
                    ],
                    ...group.records.map((record) => [
                      record.regNo ?? " ",
                      record.bedName ?? " ",
                      record.name ?? " ",
                      record.admissionDate?.substring(2, 10) ?? " ",
                      record.releaseDate?.substring(2, 10) ?? " ",

                      record.amount ?? 0,
                      record.totalPaid ?? 0,
                    ]),
                    [
                      {
                        text: "Total",
                        colSpan: 6,
                        alignment: "center",
                        bold: true,
                      },
                      {},
                      {},
                      {},
                      {},
                      {},
                      { text: group?.totalAmountPaid ?? 0, bold: true },
                      { text: group?.totalPaid ?? 0, bold: true },
                    ],
                  ],
                },
                margin: [0, 0, 0, 10],
              },
            ];
          })
          .flat(),
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
        {/* Table Header */}
        <div className="grid grid-cols-7 bg-gray-100 font-semibold text-center p-2">
          <div>Bill No</div>
          <div>Bed Name</div>
          <div>Name</div>

          <div>Admission Date</div>
          <div>Release Date</div>

          <div>Amount Paid</div>
          <div>Total Paid</div>
        </div>

        {data.map((group, groupIndex) => {
          return (
            <div key={groupIndex} className="mb-8">
              {/* Group Date Row */}
              <div className="text-lg font-semibold p-2 mb-2">
                {group.paymentDate}
              </div>

              {/* Records Table */}
              <div className="w-full border-t">
                {/* Records Rows */}
                {group.records.map((record, recordIndex) => (
                  <div
                    key={recordIndex}
                    className="grid grid-cols-7 text-center p-2 border-b"
                  >
                    <div>{record.regNo}</div>
                    <div>{record.bedName}</div>
                    <div>{record.name}</div>
                    <div>{record.admissionDate.substring(2, 10)}</div>
                    <div>{record.releaseDate.substring(2, 10)}</div>

                    <div>{record.amount}</div>
                    <div>{record.totalPaid}</div>
                  </div>
                ))}

                {/* Summary Row */}
                <div className="grid grid-cols-7 text-center p-2 border-t font-semibold bg-gray-200">
                  <div>Total</div>
                  <div></div>
                  <div></div>
                  <div></div>

                  <div></div>
                  <div>{group?.totalAmountPaid}</div>
                  <div>{group?.totalPaid}</div>
                </div>
              </div>
            </div>
          );
        })}
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

export default DueCollectionTable;
