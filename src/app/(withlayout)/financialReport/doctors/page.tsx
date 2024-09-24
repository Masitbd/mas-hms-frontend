/* eslint-disable react/no-children-prop */
"use client";

import { useGetAllDoctorsQuery } from "@/redux/api/financialReport/financialReportSlice";
import { IDoctor } from "@/types/allDepartmentInterfaces";
import React, { useEffect, useState } from "react";
import { Button, Table } from "rsuite";
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";
import { useGetDefaultQuery } from "@/redux/api/companyInfo/companyInfoSlice";
import { FinancialReportHeaderGenerator } from "@/components/financialStatment/HeaderGenerator";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
const AllDoctors = () => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;

  const { data, isLoading, isFetching } = useGetAllDoctorsQuery(undefined);
  const {
    data: companyInfoData,
    isLoading: companyInfoLoading,
    isFetching: companyInfoFeatching,
  } = useGetDefaultQuery(undefined);

  const [headers, setHeaders] = useState([]);
  useEffect(() => {
    (async function () {
      if (!companyInfoFeatching && !companyInfoFeatching) {
        await FinancialReportHeaderGenerator(companyInfoData?.data).then(
          (data) => setHeaders(data as never[])
        );
      }
    })();
  }, [companyInfoData, companyInfoFeatching, companyInfoFeatching]);
  const generatePDF = () => {
    const documentDefinition: any = {
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 12,
      },
      pageMargins: [20, 20, 20, 20],
      content: [
        ...headers,
        {
          text: `Doctor's List`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        //  table header
        {
          table: {
            widths: [80, 250, 90, "*"], // Fixed column widths
            headerRows: 1,
            body: [
              [
                { text: "Code", style: "tableHeader" },
                { text: "Name", style: "tableHeader" },
                { text: "Phone", style: "tableHeader" },
                { text: "Address", style: "tableHeader" },
              ],
            ],
          },
          margin: [0, 0, 0, 0],
        },
        {
          table: {
            widths: [80, 250, 90, "*"], // Fixed column widths
            headerRows: 1,
            body: data?.data?.map((dd: Partial<IDoctor>) => [
              dd.code,
              dd?.title + " " + dd?.name,
              dd.phone,
              dd?.address ?? " ",
            ]),
          },
          margin: [0, 0, 0, 0],
        },
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
    <div className="my-5 border  shadow-lg mx-5">
      <div className="bg-[#3498ff] text-white px-2 py-2">
        <h2 className="text-center text-xl font-semibold">All Doctors</h2>
      </div>
      <div className="px-2 mb-5 py-2 grid grid-cols-12 gap-5">
        {data?.data?.length ? (
          <Button
            onClick={() => generatePDF()}
            appearance="primary"
            color="blue"
          >
            Print
          </Button>
        ) : (
          ""
        )}
      </div>

      <div className="py-2">
        <Table data={data?.data} loading={isLoading || isFetching} autoHeight>
          <Column flexGrow={1}>
            <HeaderCell children="Code" />
            <Cell dataKey="code" />
          </Column>
          <Column flexGrow={3}>
            <HeaderCell children="Name" />
            <Cell>
              {(rowData: Partial<IDoctor>) => {
                return <>{rowData?.title + " " + rowData?.name}</>;
              }}
            </Cell>
          </Column>
          <Column flexGrow={2}>
            <HeaderCell children="Phone" />
            <Cell dataKey="phone" />
          </Column>
          <Column flexGrow={2}>
            <HeaderCell children="Address" />
            <Cell dataKey="address" />
          </Column>
        </Table>
      </div>
    </div>
  );
};

export default AllDoctors;
