/* eslint-disable react/no-children-prop */
"use client";
import {
  defaultDate,
  IdefaultDate,
} from "@/components/financialReport/comission/initialDataAndTypes";
import { useGetDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import {
  useGetOrderDoctorPerformanceQuery,
  useLazyGetDeptWiseDoctorPerformanceQuery,
  useLazyGetTestWiseDoctorPerformanceQuery,
} from "@/redux/api/financialReport/financialReportSlice";
import { IDoctor } from "@/types/allDepartmentInterfaces";
import pdfMake from "pdfmake/build/pdfmake";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Button, DatePicker, SelectPicker, Table } from "rsuite";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  useGetCompnayInofQuery,
  useGetDefaultQuery,
} from "@/redux/api/companyInfo/companyInfoSlice";
import { FinancialReportHeaderGenerator } from "@/components/financialStatment/HeaderGenerator";
import { useGetMarginDataQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";
import { pdfPrintingHelper } from "@/utils/PdfPrintingHelper";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
type QueryType = {
  from: Date;
  to: Date;
  refBy: string;
  type: string;
};
const OrderWiseDoctorPerformance = () => {
  const { data: doctorsData, isLoading: isDoctorDataLoading } =
    useGetDoctorQuery(undefined);
  const [refby, setRefBY] = useState<string>("");
  const [doctorType, setDoctorType] = useState<string>("refBy");
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const [date, setDate] = useState<IdefaultDate>(defaultDate as IdefaultDate);
  const dateChangeHandler = (value: Partial<IdefaultDate>) => {
    setDate((prevValue) => ({ ...prevValue, ...value }));
  };
  const [
    getPerformanceData,
    {
      isLoading: isPerformanceDataLoading,
      isFetching: isPerformanceDataFeatching,
    },
  ] = useLazyGetDeptWiseDoctorPerformanceQuery();

  const [query, setQuery] = useState<{
    from: Date;
    to: Date;
    refBy: string;
    type: string;
  }>({ from: date.from, to: date.to, type: "refBy" } as QueryType);
  const { data: performanceDataNew } = useGetOrderDoctorPerformanceQuery(
    query,
    {
      skip: !query.from || !query.to || !query?.type || !query?.refBy,
    }
  );
  const [performanceData, setPerformanceData] = useState([]);
  const queryHandler = (
    fieldName: string,
    value: string,
    action: "add" | "remove"
  ) => {
    if (action === "remove") {
      if (query[fieldName as keyof QueryType] === value) {
        setQuery((prev) => {
          const updatedQuery = { ...prev };
          delete updatedQuery[fieldName as keyof QueryType];
          return updatedQuery;
        });
      }
    }
    if (action == "add") {
      setQuery((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    }
  };

  const { data: comapnyInfo } = useGetDefaultQuery(undefined);

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
  }, [comapnyInfo, performanceData, doctorType]);
  // margin
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
          text: `${
            doctorType === "refBy" ? "RefBy" : "Consultant"
          }  Order Wise Income Statement: Between ${query?.from?.toLocaleDateString()} to  ${query?.to?.toLocaleDateString()}`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },

        // Main data
        ...performanceDataNew?.data
          ?.filter((d: any) => d.type == "doctor")
          ?.map((t: any) => {
            const tableData = t?.orders?.length
              ? [...t?.orders, { oid: "Total", ...t }]
              : [];
            return [
              {
                text: `${t?.doctorInfo?.title ?? " "} ${t?.doctorInfo?.name}`,
                style: "groupHeader",
                margin: [0, 10, 0, 5],
              },
              {
                table: {
                  widths: [140, 120, 120, 60, 60, 80, 60, 60], // Fixed column widths
                  headerRows: 1,
                  body: [
                    [
                      { text: "Order Id", style: "tableHeader" },

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

              {
                table: {
                  widths: [140, 120, 120, 60, 60, 80, 60, 60], // Fixed column widths
                  body: tableData?.map((pd: any) => [
                    pd?.oid ?? " ",
                    pd?.totalPrice ?? " ",
                    pd?.totalDiscount ?? " ",
                    Math.ceil(pd?.totalPrice - pd?.totalDiscount),
                    pd?.vat ?? " ",
                    Math.ceil(pd?.totalPrice - pd?.totalDiscount + pd?.vat),
                    pd?.paid ?? " ",
                    Math.ceil(
                      pd?.totalPrice - pd?.totalDiscount + pd?.vat - pd?.paid
                    ),
                  ]),
                },
              },
            ];
          })
          .flat(),

        // Grand total data
        // ...performanceDataNew?.data
        //   ?.filter((d: any) => d._id == "Total")
        //   ?.map((pd: any) => {
        //     console.log(pd);
        //     return [
        //       {
        //         text: `Grand Total`,
        //         style: "groupHeader",
        //         margin: [0, 10, 0, 5],
        //       },
        //       {
        //         table: {
        //           widths: [140, 120, 120, 60, 60, 80, 60, 60], // Fixed column widths
        //           headerRows: 1,
        //           body: [
        //             [
        //               { text: "Order Id", style: "tableHeader" },

        //               { text: "Amount", style: "tableHeader" },
        //               { text: "Discount ", style: "tableHeader" },
        //               { text: "Total", style: "tableHeader" },
        //               { text: "VAT", style: "tableHeader" },
        //               { text: "Total + VAT", style: "tableHeader" },
        //               { text: "Paid", style: "tableHeader" },
        //               { text: "Due", style: "tableHeader" },
        //             ],
        //           ],
        //         },
        //         margin: [0, 0, 0, 0],
        //       },

        //       {
        //         table: {
        //           widths: [140, 120, 120, 60, 60, 80, 60, 60], // Fixed column widths
        //           body: [
        //             "Total",
        //             pd?.totalPrice ?? " ",
        //             pd?.totalDiscount ?? " ",
        //             Math.ceil(pd?.totalPrice - pd?.totalDiscount),
        //             pd?.vat ?? " ",
        //             Math.ceil(pd?.totalPrice - pd?.totalDiscount + pd?.vat),
        //             pd?.paid ?? " ",
        //             Math.ceil(
        //               pd?.totalPrice - pd?.totalDiscount + pd?.vat - pd?.paid
        //             ),
        //           ],
        //         },
        //       },
        //     ];
        //   })
        //   .flat(),
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
    pdfPrintingHelper(documentDefinition);
  };

  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Doctor Performance- Order wise
          </h2>
        </div>
        <div className="px-2 mb-5 py-2 grid grid-cols-12 gap-5">
          {/* selector for doctor type */}
          <div className="col-span-3">
            <h3>Type</h3>
            <div>
              <SelectPicker
                data={[
                  { label: "Refer By", value: "refBy" },
                  { label: "Consultant", value: "consultant" },
                ]}
                onChange={(
                  value: string | null,
                  event: SyntheticEvent<Element, Event>
                ) => queryHandler("type", value as string, "add")}
                block
                value={query?.type}
                cleanable={false}
              />
            </div>
          </div>
          <div className="col-span-3">
            <h3>Doctors</h3>
            <div>
              <SelectPicker
                loading={isDoctorDataLoading}
                data={
                  doctorsData?.data &&
                  doctorsData?.data.map((d: IDoctor) => ({
                    label: d.title + d.name,
                    value: d._id,
                  }))
                }
                onChange={(
                  value: string | null,
                  event: SyntheticEvent<Element, Event>
                ) => queryHandler("refBy", value as string, "add")}
                onClean={() => queryHandler("refBy", "", "remove")}
                block
              />
            </div>
          </div>
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
                    const dateValue = value;
                    dateValue.setUTCHours(0, 0, 0, 0).toLocaleString("en-GB");
                    queryHandler("from", dateValue as unknown as string, "add");
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
                    value.setUTCHours(23, 59, 59, 999);
                    queryHandler("to", value as unknown as string, "add");
                  }
                }}
                oneTap
              />
            </div>
          </div>
          <div>
            {performanceDataNew?.data?.length ? (
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
          {performanceDataNew?.data?.length ? (
            <div className="my-5 px-2">
              <div>
                <h3 className="text-2xl font-serif text-center font-bold">
                  Doctor Performance- Order wise
                </h3>
                <h4 className="text-center text-lg font-serif">
                  From <b> {new Date(query?.from).toLocaleDateString()} </b> To{" "}
                  <b>{new Date(query?.to).toLocaleDateString()}</b>
                </h4>
                {/* main data */}
                {performanceDataNew?.data
                  ?.filter((d: any) => d.type == "doctor")
                  ?.map((t: any) => {
                    const tableDatas = t?.orders?.length
                      ? [...t?.orders, { oid: "Total", ...t }]
                      : [];

                    return (
                      <>
                        <div>
                          <h3 className="text-xl font-serif font-bold mt-5 mb-2">
                            {t?.doctorInfo?.title ?? " "} {t?.doctorInfo?.name}
                          </h3>
                        </div>
                        <Table
                          data={tableDatas}
                          wordWrap={"break-word"}
                          bordered
                          cellBordered
                          loading={
                            isPerformanceDataFeatching ||
                            isPerformanceDataLoading
                          }
                          autoHeight
                          key={t?._id}
                        >
                          <Column flexGrow={4}>
                            <HeaderCell children={"Order id"} />
                            <Cell dataKey="oid" />
                          </Column>

                          <Column flexGrow={1}>
                            <HeaderCell children={"Amount"} />
                            <Cell dataKey="totalPrice" />
                          </Column>
                          <Column flexGrow={1}>
                            <HeaderCell children={"Discount"} />
                            <Cell dataKey="totalDiscount" />
                          </Column>
                          <Column flexGrow={1}>
                            <HeaderCell children={"Total"} />
                            <Cell>
                              {(rowData) => {
                                const totalPrice = rowData?.totalPrice || 0;
                                const totalDiscount =
                                  rowData?.totalDiscount || 0;
                                return <>{totalPrice - totalDiscount}</>;
                              }}
                            </Cell>
                          </Column>
                          <Column flexGrow={1}>
                            <HeaderCell children={"Vat"} />
                            <Cell dataKey="vat" />
                          </Column>
                          <Column flexGrow={1}>
                            <HeaderCell children={"Vat + Total"} />
                            <Cell>
                              {(rowData) => {
                                const totalPrice = rowData?.totalPrice || 0;
                                const totalDiscount =
                                  rowData?.totalDiscount || 0;
                                const vat = rowData?.vat || 0;
                                return <>{totalPrice - totalDiscount + vat}</>;
                              }}
                            </Cell>
                          </Column>
                          <Column flexGrow={1}>
                            <HeaderCell children={"Paid"} />
                            <Cell dataKey="paid" />
                          </Column>
                          <Column flexGrow={1}>
                            <HeaderCell children={"Due"} />
                            <Cell>
                              {(rowData) => {
                                const totalPrice = rowData?.totalPrice || 0;
                                const totalDiscount =
                                  rowData?.totalDiscount || 0;
                                const vat = rowData?.vat || 0;
                                const paid = rowData?.paid || 0;
                                const dewAmount =
                                  totalPrice - totalDiscount + vat - paid;
                                return <>{dewAmount > 0 ? dewAmount : 0}</>;
                              }}
                            </Cell>
                          </Column>
                        </Table>
                      </>
                    );
                  })}

                {/* Grand Total data */}
                <>
                  <div>
                    <h3 className="text-xl font-serif font-bold mt-5 mb-2">
                      Grand Total
                    </h3>
                  </div>
                  <Table
                    data={performanceDataNew?.data?.filter(
                      (t: any) => t?._id == "Total"
                    )}
                    wordWrap={"break-word"}
                    bordered
                    cellBordered
                    loading={
                      isPerformanceDataFeatching || isPerformanceDataLoading
                    }
                    autoHeight
                  >
                    <Column flexGrow={4}>
                      <HeaderCell children={"Details"} />
                      <Cell dataKey="_id" />
                    </Column>

                    <Column flexGrow={1}>
                      <HeaderCell children={"Amount"} />
                      <Cell dataKey="totalPrice" />
                    </Column>
                    <Column flexGrow={1}>
                      <HeaderCell children={"Discount"} />
                      <Cell dataKey="totalDiscount" />
                    </Column>
                    <Column flexGrow={1}>
                      <HeaderCell children={"Total"} />
                      <Cell>
                        {(rowData) => {
                          const totalPrice = rowData?.totalPrice || 0;
                          const totalDiscount = rowData?.totalDiscount || 0;
                          return <>{totalPrice - totalDiscount}</>;
                        }}
                      </Cell>
                    </Column>
                    <Column flexGrow={1}>
                      <HeaderCell children={"Vat"} />
                      <Cell dataKey="vat" />
                    </Column>
                    <Column flexGrow={1}>
                      <HeaderCell children={"Vat + Total"} />
                      <Cell>
                        {(rowData) => {
                          const totalPrice = rowData?.totalPrice || 0;
                          const totalDiscount = rowData?.totalDiscount || 0;
                          const vat = rowData?.vat || 0;
                          return <>{totalPrice - totalDiscount + vat}</>;
                        }}
                      </Cell>
                    </Column>
                    <Column flexGrow={1}>
                      <HeaderCell children={"Paid"} />
                      <Cell dataKey="paid" />
                    </Column>
                    <Column flexGrow={1}>
                      <HeaderCell children={"Due"} />
                      <Cell>
                        {(rowData) => {
                          const totalPrice = rowData?.totalPrice || 0;
                          const totalDiscount = rowData?.totalDiscount || 0;
                          const vat = rowData?.vat || 0;
                          const paid = rowData?.paid || 0;
                          const dewAmount =
                            totalPrice - totalDiscount + vat - paid;
                          return <>{dewAmount > 0 ? dewAmount : 0}</>;
                        }}
                      </Cell>
                    </Column>
                  </Table>
                </>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-80 text-lg font-bold">
              <h2>Please Select a doctor from above Data to show report</h2>
            </div>
          )}
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default OrderWiseDoctorPerformance;
