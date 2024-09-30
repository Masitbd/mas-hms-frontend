/* eslint-disable react/no-children-prop */
"use client";
import {
  defaultDate,
  IdefaultDate,
} from "@/components/financialReport/comission/initialDataAndTypes";
import { useGetTestWiseIncomeStatementQuery } from "@/redux/api/financialReport/financialReportSlice";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Button, DatePicker, Table } from "rsuite";
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";
import {
  TestWiseIncomeStatementTubePrice,
  TestWiseIncomeStatementReportGroupWiseData,
  TestWiseIncomeStatementTestWiseDoc,
} from "@/components/FInancialStatement/types";
import {
  useGetCompnayInofQuery,
  useGetDefaultQuery,
} from "@/redux/api/companyInfo/companyInfoSlice";
import { FinancialReportHeaderGenerator } from "@/components/financialStatment/HeaderGenerator";
import { useGetMarginDataQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const TestWIseIncomeStatement = () => {
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
  } = useGetTestWiseIncomeStatementQuery(date);

  useEffect(() => {
    if (financialReportData?.data?.length) {
      if (!financialReportData?.data[0]?.testWiseDocs?.length) {
        setData([]);
        return;
      }
      const data = JSON.parse(JSON.stringify(financialReportData?.data[0]));
      const total = data.total[0];
      const testWiseDocs = data.testWiseDocs;
      const finalData = [];

      const reportGroupWiseData = data.reportGroupWiseData;
      if (reportGroupWiseData.length) {
        reportGroupWiseData?.map((rgw: any) => {
          const rgwiseData = testWiseDocs.filter(
            (twi: any) => twi.rg == rgw._id
          );

          finalData.push(...rgwiseData);
          finalData.push({ ...rgw, f: "rg" });
        });
      }
      const tubePrice = data.tubePrice;
      if (tubePrice) {
        tubePrice.map((t: any) => {
          total.sell += t.sell;
          total.vat += t.vat;
          total.quantity += t.quantity;
          total.pa += t.pa;
          total.f = "t";
        });
        finalData.push(...tubePrice);
      }
      finalData.push(total);
      setData(finalData as never[]);
    }
  }, [financialReportData, financialReportLoading, financialReportReacthing]);

  // company info

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
  // margin

  const { data: marginInfo } = useGetMarginDataQuery(undefined);

  const pageMargin = marginInfo?.data?.value
    .split(",")
    .map((val: any) => Number(val.trim()));

  //  pdf
  const generatePDF = () => {
    const total = JSON.parse(
      JSON.stringify(financialReportData?.data[0]?.total[0])
    );

    const tubes = financialReportData?.data[0]?.tubePrice;
    const tubesTableData = [];

    if (tubes.length) {
      tubes.map((t: TestWiseIncomeStatementTubePrice) => {
        total.sell += t.sell;
        total.vat += t.vat;
        total.quantity += t.quantity;
        total.pa += t.pa;
        total.f = "t";
      });
      tubesTableData.push(
        {
          table: {
            widths: ["*"], // Single column table
            body: [
              [
                {
                  text: "Tubes",
                  style: "groupHeader",
                  margin: [0, 10, 0, 10],
                  border: [true, true, true, true],
                },
              ],
            ],
          },
        },
        {
          table: {
            widths: [200, "*", "*", "*", "*", "*", "*", "*", "*", "*"], // Fixed column widths
            body: financialReportData?.data[0]?.tubePrice?.map(
              (td: TestWiseIncomeStatementTubePrice) => {
                const dew = td.sell + td.vat - td.pa;
                return [
                  td?._id, // Date
                  td.price, // Bill No
                  td.quantity, // Bill Amount
                  td.sell, // Total Discount
                  td?.vat,
                  td?.vat + td?.sell,
                  0, // Amount Paid
                  td?.sell + td?.vat, // Due
                  td?.pa,
                  dew > 0 ? dew : 0,
                ];
              }
            ),
          },
        }
      );
    }

    const documentDefinition: any = {
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 12,
      },
      pageMargins: infoHeader ? [20, 20, 20, 20] : pageMargin,
      content: [
        ...(infoHeader ? infoHeader?.map((item) => item) : []),
        {
          text: `Test Wise Income Statement: Between ${date.from.toLocaleDateString()} to  ${date.to.toLocaleDateString()}`,
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
                { text: "Discount ", style: "tableHeader" },
                { text: "Total", style: "tableHeader" },
                { text: "VAT", style: "tableHeader" },
                { text: "Total + VAT", style: "tableHeader" },
                { text: "Paid", style: "tableHeader" },
                { text: "Due", style: "tableHeader" },
              ],
            ],
          },
          margin: [0, 0, 0, 0],
        },

        financialReportData?.data[0]?.reportGroupWiseData?.map(
          (rgwd: TestWiseIncomeStatementReportGroupWiseData) => {
            const testsAccordingRg =
              financialReportData?.data[0]?.testWiseDocs.filter(
                (td: TestWiseIncomeStatementTestWiseDoc) => td.rg == rgwd?._id
              );
            const price = (rgwd.sell / rgwd.quantity).toFixed(2) || 0;
            const dew =
              rgwd.sell +
              rgwd.vat -
              (rgwd?.discount ? rgwd.discount : 0) -
              rgwd.pa;

            return [
              {
                table: {
                  widths: ["*"], // Single column table
                  body: [
                    [
                      {
                        text: rgwd?._id,
                        style: "groupHeader",
                        margin: [0, 10, 0, 10],
                        border: [true, true, true, true],
                      },
                    ],
                  ],
                },
              },
              {
                table: {
                  widths: [200, "*", "*", "*", "*", "*", "*", "*", "*", "*"], // Fixed column widths
                  body: testsAccordingRg.map(
                    (td: TestWiseIncomeStatementTestWiseDoc) => {
                      const dew =
                        td.sell +
                        td.vat -
                        (td?.discount ? td.discount : 0) -
                        td.pa;
                      return [
                        td?._id, // Date
                        td.price, // Bill No
                        td.quantity, // Bill Amount
                        td.sell, // Total Discount
                        td?.vat,
                        td?.vat + td?.sell,
                        td?.discount, // Amount Paid
                        td?.sell + td?.vat - td?.discount, // Due
                        td?.pa,
                        dew > 0 ? dew : 0,
                      ];
                    }
                  ),
                },
              },
              {
                table: {
                  widths: [200, "*", "*", "*", "*", "*", "*", "*", "*", "*"], // Fixed column widths
                  body: [
                    [
                      "Total", // Date
                      price, // Bill No
                      rgwd.quantity, // Bill Amount
                      rgwd.sell, // Total Discount
                      rgwd?.vat,
                      rgwd?.vat + rgwd?.sell,
                      rgwd?.discount, // Amount Paid
                      rgwd?.sell + rgwd?.vat - rgwd?.discount, // Due
                      rgwd?.pa,
                      dew > 0 ? dew : 0,
                    ],
                  ],
                },
              },
            ];
          }
        ),
        tubesTableData,
        {
          table: {
            widths: ["*"], // Single column table
            body: [
              [
                {
                  text: "Grand Total",
                  style: "groupHeader",
                  margin: [0, 10, 0, 10],
                  border: [true, true, true, true],
                },
              ],
            ],
          },
          margin: [0, 10, 0, 0],
        },
        {
          table: {
            widths: [200, "*", "*", "*", "*", "*", "*", "*", "*", "*"], // Single column table
            body: [
              [
                "Grand Total",
                Math.ceil(total?.sell / total?.quantity), // Bill No
                total.quantity, // Bill Amount
                total.sell, // Total Discount
                total?.vat,
                total?.vat + total?.sell,
                total?.discount, // Amount Paid
                total?.sell + total?.vat - total?.discount, // Due
                total?.pa,
                total?.sell +
                  total?.vat -
                  (total?.discount ? total.discount : 0) -
                  total?.pa,
              ],
            ],
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
            Test Wise Income Statement
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
            {financialReportData?.data[0]?.testWiseDocs?.length ? (
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
              Test wise Income statement
            </h3>
            <h4 className="text-center text-lg font-serif">
              From <b> {new Date(date.from).toLocaleDateString()} </b> To{" "}
              <b>{new Date(date.to).toLocaleDateString()}</b>
            </h4>
            <Table
              data={data}
              wordWrap={"break-word"}
              bordered
              cellBordered
              loading={financialReportLoading || financialReportReacthing}
              autoHeight
            >
              <Column flexGrow={4}>
                <HeaderCell children={"Perticulars"} />
                <Cell>
                  {(rowData) => {
                    const flag = rowData?.f;
                    let colData;
                    switch (flag) {
                      case "rg":
                        colData = (
                          <div className=" font-bold text-center">
                            {rowData?._id}
                          </div>
                        );
                        break;
                      case "t":
                        colData = (
                          <div className="font-bold  text-center">Total</div>
                        );
                        break;

                      default:
                        colData = <div>{rowData?._id}</div>;
                        break;
                    }
                    return colData;
                  }}
                </Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell children={"Price"} />
                <Cell>
                  {(rowData) => {
                    const flag = rowData?.f;
                    let price = rowData.price;
                    if (flag == "rg") {
                      price = (rowData.sell / rowData.quantity).toFixed(2);
                    }

                    return price;
                  }}
                </Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell children={"Quantity"} />
                <Cell dataKey="quantity" />
              </Column>
              <Column flexGrow={1}>
                <HeaderCell children={"Sell"} />
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
                          ? Math.floor(
                              rowData.sell +
                                rowData.vat -
                                (rowData?.discount ? rowData.discount : 0) -
                                rowData.pa
                            )
                          : 0}
                      </>
                    );
                  }}
                </Cell>
              </Column>
            </Table>
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default TestWIseIncomeStatement;
