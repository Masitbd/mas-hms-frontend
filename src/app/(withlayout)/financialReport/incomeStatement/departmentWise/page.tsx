/* eslint-disable react/no-children-prop */
"use client";
import {
  defaultDate,
  IdefaultDate,
} from "@/components/financialReport/comission/initialDataAndTypes";
import {
  useGetClientWiseIncomeStatementQuery,
  useGetDeptWiseIncomeStatementQuery,
  useGetTestWiseIncomeStatementQuery,
} from "@/redux/api/financialReport/financialReportSlice";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { Button, DatePicker, Table } from "rsuite";
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";
import {
  useGetCompnayInofQuery,
  useGetDefaultQuery,
} from "@/redux/api/companyInfo/companyInfoSlice";
import { FinancialReportHeaderGenerator } from "@/components/financialStatment/HeaderGenerator";
import { useGetMarginDataQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const DepartmentWiseIncomeStatement = () => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const [date, setDate] = useState<IdefaultDate>(defaultDate as IdefaultDate);
  const dateChangeHandler = (value: Partial<IdefaultDate>) => {
    setDate((prevValue) => ({ ...prevValue, ...value }));
  };
  const [data, setData] = useState([]);
  const {
    data: financialReportData,
    isLoading: financialReportLoading,
    isFetching: financialReportReacthing,
  } = useGetDeptWiseIncomeStatementQuery(date);

  // company

  const { data: comapnyInfo } = useGetCompnayInofQuery(undefined);

  const [infoHeader, setInfoHeader] = useState<
    null | { text?: string; image?: string }[]
  >(null);

  // console.log("heaer", infoHeader);

  useEffect(() => {
    const generateHeader = async () => {
      const header = await FinancialReportHeaderGenerator(comapnyInfo?.data);
      setInfoHeader(header); // Set the state with the generated header
    };

    if (comapnyInfo?.data) {
      generateHeader();
    }
  }, [comapnyInfo, data]);

  const { data: marginInfo } = useGetMarginDataQuery(undefined);

  const pageMargin = marginInfo?.data?.value
    .split(",")
    .map((val: any) => Number(val.trim()));

  // pdf
  const generatePDF = () => {
    const documentDefinition: any = {
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 12,
      },
      pageMargins: infoHeader ? [20, 20, 20, 20] : pageMargin,
      content: [
        ...(infoHeader ? infoHeader?.map((item) => item) : []),
        {
          text: `Department wise Income Statement: Between ${date.from.toLocaleDateString()} to  ${date.to.toLocaleDateString()}`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },

        // Static Table Header
        {
          table: {
            widths: [200, "*", "*", "*", "*", "*", "*", "*", "*", "*"], // Fixed column widths
            headerRows: 1,
            body: [
              [
                { text: "Particular", style: "tableHeader" },
                { text: "Rate", style: "tableHeader" },
                { text: "Quantity", style: "tableHeader" },
                { text: "Amount", style: "tableHeader" },
                { text: "Vat", style: "tableHeader" },
                { text: "Vat + sell", style: "tableHeader" },
                { text: "Discount", style: "tableHeader" },
                { text: "Total", style: "tableHeader" },
                { text: "Paid", style: "tableHeader" },
                { text: "Dew", style: "tableHeader" },
              ],
            ],
          },
          margin: [0, 0, 0, 0],
        },

        {
          table: {
            widths: [200, "*", "*", "*", "*", "*", "*", "*", "*", "*"], // Fixed column widths
            body: financialReportData?.data.map((pd: any) => {
              const dew =
                pd.sell + pd.vat - (pd?.discount ? pd.discount : 0) - pd.pa;

              return [
                pd?._id,
                pd.sell && pd.quantity > 0
                  ? (pd.sell / pd.quantity).toFixed(2)
                  : 0,
                pd?.quantity,
                pd?.sell,
                pd?.vat,
                pd.sell + pd.vat,
                pd?.discount,
                pd.sell + pd.vat - (pd?.discount ? pd.discount : 0),
                pd?.pa,

                dew > 0 ? dew : 0,
              ];
            }),
          },
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
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Department wise Income statement
          </h2>
        </div>
        <div className="px-2 mb-5 py-2 grid grid-cols-12 gap-5">
          <div className="col-span-2">
            <h3>From</h3>
            <div>
              <DatePicker
                defaultValue={defaultDate.from}
                onChange={(
                  value: Date | null,
                  event: SyntheticEvent<Element, Event>
                ) => {
                  if (value) {
                    const data = { from: value };
                    dateChangeHandler(data);
                  }
                }}
                oneTap
              />
            </div>
          </div>
          <div className="col-span-2">
            <h3>To</h3>
            <div>
              <DatePicker
                defaultValue={defaultDate.to}
                onChange={(
                  value: Date | null,
                  event: SyntheticEvent<Element, Event>
                ) => {
                  if (value) {
                    value.setHours(23, 59, 59, 999);
                    const data = { to: value };
                    dateChangeHandler(data);
                  }
                }}
                oneTap
              />
            </div>
          </div>
          <div>
            {financialReportData?.data.length ? (
              <>
                <br />
                <Button
                  onClick={() => generatePDF()}
                  appearance="primary"
                  color="blue"
                >
                  Print
                </Button>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="my-5 px-2">
          <div>
            <h3 className="text-2xl font-serif text-center font-bold">
              Department wise Income statement
            </h3>
            <h4 className="text-center text-lg font-serif">
              From <b> {new Date(date.from).toLocaleDateString()} </b> To{" "}
              <b>{new Date(date.to).toLocaleDateString()}</b>
            </h4>
            <Table
              data={financialReportData?.data}
              wordWrap={"break-word"}
              bordered
              cellBordered
              loading={financialReportLoading || financialReportReacthing}
              autoHeight
            >
              <Column flexGrow={4}>
                <HeaderCell children={"Perticulars"} />
                <Cell dataKey="_id" />
              </Column>
              <Column flexGrow={1}>
                <HeaderCell children={"Rate"} />
                <Cell>
                  {(rowData) => {
                    return (
                      <>
                        {rowData.sell && rowData.quantity > 0
                          ? (rowData.sell / rowData.quantity).toFixed(2)
                          : 0}
                      </>
                    );
                  }}
                </Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell children={"Quantity"} />
                <Cell dataKey="quantity" />
              </Column>
              <Column flexGrow={1}>
                <HeaderCell children={"Amount"} />
                <Cell dataKey="sell" />
              </Column>
              <Column flexGrow={1}>
                <HeaderCell children={"Vat"} />
                <Cell dataKey="vat" />
              </Column>
              <Column flexGrow={1}>
                <HeaderCell children={"Vat + Sell"} />
                <Cell>
                  {(rowData) => {
                    return <>{rowData.sell + rowData.vat}</>;
                  }}
                </Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell children={"Discount"} />
                <Cell dataKey="discount" />
              </Column>
              <Column flexGrow={1.5}>
                <HeaderCell children={"Total"} />
                <Cell>
                  {(rowData) => {
                    return (
                      <>
                        {rowData.sell +
                          rowData.vat -
                          (rowData?.discount ? rowData.discount : 0)}
                      </>
                    );
                  }}
                </Cell>
              </Column>
              <Column flexGrow={1.5}>
                <HeaderCell children={"Paid"} />
                <Cell dataKey="pa" />
              </Column>
              <Column flexGrow={1.5}>
                <HeaderCell children={"Dew"} />
                <Cell>
                  {(rowData) => {
                    return (
                      <>
                        {rowData.sell +
                          rowData.vat -
                          (rowData?.discount ? rowData.discount : 0) -
                          rowData.pa >
                        0
                          ? rowData.sell +
                            rowData.vat -
                            (rowData?.discount ? rowData.discount : 0) -
                            rowData.pa
                          : 0}
                      </>
                    );
                  }}
                </Cell>
              </Column>
            </Table>
          </div>

          {/* <div className="mt-5">
            <h2 className="text-center font-serif text-2xl font-bold">
              Overall
            </h2>
          </div>
          <div></div> */}
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default DepartmentWiseIncomeStatement;
