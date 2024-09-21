"use client";
import AllTestsTable from "@/components/financialStatment/AllTestsTable";
import { useGetAllTestsQuery } from "@/redux/api/financialReport/financialReportSlice";
import { ITest } from "@/types/allDepartmentInterfaces";
import React from "react";
import { Button } from "rsuite";
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const AllTests = () => {
  const { isLoading, isFetching, data } = useGetAllTestsQuery(undefined);
  const generatePDF = () => {
    const documentDefinition: any = {
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 12,
      },
      pageMargins: [20, 20, 20, 20],
      content: [
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
          margin: [0, 0, 0, 20],
        },
        {
          text: `ALl Tests`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },

        ...data?.data?.map((td: { _id: string; tests: ITest[] }) => {
          const dd = {
            text: `${td._id}`,
            style: "groupHeader",
            alignment: "center",
            margin: [0, 20, 0, 0],
          };
          const testTAble = {
            table: {
              widths: [80, "*", "*"], // Fixed column widths
              headerRows: 1,
              body: [
                ["Code", "Name", "Price"],
                ...td?.tests?.map((td) => [td?.testCode, td?.label, td?.price]),
              ],
            },
            margin: [0, 0, 0, 0],
          };

          return [dd, testTAble];
        }),
        // For detailed comission table
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
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">All Tests</h2>
        </div>
        <div className="px-2 mb-5 py-2 grid grid-cols-12 gap-5">
          {data?.data?.length ? (
            <Button
              appearance="primary"
              color="blue"
              onClick={() => generatePDF()}
            >
              Print
            </Button>
          ) : (
            " "
          )}
        </div>
        <div className="py-2">
          <AllTestsTable
            data={data?.data}
            loading={isLoading}
            featching={isFetching}
          />
        </div>
      </div>
    </div>
  );
};

export default AllTests;
