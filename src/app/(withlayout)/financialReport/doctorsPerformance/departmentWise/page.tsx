/* eslint-disable react/no-children-prop */
"use client";
import {
  defaultDate,
  IdefaultDate,
} from "@/components/financialReport/comission/initialDataAndTypes";
import { useGetDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import {
  useLazyGetDeptWiseDoctorPerformanceQuery,
  useLazyGetTestWiseDoctorPerformanceQuery,
} from "@/redux/api/financialReport/financialReportSlice";
import { IDoctor } from "@/types/allDepartmentInterfaces";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { DatePicker, SelectPicker, Table } from "rsuite";

const DepartmentWisePeformance = () => {
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
  ] = useLazyGetDeptWiseDoctorPerformanceQuery();
  const [performanceData, setPerformanceData] = useState();
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

  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Doctor Performance- Department wise
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
          {refby ? (
            <div className="my-5 px-2">
              <div>
                <h3 className="text-2xl font-serif text-center font-bold">
                  Doctor Performance- Department wise
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

export default DepartmentWisePeformance;
