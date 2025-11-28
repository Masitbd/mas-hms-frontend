import { useGetDefaultQuery } from "@/redux/api/companyInfo/companyInfoSlice";
import { ICompanyInfo } from "../companyInfo/TypesAndDefaults";
import { useEffect } from "react";
async function imageToBase64(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      resolve(reader.result); // This will be the base64 string
    };
    reader.onerror = reject; // errors
    reader.readAsDataURL(blob); // Convert blob to base64
  });
}

export const FinancialReportHeaderGenerator = async (params: ICompanyInfo) => {
  const mainTest = [];

  if (params) {
    let imageData = {};
    const photoGenerator = async () => {
      if (params?.photo) {
        if (params.photo) {
          imageData = {
            image: params.photo,
            fit: [50, 50],
            alignment: "center",
          };
          return imageData;
        } else {
          return { text: "logo", color: "white", fontsize: 1 };
        }
      }
    };

    const bodySection = [];

    if (params?.name)
      bodySection.push({
        text: params?.name,
        style: { fontSize: 16, bold: true },
        alignment: "center",
      });

    if (params?.address) {
      bodySection.push({
        text: params?.address,
        alignment: "center",
      });
    }

    if (params?.phone)
      bodySection.push({
        text: "HelpLine: " + params?.phone,
        alignment: "center",
        margin: [0, 0, 0, 5],
      });

    const test = {
      table: {
        widths: params?.photo ? ["15%", "80%"] : ["2%", "98%"],
        body: [
          [
            params?.photo
              ? await photoGenerator()
              : { text: "logo", color: "white", fontsize: 15 },
            bodySection,
          ],
        ],
      },
      layout: "noBorders",
    };

    mainTest.push(test);
  }

  return mainTest as { text?: string; image?: string }[];
};
