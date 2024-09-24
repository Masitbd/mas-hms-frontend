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
  console.log(params);
  const header = [];

  if (params) {
    let imageData = {};
    let otherInfo = [];
    if (params?.photoUrl) {
      const logoUrl = await imageToBase64(params?.photoUrl)
        .then((data) => data)
        .catch((err) => console.log(err));

      if (logoUrl) {
        imageData = {
          image: logoUrl,
          fit: [50, 50],
          alignment: "center",
        };
        header.push(imageData);
      }
    }
    if (params?.name)
      header.push({
        text: "TMSS SAHERA WASEQUE HOSPITAL & RESEARCH CENTER",
        style: { fontSize: 16, bold: true },
        alignment: "center",
      });

    if (params?.address) {
      header.push({
        text: params?.address,
        alignment: "center",
      });
    }

    if (params?.phone)
      header.push({
        text: "HelpLine: " + params?.phone,
        alignment: "center",
        margin: [0, 0, 0, 20],
      });
  }

  return header;
};
