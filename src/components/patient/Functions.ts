import { IPatient } from "@/types/allDepartmentInterfaces";
import JsBarcode from "jsbarcode";
import { toaster } from "rsuite";
import { TransactionRecord } from "./Types";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { pdfPrintingHelper } from "@/utils/PdfPrintingHelper";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const pdfDataProvider = (params: IPatient) => {
  const regDate = new Date(params.createdAt).toLocaleDateString();

  const canvas = document.createElement("canvas");

  // Generate the barcode on the canvas
  JsBarcode(canvas, params.uuid, { format: "CODE128", height: 50 });

  // Convert the canvas to a PNG Data URI
  const pngDataUri = canvas.toDataURL("image/png");
  const data = {
    pageSize: { width: 85.6, height: 54 }, // Credit card size in mm
    pageMargins: [2, 2, 2, 2], // Very small margins
    content: [
      {
        columns: [
          {
            stack: [
              {
                text: [{ text: "ID: ", bold: true }, `${params.uuid}`],
                style: "infoText",
              },
              {
                text: [{ text: "Name:", bold: true }, `${params.name}`],
                style: "infoText",
              },
              params.fatherName && {
                text: [
                  { text: "Father Name: ", bold: true },
                  `${params.fatherName}`,
                ],
                style: "infoText",
              },
              {
                text: [
                  { text: "Age: ", bold: true },
                  `${params.age}`,
                  "    ",
                  {
                    text: [{ text: "Sex: ", bold: true }, `${params.gender}`],
                    style: "infoText",
                  },
                ],
                style: "infoText",
              },
              {
                text: [{ text: "Reg. Date: ", bold: true }, `${regDate}`],
                style: "infoText",
              },
              {
                text: [{ text: "Phone: ", bold: true }, `${params?.phone}`],
                style: "infoText",
              },
            ],
            width: "60%",
            margin: [0, 5, 0, 0],
          },
          {
            stack: [
              params?.image && {
                image: "profile", // Replace with actual image data
                fit: [30, 30],
              },

              {
                image: "barcode", // Replace with actual barcode data
                fit: [20, 20],
              },
            ],
            width: "40%",
            alignment: "center",
            margin: [0, 5, 0, 0],
          },
        ],
      },
    ],
    styles: {
      infoText: { fontSize: 3, margin: [0, 1, 0, 1] }, // Smaller font and tighter spacing
      barcodeText: { fontSize: 4, bold: true }, // Reduced barcode font size
    },
    images: {
      profile:
        params?.image ??
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIhSZ-qS2R8CNzi4OU1QedIvueCm_Uupgvkg&s",
      barcode: pngDataUri,
    },
  };

  return data;
};

export const printOrderSummery = (data: {
  patientInfo: IPatient;
  orders: TransactionRecord[];
}) => {
  const totalValue = data.orders.reduce(
    (sum, record) => sum + record.netPayable,
    0
  );
  const totalPaid = data.orders.reduce(
    (sum, record) =>
      sum +
      record.transactions.reduce(
        (tSum, t) => (t.transactionType === "debit" ? tSum + t.amount : tSum),
        0
      ),
    0
  );
  const totalDue = totalValue - totalPaid;
  const dd = {
    content: [
      {
        text: "Order Summery",
        bold: true,
        fontSize: 20,
        alignment: "center",
        decoration: "underline",
        margin: [0, 10, 0, 5],
      },
      {
        columns: [
          {
            width: "*",
            text: `Customer Name: ${data?.patientInfo.name}`,
          },
          {
            width: "*",
            text: `ID: ${data?.patientInfo?.uuid}`,
          },
          {
            width: "*",
            text: `Total Order: ${data?.orders?.length}`,
          },
        ],
      },
      {
        columns: [
          {
            width: "*",
            text: `Total Amount: ${totalValue}`,
          },
          {
            width: "*",
            text: `Total Paid: ${totalPaid}`,
          },
          {
            width: "*",
            text: `Total Due: ${totalDue}`,
          },
        ],
      },

      ,
      ...data?.orders.map((order, index) => {
        const hasTransactions =
          order.transactions && order.transactions.length > 0;
        let remainingDue = Number(order?.totalPrice);

        return [
          {
            text: `Order ${index + 1}: ${order.oid}`,
            style: "header",
            margin: [0, 10, 0, 5],
          },
          {
            table: {
              widths: ["auto", "*", "*", "*"],
              body: [
                [
                  "Total Price:",
                  order.netPayable,
                  "Total Due:",
                  order?.dueAmount ?? 0,
                ],

                [
                  "Created At:",
                  new Date(order.createdAt).toLocaleString(),
                  "Total Paid:",
                  order.netPayable,
                ],
              ],
            },
            layout: "noBorders",
            margin: [0, 0, 0, 10],
          },
          hasTransactions
            ? {
                text: "Transactions:",
                style: "subheader",
                margin: [0, 0, 0, 5],
              }
            : { text: "No Transactions", italics: true, margin: [0, 0, 0, 10] },
          hasTransactions
            ? {
                table: {
                  headerRows: 1,
                  widths: ["auto", "*", "*", "auto"],
                  body: [
                    ["Date", "Description", "Amount", "Due"],
                    ...order.transactions.map((tx) => {
                      remainingDue = remainingDue - Number(tx.amount);
                      return [
                        new Date(tx.createdAt).toLocaleString(),
                        tx.description,
                        tx.amount,

                        remainingDue,
                      ];
                    }),
                  ],
                },
                layout: "lightHorizontalLines",
                margin: [0, 0, 0, 20],
              }
            : "",
        ];
      }),
    ],
    styles: {
      header: {
        fontSize: 14,
        bold: true,
      },
      subheader: {
        fontSize: 12,
        bold: true,
      },
    },
  };

  pdfPrintingHelper(dd as TDocumentDefinitions);
};
