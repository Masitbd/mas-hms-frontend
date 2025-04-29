import React, { useEffect, useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Button } from "rsuite";
import { useGetDefaultQuery } from "@/redux/api/companyInfo/companyInfoSlice";
import { FinancialReportHeaderGenerator } from "../financialStatment/HeaderGenerator";
import { useGetMarginDataQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";
import { convertNumberToWords } from "@/utils/convertnumberToword";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const HospitalBillDetails = ({ data }: { data: any }) => {
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
      setInfoHeader(header);
    };

    if (comapnyInfo?.data) {
      generateHeader();
    }
  }, [comapnyInfo, data]);

  const { data: marginInfo } = useGetMarginDataQuery(undefined);
  const pageMargin = marginInfo?.data?.value
    ?.split(",")
    .map((val: string) => Number(val.trim())) || [40, 60, 40, 100];

  const generateHospitalBillPDF = () => {
    const patient = data?.[0];
    const {
      regNo,
      name,
      guradin,
      admissionDate,
      releaseDate,
      bedName,
      bedCharge = 0,
      general = 0,
      refDoct,
      gender,
      totalPaid,
      groupedServices = [],
    } = patient;

    // Build detailed service rows
    const serviceRows: any[] = [];

    groupedServices.forEach((group: any) => {
      // Add group/category title row
      serviceRows.push([
        {
          text: group.category || "N/A",
          colSpan: 5,
          bold: true,
          fillColor: "#eeeeee",
          margin: [0, 5],
        },
        {},
        {},
        {},
        {},
      ]);

      // Now add all services under this group
      group.services.forEach((service: any) => {
        serviceRows.push([
          { text: service.name || "N/A" },
          {
            text: new Date(service.date).toLocaleDateString("en-GB"),
          },
          { text: service.serviceAmount.toFixed(2) },
          { text: service.quantity },
          { text: service.total.toFixed(2) },
        ]);
      });
    });

    if (general) {
      serviceRows.push([
        { text: "General Charge" },
        { text: new Date(admissionDate).toLocaleDateString("en-GB") },
        { text: general.toFixed(2) },
        { text: "1" },
        { text: general.toFixed(2) },
      ]);
    }

    if (bedCharge) {
      serviceRows.push([
        { text: "Bed Charge" },
        { text: new Date(admissionDate).toLocaleDateString("en-GB") },
        { text: bedCharge.toFixed(2) },
        { text: "1" },
        { text: bedCharge.toFixed(2) },
      ]);
    }

    const totalAmount =
      groupedServices.reduce(
        (sum: number, group: any) =>
          sum +
          group.services.reduce((s: number, item: any) => s + item.total, 0),
        0
      ) +
      general +
      bedCharge;

    const documentDefinition: any = {
      pageMargins: infoHeader ? [40, 60, 40, 100] : pageMargin,
      content: [
        ...(infoHeader || []),
        {
          text: "HOSPITAL BILL",
          bold: true,
          fontSize: 12,
          alignment: "center",
          color: "red",
          margin: [0, 0, 0, 10],
          decoration: "underline",
        },
        {
          stack: [
            {
              columns: [
                {
                  text: [{ text: "RegNo: ", bold: true }, regNo || "N/A"],
                },
                {
                  text: [{ text: "Gender: ", bold: true }, gender || "N/A"],
                },
                {
                  text: [{ text: "Cabin/Bed: ", bold: true }, bedName || "N/A"],
                  alignment: "right",
                },
              ],
              margin: [0, 0, 0, 5],
            },
            {
              text: [{ text: "Patient Name: ", bold: true }, name || "N/A"],
              margin: [0, 0, 0, 5],
            },
            {
              text: [{ text: "Father’s Name: ", bold: true }, guradin || "N/A"],
              margin: [0, 0, 0, 5],
            },
            {
              text: [{ text: "Referred By: ", bold: true }, refDoct || "N/A"],
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

        {
          table: {
            widths: ["30%", "20%", "15%", "15%", "20%"],
            body: [
              [
                { text: "Particulars", bold: true },
                { text: "Date", bold: true },
                { text: "Rate", bold: true },
                { text: "Quantity", bold: true },
                { text: "Amount", bold: true },
              ],
              ...serviceRows,
              [
                { text: "Total", colSpan: 4, alignment: "right", bold: true },
                {},
                {},
                {},
                { text: totalAmount.toFixed(2), bold: true },
              ],
              [
                {
                  text: `In words : ${convertNumberToWords(totalAmount)} Only`,
                  colSpan: 5,
                  italics: true,
                },
                {},
                {},
                {},
                {},
              ],
              [
                { text: "Add VAT @ 0.00%", colSpan: 4, alignment: "right" },
                {},
                {},
                {},
                "0.00",
              ],
              [
                {
                  text: "Grand Total",
                  colSpan: 4,
                  alignment: "right",
                  bold: true,
                  fontSize: 12,
                },
                {},
                {},
                {},
                { text: totalAmount.toFixed(2), bold: true, fontSize: 12 },
              ],
              [
                {
                  text: "Total Paid",
                  colSpan: 4,
                  alignment: "right",
                  bold: true,
                  fontSize: 12,
                },
                {},
                {},
                {},
                { text: totalPaid, bold: true, fontSize: 12 },
              ],
              [
                {
                  text: "Due Amount",
                  colSpan: 4,
                  alignment: "right",
                  bold: true,
                  fontSize: 12,
                },
                {},
                {},
                {},
                {
                  text: totalAmount.toFixed(2) - totalPaid,
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

      footer: function (currentPage: number, pageCount: number) {
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
        appearance="primary"
        onClick={generateHospitalBillPDF}
      >
        {" "}
        Hospital Bill Details{" "}
      </Button>
    </div>
  );
};

export default HospitalBillDetails;
