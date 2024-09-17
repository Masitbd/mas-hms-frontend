/* eslint-disable react/no-children-prop */
"use client";
import Loading from "@/app/loading";
import {
  defaultDate,
  DepartmentItem,
  IdefaultDate,
  OverALlPerformanceData,
} from "@/components/financialReport/comission/initialDataAndTypes";
import { useGetDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import { useLazyGetSingleDoctorPerformanceQuery } from "@/redux/api/financialReport/financialReportSlice";
import { IDoctor } from "@/types/allDepartmentInterfaces";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { DatePicker, SelectPicker, Table } from "rsuite";

const SIngleReport = () => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const [date, setDate] = useState<IdefaultDate>(defaultDate as IdefaultDate);
  const [refby, setRefBY] = useState<string>("");
  const dateChangeHandler = (value: Partial<IdefaultDate>) => {
    setDate((prevValue) => ({ ...prevValue, ...value }));
  };

  const { data: doctorsData, isLoading: isDoctorDataLoading } =
    useGetDoctorQuery(undefined);

  const [
    getPerformanceData,
    {
      isLoading: isPerformanceDataLoading,
      isFetching: isPerformanceDataFeatching,
    },
  ] = useLazyGetSingleDoctorPerformanceQuery();
  const [performanceData, setPerformanceData] =
    useState<OverALlPerformanceData>();
  const [colNames, setColnames] = useState<string[]>([]);
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
          const names: string[] = [];
          data.data.data.overall.map(
            (d: { departments: { name: string; price: number }[] }) => {
              d.departments.map((d: { name: string; price: number }) => {
                if (!names.includes(d.name)) {
                  names.push(d.name);
                }

                setColnames(names);
              });
            }
          );
        }
      })();
    }
  }, [refby, date]);

  //
  const [total, setTotal] = useState({
    totalCommission: 0,
    totalDiscount: 0,
    netCommission: 0,
  });
  useEffect(() => {
    if (performanceData) {
      const totalCommission = performanceData.summery.reduce(
        (a, b) => a + (b.commission + b.discount),
        0
      );
      const totalDiscount = performanceData.summery.reduce(
        (a, b) => a + b.discount,
        0
      );
      const netCommission = performanceData.summery.reduce(
        (a, b) => a + b.commission,
        0
      );
      setTotal({ totalCommission, totalDiscount, netCommission });
    }
  }, [performanceData]);

  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Overall Comission Report
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
        </div>
        <div>
          {refby ? (
            <div className="my-5 px-2">
              <div>
                <h3 className="text-2xl font-serif text-center font-bold">
                  Commission Summery
                </h3>
                <h4 className="text-center text-lg font-serif">
                  From <b> {new Date(date.from).toLocaleDateString()} </b> To{" "}
                  <b>{new Date(date.to).toLocaleDateString()}</b>
                </h4>
                <Table
                  data={performanceData?.overall}
                  wordWrap={"break-word"}
                  bordered
                  cellBordered
                  loading={
                    isPerformanceDataFeatching || isPerformanceDataLoading
                  }
                  autoHeight
                >
                  <Column flexGrow={1.5}>
                    <HeaderCell children={"Patient Id"} />
                    <Cell dataKey="uuid" />
                  </Column>
                  <Column flexGrow={1.5}>
                    <HeaderCell children={"Order Id"} />
                    <Cell dataKey="oid" />
                  </Column>
                  <Column flexGrow={2}>
                    <HeaderCell children={"Name"} />
                    <Cell dataKey="name" />
                  </Column>
                  <Column flexGrow={3}>
                    <HeaderCell children={"Tests"} />
                    <Cell>
                      {(rowdata) => {
                        return (
                          <div>
                            {rowdata.testNames.length &&
                              rowdata.testNames.join(" ,")}
                          </div>
                        );
                      }}
                    </Cell>
                  </Column>

                  {colNames.length &&
                    colNames.map((name, index) => (
                      <Column flexGrow={2} key={index + 50}>
                        <HeaderCell children={name} />
                        <Cell>
                          {(rowdata) => {
                            const d = rowdata.departments.find(
                              (dn: DepartmentItem) => dn.name == name
                            );

                            return <div>{d?.price ? d.price : ""}</div>;
                          }}
                        </Cell>
                      </Column>
                    ))}
                </Table>
              </div>

              <div className="mt-5">
                <h2 className="text-center font-serif text-2xl font-bold">
                  Overall
                </h2>
              </div>
              <div>
                <Table
                  data={performanceData?.summery}
                  wordWrap={"break-word"}
                  bordered
                  cellBordered
                  loading={
                    isPerformanceDataFeatching || isPerformanceDataLoading
                  }
                  autoHeight
                >
                  <Column flexGrow={2}>
                    <HeaderCell children={"Department"} />
                    <Cell dataKey="_id" />
                  </Column>
                  <Column flexGrow={2}>
                    <HeaderCell children={"Calculation"} />
                    <Cell>
                      {(rowdata) => {
                        return (
                          <div>
                            {rowdata?.total} X {rowdata?.percent} %
                          </div>
                        );
                      }}
                    </Cell>
                  </Column>
                  <Column flexGrow={2}>
                    <HeaderCell children={"Amount"} />
                    <Cell>
                      {(rowdata) => {
                        return (
                          <div>{rowdata?.commission + rowdata.discount}</div>
                        );
                      }}
                    </Cell>
                  </Column>
                  <Column flexGrow={2}>
                    <HeaderCell children={"Discount"} />
                    <Cell dataKey="discount" />
                  </Column>
                  <Column flexGrow={2}>
                    <HeaderCell children={"Net Amount"} />
                    <Cell dataKey="commission" />
                  </Column>
                </Table>
              </div>
              <div className="grid grid-cols-10 gap-5 border-double border-b-2">
                <div className="col-span-2 text-center font-bold">Total</div>
                <div className="col-span-2 col-start-5 font-bold">
                  {total?.totalCommission}
                </div>
                <div className="col-span-2 col-start-7 font-bold">
                  {total?.totalDiscount}
                </div>
                <div className="col-span-2 col-start-9 font-bold">
                  {total?.netCommission}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-80 text-lg font-bold">
              <h2>Please Select a doctor from above Data to show report</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SIngleReport;
