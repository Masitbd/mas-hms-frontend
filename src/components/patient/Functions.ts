import { IPatient } from "@/types/allDepartmentInterfaces";
import JsBarcode from "jsbarcode";
import { toaster } from "rsuite";

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
