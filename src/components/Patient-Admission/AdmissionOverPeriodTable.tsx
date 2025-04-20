"use client";
import React, { useEffect, useState } from "react";
import { formatDateString } from "@/utils/FormateDate";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useGetDefaultQuery } from "@/redux/api/companyInfo/companyInfoSlice";
import { FinancialReportHeaderGenerator } from "../financialStatment/HeaderGenerator";
import Image from "next/image";
import { useGetMarginDataQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

type TRecord = {
  regNo: string;
  name: string;
  admissionDate: string;
  releaseDate: string;
  bedName: string;
  presentAddress: string;
  [key: string]: any;
};

type TGroup = {
  patients: TRecord[];
  _id: string;
  count: number;
};

interface Column {
  label: string;
  field: string;
  render?: (record: TRecord) => React.ReactNode;
}

interface AdmitOverPeriodTableProps {
  data: TGroup[];
  startDate?: Date | null;
  endDate?: Date | null;
  title: string;
  columns: Column[];
}

const AdmitOverPeriodTable: React.FC<AdmitOverPeriodTableProps> = ({
  data,
  startDate,
  endDate,
  title,
  columns,
}) => {
  const { data: comapnyInfo } = useGetDefaultQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const [infoHeader, setInfoHeader] = useState<
    null | { text?: string; image?: string }[]
  >(null);

  const { data: marginInfo } = useGetMarginDataQuery(undefined);
  const pageMargin = marginInfo?.data?.value
    ?.split(",")
    .map((val: string) => Number(val.trim()));

  useEffect(() => {
    const generateHeader = async () => {
      const header = await FinancialReportHeaderGenerator(comapnyInfo?.data);
      setInfoHeader(header);
    };

    if (comapnyInfo?.data) {
      generateHeader();
    }
  }, [comapnyInfo]);

  const generatePDF = () => {
    const documentDefinition: any = {
      pageOrientation: "landscape",
      defaultStyle: { fontSize: 12 },
      pageMargins: infoHeader ? [20, 20, 20, 20] : pageMargin,
      content: [
        ...(infoHeader || []),
        {
          text: `${title}: Between ${
            startDate ? formatDateString(startDate) : "N/A"
          } to ${endDate ? formatDateString(endDate) : "N/A"}`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        ...data.flatMap((group) => [
          {
            text: `${group._id}`,
            style: "groupHeader",
            margin: [0, 10, 0, 5],
          },
          {
            table: {
              widths: new Array(columns.length).fill("*"),
              headerRows: 1,
              body: [
                columns.map((col) => ({
                  text: col.label,
                  style: "tableHeader",
                })),
                ...group.patients.map((record) =>
                  columns.map((col) => record[col.field] ?? "")
                ),
                [
                  {
                    text: "Total",
                    colSpan: columns.length - 1,
                    alignment: "center",
                    bold: true,
                  },
                  ...new Array(columns.length - 2).fill({}),
                  { text: group?.count ?? 0, bold: true },
                ],
              ],
            },
            margin: [0, 0, 0, 10],
          },
        ]),
      ],
      styles: {
        header: { fontSize: 16, bold: true },
        subheader: { fontSize: 12, italics: true, color: "red" },
        groupHeader: { fontSize: 12, bold: true },
        tableHeader: { bold: true, fillColor: "#eeeeee", alignment: "center" },
      },
    };

    pdfMake.createPdf(documentDefinition).print();
  };

  return (
    <div className="p-5">
      <div className="text-center mb-10 flex flex-col items-center">
        {comapnyInfo?.data?.photoUrl && (
          <div className="flex items-center gap-3 mb-3">
            <Image
              src={comapnyInfo.data.photoUrl}
              alt="Logo"
              width={50}
              height={50}
            />
            <h2 className="text-xl font-bold">{comapnyInfo.data.name}</h2>
          </div>
        )}
        <p>{comapnyInfo?.data?.address}</p>
        <p>HelpLine: {comapnyInfo?.data?.phone} (24 Hours Open)</p>
        <p className="italic text-red-600 font-semibold mt-2">
          {title}: Between {startDate ? formatDateString(startDate) : "N/A"} to{" "}
          {endDate ? formatDateString(endDate) : "N/A"}
        </p>
      </div>

      {/* Table */}
      <div className="w-full">
        <div
          className={`grid grid-cols-${columns.length} bg-gray-100 font-semibold text-center p-2`}
        >
          {columns.map((col, i) => (
            <div key={i}>{col.label}</div>
          ))}
        </div>

        {data.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-8">
            <div className="text-lg font-semibold p-2">{group._id}</div>
            <div className="w-full border-t">
              {group.patients.map((record, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-${columns.length} text-center p-2 border-b`}
                >
                  {columns.map((col, j) => (
                    <div key={j}>
                      {col.render ? col.render(record) : record[col.field]}
                    </div>
                  ))}
                </div>
              ))}
              <div className="grid grid-cols-6 text-center p-2 border-t font-semibold bg-gray-200">
                <div>Total</div>
                <div>{group.count}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={generatePDF}
        className="bg-blue-600 px-4 py-2 rounded-md text-white font-semibold mt-4"
      >
        Print
      </button>
    </div>
  );
};

export default AdmitOverPeriodTable;
