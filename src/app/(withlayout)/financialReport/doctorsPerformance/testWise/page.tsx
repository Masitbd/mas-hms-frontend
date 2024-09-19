"use client";

/* eslint-disable react/no-children-prop */
import {
  defaultDate,
  IdefaultDate,
} from "@/components/financialReport/comission/initialDataAndTypes";
import { useGetDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import {
  useGetDeptWiseCollectionSummeryQuery,
  useGetTestWiseDoctorPerformanceQuery,
  useLazyGetTestWiseDoctorPerformanceQuery,
} from "@/redux/api/financialReport/financialReportSlice";
import { IDoctor } from "@/types/allDepartmentInterfaces";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Button, DatePicker, SelectPicker, Table } from "rsuite";
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
const TestWiseDoctorsPerformance = () => {
  const { data: doctorsData, isLoading: isDoctorDataLoading } =
    useGetDoctorQuery(undefined);
  const [refby, setRefBY] = useState<string>("");
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
  ] = useLazyGetTestWiseDoctorPerformanceQuery();
  const [performanceData, setPerformanceData] = useState([]);
  useEffect(() => {
    if (refby) {
      (async function () {
        const data = await getPerformanceData({
          from: date.from,
          to: date.to,
          refBy: refby,
        });

        if ("data" in data) {
          setPerformanceData(data.data.data);
        }
      })();
    }
  }, [refby, date]);

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
          text: `RefBy And Department Wise Income Statement: Between ${date.from.toLocaleDateString()} to  ${date.to.toLocaleDateString()}`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },

        // Static Table Header
        {
          table: {
            widths: [140, 60, 60, 60, 60, 60, 60, 80, 60, 60], // Fixed column widths
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

        {
          table: {
            widths: [140, 60, 60, 60, 60, 60, 60, 80, 60, 60], // Fixed column widths
            body: performanceData.map((pd: any) => [
              pd?._id,
              pd?.price,
              pd?.quantity,
              pd?.totalPrice,
              pd?.totalDiscount,
              Math.ceil(pd?.totalPrice - pd?.totalDiscount),
              pd?.vat,
              Math.ceil(pd?.totalPrice - pd?.totalDiscount + pd?.vat),
              pd?.paid,
              Math.ceil(
                pd?.totalPrice - pd?.totalDiscount + pd?.vat - pd?.paid > 0
                  ? pd?.totalPrice - pd?.totalDiscount + pd?.vat - pd?.paid
                  : 0
              ),
            ]),
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
            Doctor Performance- Test wise
          </h2>
        </div>
        <div className="px-2 mb-5 py-2 grid grid-cols-12 gap-5">
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
                ) => setRefBY(value as string)}
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
            {performanceData.length ? (
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
          {refby ? (
            <div className="my-5 px-2">
              <div>
                <h3 className="text-2xl font-serif text-center font-bold">
                  Doctor Performance- Test wise
                </h3>
                <h4 className="text-center text-lg font-serif">
                  From <b> {new Date(date.from).toLocaleDateString()} </b> To{" "}
                  <b>{new Date(date.to).toLocaleDateString()}</b>
                </h4>
                <Table
                  data={performanceData}
                  wordWrap={"break-word"}
                  bordered
                  cellBordered
                  loading={
                    isPerformanceDataFeatching || isPerformanceDataLoading
                  }
                  autoHeight
                >
                  <Column flexGrow={4}>
                    <HeaderCell children={"Perticulars"} />
                    <Cell dataKey="_id" />
                  </Column>
                  <Column flexGrow={1}>
                    <HeaderCell children={"Rate"} />
                    <Cell dataKey="price" />
                  </Column>
                  <Column flexGrow={1}>
                    <HeaderCell children={"Quantity"} />
                    <Cell dataKey="quantity" />
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
                    <HeaderCell children={"Dew"} />
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

export default TestWiseDoctorsPerformance;
