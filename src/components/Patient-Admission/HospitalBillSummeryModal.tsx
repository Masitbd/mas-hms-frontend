import React, { useEffect, useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Button } from "rsuite";
import { useGetDefaultQuery } from "@/redux/api/companyInfo/companyInfoSlice";
import { FinancialReportHeaderGenerator } from "../financialStatment/HeaderGenerator";
import { useGetMarginDataQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";
import { convertNumberToWords } from "@/utils/convertnumberToword";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const HospitalBillSummeryModal = ({ data }: { data: any }) => {
  const { data: comapnyInfo } = useGetDefaultQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const [infoHeader, setInfoHeader] = useState<
    null | { text?: string; image?: string }[]
  >(null);

  useEffect(() => {
    const generateHeader = async () => {
      const header = await FinancialReportHeaderGenerator(comapnyInfo?.data);
      // console.log("Generated Header:", header);
      setInfoHeader(header);
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

  const generateHospitalBillPDF = () => {
    const patient = data?.[0];
    // console.log(patient, "patent");
    const {
      regNo,
      name,
      age,
      gender,
      guradin,
      totalPaid,
      admissionDate,
      releaseDate,
      bedName,
      bedCharge,
      assignDoct,
      refDoct,
      general,
      serviceSummary,
    } = patient;

    // Build the service rows dynamically
    const serviceRows = serviceSummary.map((item: any) => [
      item.category,
      new Date(admissionDate).toLocaleDateString("en-GB"),
      item.total.toFixed(2),
    ]);

    if (general) {
      serviceRows.push([
        "General Charge",
        new Date(admissionDate).toLocaleDateString("en-GB"),
        general.toFixed(2),
      ]);
    }

    if (bedCharge) {
      serviceRows.push([
        "Bed Charge",
        new Date(admissionDate).toLocaleDateString("en-GB"),
        bedCharge.toFixed(2),
      ]);
    }

    const totalAmount =
      serviceSummary.reduce(
        (acc: any, item: { total: number }) => acc + item.total,
        0
      ) +
      (general || 0) +
      (bedCharge || 0);

    // Calculate due amount directly as a number
    const dueAmount = totalAmount - (totalPaid || 0);

    const documentDefinition: any = {
      pageMargins: infoHeader ? [40, 60, 40, 100] : pageMargin,
      content: [
        // Header
        ...(infoHeader || []),
        {
          text: "HOSPITAL BILL Summery",
          bold: true,
          fontSize: 12,
          alignment: "center",
          color: "red",
          margin: [0, 0, 0, 10],
          decoration: "underline",
        },

        // Patient Info
        {
          stack: [
            {
              columns: [
                {
                  width: "25%",
                  columns: [
                    { text: "BillNo: ", bold: true, width: "auto" },
                    { text: regNo || "N/A", width: "*" },
                  ],
                },

                // age
                {
                  width: "25%",
                  columns: [
                    { text: "Age: ", bold: true, width: "auto" },
                    {
                      text: age || "N/A",
                      width: "*",
                    },
                  ],
                },

                // gender
                {
                  width: "25%",
                  columns: [
                    { text: "Sex: ", bold: true, width: "auto" },
                    {
                      text: gender || "N/A",
                      width: "*",
                    },
                  ],
                },

                {
                  width: "25%",
                  columns: [
                    { text: "Cabin/Bed: ", bold: true, width: "auto" },
                    {
                      text: bedName || "N/A",
                      width: "*",
                    },
                  ],
                },
              ],
              margin: [0, 0, 0, 5],
            },
            {
              text: [{ text: "Patient Name: ", bold: true }, name || "N/A"],
              margin: [0, 0, 0, 5],
            },
            {
              text: [
                { text: "Guardian's Name: ", bold: true },
                guradin || "N/A",
              ],
              margin: [0, 0, 0, 5],
            },
            {
              text: [
                { text: "Conslt By: ", bold: true },
                assignDoct || "N/A",
                { text: "          " }, // Adding multiple spaces
                Array.isArray(refDoct) ? refDoct.join(", ") : refDoct || "N/A",
              ],

              margin: [0, 0, 0, 5],
            },
            {
              columns: [
                {
                  text: [
                    { text: "Date of Admission: ", bold: true },
                    admissionDate
                      ? new Date(admissionDate).toLocaleString()
                      : "N/A",
                  ],
                  width: "50%",
                },
                {
                  text: [
                    { text: "Date of Release: ", bold: true },
                    releaseDate
                      ? new Date(releaseDate).toLocaleString()
                      : "N/A",
                  ],
                  width: "50%",
                  alignment: "right",
                },
              ],
              margin: [0, 0, 0, 5],
            },
          ],
        },

        // Charges Table
        {
          table: {
            widths: ["50%", "25%", "25%"],
            body: [
              [
                { text: "Particulars", bold: true },
                { text: "Date Upto", bold: true },
                { text: "Total", bold: true },
              ],
              ...serviceRows,
              [
                { text: "Total", colSpan: 2, alignment: "right", bold: true },
                {},
                { text: totalAmount.toFixed(2), bold: true },
              ],
              [
                {
                  text: `In words : ${convertNumberToWords(totalAmount)} Only`,
                  colSpan: 3,
                  italics: true,
                },
                {},
                {},
              ],
              [
                { text: "Add VAT @ 0.00%", colSpan: 2, alignment: "right" },
                {},
                "0.00",
              ],
              [
                {
                  text: "Grand Total",
                  colSpan: 2,
                  alignment: "right",
                  bold: true,
                  fontSize: 12,
                },
                {},
                { text: totalAmount.toFixed(2), bold: true, fontSize: 12 },
              ],
              [
                {
                  text: "Total Paid",
                  colSpan: 2,
                  alignment: "right",
                  bold: true,
                  fontSize: 12,
                },
                {},
                {
                  text: totalPaid ? totalPaid.toFixed(2) : "0.00",
                  bold: true,
                  fontSize: 12,
                },
              ],
              [
                {
                  text: "Due Amount",
                  colSpan: 2,
                  alignment: "right",
                  bold: true,
                  fontSize: 12,
                },
                {},
                {
                  text: dueAmount.toFixed(2), // Use pre-calculated dueAmount
                  bold: true,
                  fontSize: 12,
                  color: "red",
                },
              ],
            ],
          },
          margin: [0, 10],
        },
      ],

      footer: function (currentPage: number, pageCount: any) {
        return [
          {
            columns: [
              {
                text: "ACCOUNTANT",
                alignment: "center",
                margin: [0, 40, 0, 0],
              },
              {
                text: "ACCOUNTS OFFICER",
                alignment: "center",
                margin: [0, 40, 0, 0],
              },
            ],
          },
          {
            columns: [
              {
                text: new Date().toLocaleString(),
                fontSize: 9,
              },
              {
                text: "P.T.O.",
                alignment: "center",
                fontSize: 9,
              },
              {
                text: `${currentPage}`,
                alignment: "right",
                fontSize: 9,
              },
            ],
            margin: [40, 10, 40, 0],
          },
        ];
      },
    };

    pdfMake.createPdf(documentDefinition).print();
  };
  return (
    <div>
      <Button
        className="w-48 h-11"
        appearance="ghost"
        color="blue"
        onClick={generateHospitalBillPDF}
      >
        {" "}
        Hospital Bill Summery{" "}
      </Button>
    </div>
  );
};

export default HospitalBillSummeryModal;
