/* eslint-disable react/no-children-prop */
"use client";
import {
  defaultDate,
  IdefaultDate,
} from "@/components/financialReport/comission/initialDataAndTypes";
import { useGetTestWiseIncomeStatementQuery } from "@/redux/api/financialReport/financialReportSlice";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { DatePicker, Table } from "rsuite";

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

  console.log(financialReportData?.data);
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
                    const data = { to: value };
                    dateChangeHandler(data);
                  }
                }}
                oneTap
              />
            </div>
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

export default TestWIseIncomeStatement;
