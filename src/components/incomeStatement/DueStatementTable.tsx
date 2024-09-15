"use client";
import React, { useRef } from "react";
import { formatDateString } from "@/utils/FormateDate";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import test from "node:test";
import { color } from "html2canvas/dist/types/css/types/color";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

type TData = {
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
  vat: number;
  testDetails?: TTest[];
};

type TTest = {
  label: string;
  price: number;
};

type TGroup = {
  data: TData[];
};

const DueStatemnetTable: React.FC<TGroup> = ({ data }) => {
  const generatePDF = () => {
    const documentDefinition: any = {
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 12,
      },
      pageMargins: [20, 20, 20, 20],
      content: [
        // Header Section
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
        },
        {
          text: ` 
          Statement Of Investigate of Due Bill : ${data[0]?.createdAt.slice(
            0,
            10
          )}`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 20],
          color: "red",

          italic: true,
        },

        // Static Table Header for PDF
        {
          table: {
            widths: [60, "*", 60, 60, 60], // Adjust the widths as per your column needs
            body: [
              [
                {
                  text: "Bill No",
                  style: "tableHeader",
                  border: [true, true, true, true],
                },
                {
                  columns: [
                    {
                      text: "Patient Name",
                      alignment: "left",
                      width: "*",
                    },
                    {
                      text: "Refd By",
                      alignment: "right",
                      width: "*",
                    },
                  ],
                  columnGap: 10,
                  style: "tableHeader",
                  border: [true, true, true, true],
                },

                {
                  text: "Total + Vat",
                  style: "tableHeader",
                  border: [true, true, true, true],
                },
                {
                  text: "Amount Paid",
                  style: "tableHeader",
                  border: [true, true, true, true],
                },
                {
                  text: "Due",
                  style: "tableHeader",
                  border: [true, true, true, true],
                },
              ],
            ],
          },
          margin: [0, 0, 0, 0],
        },

        // Dynamic Table Rows from data
        ...data.map((item) => [
          {
            table: {
              widths: [60, "*", 60, 60, 60],
              body: [
                [
                  { text: item?.oid, border: [true, false, true, true] }, // Bill No
                  {
                    columns: [
                      {
                        text: item?.patientData?.name,
                        alignment: "left",
                        width: "*",
                      },
                      {
                        text: item?.refBy?.name,

                        fontSize: 10,
                        alignment: "right",
                        width: "*",
                      },
                    ],
                    columnGap: 10,
                    border: [false, false, true, true],
                  },

                  // Patient Name & Refd By (flex row in one column)
                  {
                    text: item?.totalPrice + item?.vat,
                    border: [false, false, true, true],
                  }, // Total + Vat
                  { text: item?.paid, border: [false, false, true, true] }, // Amount Paid
                  { text: item?.dueAmount, border: [false, false, true, true] }, // Due
                ],
              ],
            },
            margin: [0, 0, 0, 0],
          },

          {
            table: {
              widths: [60, "*", 60, 60, 60], // Adjust the widths as per your column needs
              body: item?.testDetails?.map((testItem) => [
                { text: "", border: [true, false, false, false] },
                {
                  stack: [
                    {
                      text: testItem?.label,
                      alignment: "left",
                    }, // Test name
                    {
                      text: testItem?.price,
                      alignment: "center",
                    }, // Test price
                  ],
                  border: [true, false, true, false],
                },
                { text: "", border: [false, false, true, false] },
                { text: "", border: [false, false, true, false] },
                { text: "", border: [false, false, true, false] },
              ]),
            },

            margin: [0, 0, 0, 0],
          },

          // Footer1
          {
            table: {
              widths: [60, "*", 60, 60, 60],
              body: [
                [
                  {
                    text: item?.createdAt.slice(0, 10),
                    alignment: "left",
                    border: [true, true, true, true],
                  }, // Date
                  { text: "", colSpan: 1, border: [true, true, true, true] }, // Empty Column
                  {
                    text: item?.totalPrice + item?.vat,
                    border: [true, true, true, true],
                  }, // Total
                  { text: item?.paid, border: [true, true, true, true] }, // Amount Paid
                  { text: item?.dueAmount, border: [true, true, true, true] }, // Due
                ],
              ],
            },
            margin: [0, 0, 0, 0],
          },
          // 2
          {
            table: {
              widths: [60, "*", 60, 60, 60],
              body: [
                [
                  {
                    text: "",
                    alignment: "left",
                    border: [true, false, true, true],
                  }, // Date
                  {
                    text: "Others",
                    colSpan: 1,
                    border: [true, false, true, true],
                  }, // Empty Column
                  {
                    text: item?.totalPrice + item?.vat,
                    border: [true, false, true, true],
                  }, // Total
                  { text: item?.paid, border: [true, false, true, true] }, // Amount Paid
                  { text: item?.dueAmount, border: [true, false, true, true] }, // Due
                ],
              ],
            },
            margin: [0, 0, 0, 0],
          },

          // 3

          {
            table: {
              widths: [60, "*", 60, 60, 60],
              body: [
                [
                  {
                    text: "GT.1",
                    alignment: "left",
                    border: [true, false, true, true],
                  },
                  { text: "", colSpan: 1, border: [true, false, true, true] },
                  {
                    text: item?.totalPrice + item?.vat,
                    border: [true, false, true, true],
                  },
                  { text: item?.paid, border: [true, false, true, true] },
                  { text: item?.dueAmount, border: [true, false, true, true] },
                ],
              ],
            },
            margin: [0, 0, 0, 0],
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
        <p className="text-red-600 italic">
          Statement Of Investigate of Due Bill :{" "}
          {data[0]?.createdAt.slice(0, 10)}{" "}
        </p>
      </div>

      <div className="w-full">
        {/* Table Header */}
        <div className="grid grid-cols-7 bg-gray-100 font-semibold text-center border px-2 border-black">
          <div className="w-28 border-e border-black ">Bill No</div>
          <div className="col-span-3 text-center border-e border-black">
            Patient Name <span className="mx-24"></span> Refd By
          </div>
          <div className="w-32 text-center border-e border-black">
            Total + Vat
          </div>
          <div className="w-28 text-center border-e border-black">
            Amount Paid
          </div>
          <div className="w-24 text-center">Due</div>
        </div>

        {/* Table Body */}
        {data.map((item) => (
          <div key={item._id} className="">
            {/* Table Row */}
            <div className="grid grid-cols-7 gap-5 text-sm px-2 w-full items-center border-x border-black   ">
              {/* Bill No */}
              <div className="w-28  ">{item?.oid}</div>

              <div className="flex justify-between col-span-3   ">
                <p className="">{item?.patientData?.name}</p>
                <p className=" text-gray-600 ">{item?.refBy?.name}</p>
              </div>

              {/* Total + Vat */}
              <div className="w-20 text-center">
                {item?.totalPrice + item?.vat}
              </div>

              {/* Amount Paid */}
              <div className="w-28 text-center">{item?.paid}</div>

              {/* Due */}
              <div className="w-24 text-center">{item?.dueAmount}</div>
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

            {/* footer */}
            {/* footer 1 */}
            <div className="grid grid-cols-7 px-2 border-x  border-black">
              <div className="border-e border-black py-1">
                {item?.createdAt.slice(0, 10)}
              </div>
              <div className="col-span-3 border-e pe-2 border-black"></div>
              <div className="text-fuchsia-800 text-center font-bold border-e border-black">
                {item?.totalPrice + item?.vat}
              </div>
              <div className="text-fuchsia-800 text-center font-bold border-e border-black">
                {item?.paid}
              </div>
              <div className="text-fuchsia-800 text-center font-bold ">
                {item?.dueAmount}
              </div>
            </div>
            {/* footer 2 */}

            <div className="grid grid-cols-7 px-2 border-x border-t  border-black">
              <div className="border-e border-black py-1"></div>
              <div className="col-span-3 border-e pe-2 border-black text-end font-bold text-fuchsia-900">
                Others
              </div>
              <div className="text-fuchsia-800 text-center font-bold border-e border-black">
                {item?.totalPrice + item?.vat}
              </div>
              <div className="text-fuchsia-800 text-center font-bold border-e border-black">
                {item?.paid}
              </div>
              <div className="text-fuchsia-800 text-center font-bold ">
                {item?.dueAmount}
              </div>
            </div>

            {/* footer 3 */}

            <div className="grid grid-cols-7 text-red-800 px-2 border  border-black">
              <div className="border-e border-black py-1 font-bold">GT.1</div>
              <div className="col-span-3 border-e pe-2 border-black"></div>
              <div className="text-center font-bold border-e border-black">
                {item?.totalPrice + item?.vat}
              </div>
              <div className="text-center font-bold border-e border-black">
                {item?.paid}
              </div>
              <div className="text-center font-bold ">{item?.dueAmount}</div>
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

export default DueStatemnetTable;
