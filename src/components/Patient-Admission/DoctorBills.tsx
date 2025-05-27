import React, { useEffect, useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Button } from "rsuite";
import { useGetDefaultQuery } from "@/redux/api/companyInfo/companyInfoSlice";
import { FinancialReportHeaderGenerator } from "../financialStatment/HeaderGenerator";
import { useGetMarginDataQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";


pdfMake.vfs = pdfFonts.pdfMake.vfs;

const DoctorBills = ({ data }: { data: any }) => {
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
      assignDoct,
      name,
      age,
      gender,
      guradin,
      totalPaid,
      admissionDate,
      releaseDate,
      bedName,
      refDoct,
    } = patient;

    // Calculate the Grand Total
    const grandTotal = data.reduce(
      (total: any, item: any) => total + item.totalAmount,
      0
    );

    // Build detailed service rows
    const documentDefinition: any = {
      pageMargins: infoHeader ? [40, 60, 40, 100] : pageMargin,
      content: [
        ...(infoHeader || []),
        {
          text: "Doctor BILL",
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
                  text: [{ text: "BillNo: ", bold: true }, regNo || "N/A"],
                },
                {
                  text: [{ text: "Age: ", bold: true }, age || "N/A"],
                },
                {
                  text: [{ text: "Sex: ", bold: true }, gender || "N/A"],
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
              text: [
                { text: "Guardian’s Name: ", bold: true },
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

        {
          table: {
            widths: ["*", "*", "*", "auto", "auto"],
            body: [
              [
                { text: "Particular", bold: true },
                { text: "Doctor", bold: true },
                { text: "Qty", bold: true },
                { text: "Amount", bold: true },
                { text: "Total", bold: true },
              ],
              // Table Body Rows
              ...data.map((item: any) => [
                item.visitType,
                item.doctorName,
                item.quantity.toString(),
                item.amount.toString(),
                item.totalAmount.toString(),
              ]),
              // Add a row for the Grand Total
              [
                {
                  text: "Grand Total",
                  colSpan: 4,
                  alignment: "right",
                  bold: true,
                },
                {},
                {},
                {},
                { text: grandTotal.toFixed(2), bold: true },
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
                  text: grandTotal.toFixed(2) - totalPaid,
                  bold: true,
                  fontSize: 12,
                  color: "red",
                },
              ],
            ],
          },
          layout: "lightHorizontalLines",
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
        appearance="ghost"
        color="cyan"
        onClick={generateHospitalBillPDF}
      >
        {" "}
        Doctor Bill{" "}
      </Button>
    </div>
  );
};

export default DoctorBills;
