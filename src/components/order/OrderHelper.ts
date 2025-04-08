import CompanyInfo from "@/app/(withlayout)/companyInfo/page";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ToWords } from "to-words";
import { TDocumentDefinitions } from "pdfmake/interfaces";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const numberToWord = new ToWords({
  localeCode: "en-BD",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  },
});
export const printInvoice = async ({
  companyInfo,
  data,
}: {
  companyInfo: any;
  data: any;
}) => {
  var dd = {
    pageSize: "A5", // Set page size to A4
    pageMargins: [20, 10, 20, 50],
    footer: {
      stack: [
        { text: "" },

        {
          columns: [
            {
              stack: [
                {
                  text: "It is our pride to be able to serve you",
                  margin: [20, 0, 0, 0],
                },
                {
                  image: "provarbNote",
                  margin: [20, 0, 0, 0],
                  fit: [250, 10],
                },
              ],
              width: "60%",
              fontSize: 10,
            },

            {
              stack: [
                { text: data?.postedBy?.name },
                { text: "Desk Incharge", bold: true },
              ],
              alignment: "right",
              margin: [20, 0],
              width: "40%",
              fontSize: 10,
            },
          ],
        },
        {
          image: "deliveryNotice",
          margin: [20, 0],
          alignment: "center",
          fit: [250, 30],
        },
        {
          text: "Software Developed by MAS IT Solutions, Contact : 48039757, 01915682291, 01714589268",
          fontSize: 8,
          margin: [20, 0],
          alignment: "center",
          color: "#7d7d7c",
        },
      ],
    },

    content: [
      {
        table: {
          widths: ["15%", "80%"],
          body: [
            [
              {
                image: "logo",
                fit: [60, 60],
              },
              [
                {
                  text: companyInfo?.data?.name ?? " ",
                  style: "header",
                  alignment: "center",
                  margin: [0, 5, 0, 0],
                },
                {
                  text: companyInfo?.data?.address ?? " ",
                  style: "subheader",
                  alignment: "center",
                },
                {
                  text: companyInfo?.data?.phone ?? " ",
                  style: "subheader",
                  alignment: "center",
                },
              ],
            ],
          ],
        },
        layout: "noBorders",
      },
      {
        table: {
          widths: ["*"],

          headerRows: 1,
          body: [[{ text: "", border: [false, false, false, true] }]],
        },
      },
      // Patient Information

      {
        text: "Investigation Cash Copy",
        alignment: "center",
        bold: true,
        fontSize: 14,
        decoration: "underline",
      },

      {
        columns: [
          [
            {
              text: [{ text: "Order ID: ", bold: true }, data?.oid],
              style: "info",
            },
            {
              text: [
                { text: "Patient Id: ", bold: true },
                data?.uuid ? data?.uuid : "N/A",
              ],
              style: "info",
            },
            {
              text: [{ text: "Patient Name: ", bold: true }, data?.name],
              style: "info",
            },
            {
              text: [
                { text: "Address: ", bold: true },
                data?.address ? data?.address : "N/A",
              ],
              style: "info",
            },
            {
              text: [
                { text: "Consultant: ", bold: true },
                data.consultant ? data.consultant : "N/A",
              ],
              style: "info",
            },
          ],
          [
            {
              text: [{ text: "Billing Date: ", bold: true }, data.createdAt],
              style: "info",
              alignment: "right",
            },
            {
              text: [
                { text: "Age: ", bold: true },
                data.age ? data.age : "N/A",
              ],
              style: "info",
              alignment: "right",
            },
            {
              text: [
                { text: "Sex: ", bold: true },
                data.sex ? data.sex : "N/A",
              ],
              style: "info",
              alignment: "right",
            },
            {
              text: [
                { text: "Phone: ", bold: true },
                data.phone ? data.phone : "N/A",
              ],
              style: "info",
              alignment: "right",
            },
          ],
        ],
        margin: [0, 5],
      },
      // Table of Items/Tests
      {
        table: {
          headerRows: 1,
          widths: ["10%", "50%", "20%", "20%"],
          body: [
            // Header Row
            [
              { text: "SL", style: "tableHeader" },
              { text: "Test Name", style: "tableHeader" },

              { text: "Report Delivery", style: "tableHeader" },
              { text: "Test Rate", style: "tableHeader" },
            ],
            // Data Rows
            ...data.items.map((item: any) => [
              item.SL,
              item.name,

              item?.deliveryDate,
              item.price, // Using createdAt as delivery date, similar to OCR sample
            ]),
          ],
        },
        margin: [0, 5],
        style: "testTable",
      },

      // Totals Section
      // Totals Section
      {
        columns: [
          {
            stack: [
              {
                table: {
                  widths: ["*"],
                  body: [
                    [
                      {
                        text: data?.isFree
                          ? "Free Patient"
                          : data?.isWatermark
                          ? "DUE"
                          : "PAID",
                        alignment: "center",
                        fontSize: 20,
                        bold: true,
                        margin: [0, 10],
                      },
                    ],
                  ],
                },
              },
            ],
            width: "40%",
          },
          {
            stack: [
              // sub total
              {
                text: [{ text: "Subtotal: " }],
                style: "totalText",
              },

              // refund
              data?.grossRefundAmount
                ? {
                    text: [{ text: "Refunded: " }],
                    style: "totalText",
                  }
                : {},

              //Discount
              {
                text: `Discount (${data?.parcentDiscount}%):`,
                style: "totalText",
              },
              {
                text: [{ text: `VAT (${data?.vat}%): ` }],
                style: "totalText",
              },
              {
                text: [{ text: "Net Price: " }],
                style: "totalText",
              },

              {
                text: [{ text: "Paid: " }],
                style: "totalText",
              },

              data?.refundApplied
                ? {
                    text: [{ text: "Refunded: " }],
                    style: "totalText",
                  }
                : {},

              data?.remainingRefund
                ? {
                    text: [{ text: "Cash Refund : " }],
                    style: "totalText",
                  }
                : {},
              {
                table: {
                  widths: ["*"],

                  headerRows: 1,
                  body: [[{ text: "", border: [false, false, false, true] }]],
                },
                margin: [80, 0, 0, 0],
              },
              {
                text: [{ text: "Due: " }],
                style: "totalText",
              },
            ],
            width: "40%",
            alignment: "right",
          },
          {
            stack: [
              {
                text: [{ text: data.total }],
              },
              {
                text: [{ text: data.discount }],
              },
              {
                text: [{ text: data.vatAmount }],
              },
              {
                text: [{ text: data.netPrice }],
              },
              {
                text: [{ text: `(${data.paid})` }],
              },

              data?.refundApplied
                ? {
                    text: [{ text: `${data.refundApplied}` }],
                  }
                : {},

              data?.remainingRefund
                ? {
                    text: [{ text: `${data.remainingRefund}` }],
                  }
                : {},
              {
                table: {
                  widths: ["*"],

                  headerRows: 1,
                  body: [[{ text: "", border: [false, false, false, true] }]],
                },
              },
              {
                text: [{ text: data.dueAmount }],
              },
            ],

            alignment: "right",
            width: "20%",
            style: "amountText",
          },
        ],
      },

      {
        text: `Amount In Word: ${numberToWord.convert(data?.netPrice)}`,
        style: "info",
      },

      {
        text: `Delivery Date :${data?.deliveryDate}`,
        style: "info",
      },
      {
        text: `Delivery Time:${data?.deliveryTime}`,
        style: "info",
      },

      // Room names
      data?.roomNames?.length
        ? {
            table: {
              widths: data?.roomNames?.map((rn: any) => "auto"),
              body: [
                [
                  ...data?.roomNames?.map((rn: any) => ({
                    text: rn?.roomName,
                    alignment: "center",

                    bold: true,
                  })),
                ],
                [
                  ...data?.roomNames?.map((rn: any) => ({
                    text: rn?.roomNo,
                    alignment: "center",

                    bold: true,
                  })),
                ],
              ],
            },
            margin: [0, 10],
          }
        : {},
    ],
    styles: {
      amountText: { fontSize: 9 },
      testTable: { fontSize: 9 },
      header: { fontSize: 16, bold: true },
      subheader: { fontSize: 10 },
      title: { fontSize: 12, bold: true },
      info: { fontSize: 9, margin: [0, 1] },
      tableHeader: {
        fontSize: 9,
        bold: true,
        fillColor: "#f2f2f2",
        alignment: "center",
      },
      footer: { fontSize: 10, italics: true },
      totalText: {
        fontSize: 9,
        bold: true,
      },
    },
    images: {
      logo: companyInfo?.data?.photoUrl,
      deliveryNotice:
        "https://res.cloudinary.com/dfnp7ac6l/image/upload/v1744009021/5bfa98fb23111ff281ed84a598a39451_lsm3fj.png",
      provarbNote:
        "https://res.cloudinary.com/dfnp7ac6l/image/upload/v1744009095/ca643631abb813461b4b0afeb77c4633_wczg9c.png",
    },
  };

  pdfMake.createPdf(dd as unknown as TDocumentDefinitions).print();
};
