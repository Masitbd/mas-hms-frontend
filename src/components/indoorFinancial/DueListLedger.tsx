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
  admisssionDate: string; // ISO date string
  releaseDate: string; // ISO date string or empty if not yet released
  bedName: string;
  doctName: string;
  totalPaid: number;
  totalAmount: number;
  dueAmount: number;
};

type TGroup = {
  payments: TRecord[];
  _id: string;
  totalBillSum: number;
  totalPaidSum: number;
  dueAmountSum: number;
};

interface IncomeShowTableProps {
  data: TGroup[];
  startDate: Date | null;
  endDate: Date | null;
}

const DueListLedger: React.FC<IncomeShowTableProps> = ({
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
          text: `Indoor Due Statement: Between ${
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
                text: `${group?._id}`,
                style: "groupHeader",
                margin: [0, 10, 0, 5],
              },
              {
                table: {
                  widths: [60, 60, 80, 70, 70, 90, 60, 60, 60],
                  headerRows: 1,
                  body: [
                    [
                      { text: "Reg No", style: "tableHeader" },
                      { text: "Bed", style: "tableHeader" },
                      { text: "Name", style: "tableHeader" },
                      { text: "Admission", style: "tableHeader" },
                      { text: "Release", style: "tableHeader" },
                      { text: "Doctor", style: "tableHeader" },
                      { text: "Total", style: "tableHeader" },
                      { text: "Paid", style: "tableHeader" },
                      { text: "Due", style: "tableHeader" },
                    ],
                    ...group.payments.map((record) => [
                      record.regNo ?? " ",
                      record.bedName ?? " ",
                      record.name ?? " ",
                      record.admisssionDate?.substring(2, 10) ?? " ",
                      record.releaseDate?.substring(2, 10) ?? " ",
                      record.doctName ?? " ",
                      record.totalAmount ?? 0,
                      record.totalPaid ?? 0,
                      record.dueAmount ?? 0,
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
                      { text: group?.totalBillSum ?? 0, bold: true },
                      { text: group?.totalPaidSum ?? 0, bold: true },
                      { text: group?.dueAmountSum ?? 0, bold: true },
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
          Indoor Due Statement : Between{" "}
          {startDate ? formatDateString(startDate) : "N/A"} to{" "}
          {endDate ? formatDateString(endDate) : "N/A"}
        </p>
      </div>

      <div className="w-full">
        {/* Table Header */}
        <div className="grid grid-cols-10 bg-gray-100 font-semibold text-center p-2">
          <div>Bill No</div>
          <div>Bed Name</div>
          <div>Name</div>
          <div>Admission Date</div>
          <div>Release Date</div>
          <div>Assign Doct</div>
          <div>Total Bill</div>
          <div>Total Paid</div>

          <div>Due</div>
          <div>Active</div>
        </div>

        {data.map((group, groupIndex) => {
          return (
            <div key={groupIndex} className="mb-8">
              {/* Group Date Row */}
              <div className="text-lg font-semibold p-2 mb-2">{group._id}</div>

              {/* Records Table */}
              <div className="w-full border-t">
                {/* Records Rows */}
                {group.payments.map((record, recordIndex) => (
                  <div
                    key={recordIndex}
                    className="grid grid-cols-10 text-center p-2 border-b"
                  >
                    <div>{record.regNo}</div>
                    <div>{record.bedName}</div>
                    <div>{record.name}</div>
                    <div>{record.admisssionDate.substring(2, 10)}</div>
                    <div>{record.releaseDate.substring(2, 10)}</div>
                    <div>{record.doctName}</div>
                    <div>{record.totalAmount}</div>
                    <div>{record.totalPaid}</div>
                    <div>{record.dueAmount}</div>
                    <div>
                      <DueCollectionModal data={record} />
                    </div>
                  </div>
                ))}

                {/* Summary Row */}
                <div className="grid grid-cols-9 text-center p-2 border-t font-semibold bg-gray-200">
                  <div>Total</div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div>{group?.totalBillSum}</div>
                  <div>{group?.totalPaidSum}</div>
                  <div>{group?.dueAmountSum}</div>
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

export default DueListLedger;
