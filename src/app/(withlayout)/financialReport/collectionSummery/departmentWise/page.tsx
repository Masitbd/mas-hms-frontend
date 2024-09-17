"use client";
/* eslint-disable react/no-children-prop */
import {
  defaultDate,
  IdefaultDate,
} from "@/components/financialReport/comission/initialDataAndTypes";
import {
  useGetDeptWiseCollectionSummeryQuery,
  useGetDeptWiseIncomeStatementQuery,
} from "@/redux/api/financialReport/financialReportSlice";
import React, { SyntheticEvent, useState } from "react";
import { DatePicker, Table } from "rsuite";

const DepartmentWIseCollectionSUmmery = () => {
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
  } = useGetDeptWiseCollectionSummeryQuery(date);

  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Department Wise Collection Statement
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
        </div>
        <div className="my-5 px-2">
          <div>
            <h3 className="text-2xl font-serif text-center font-bold">
              Department wise Collection Statement
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
                <HeaderCell children={"Department"} />
                <Cell dataKey="_id" />
              </Column>
              <Column flexGrow={1}>
                <HeaderCell children={"Amount Paid"} />
                <Cell dataKey="paid" />
              </Column>
              <Column flexGrow={1}>
                <HeaderCell children={"Vat"} />
                <Cell dataKey="vat" />
              </Column>
              <Column flexGrow={1}>
                <HeaderCell children={"Total"} />
                <Cell dataKey="totalPaid" />
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

export default DepartmentWIseCollectionSUmmery;
