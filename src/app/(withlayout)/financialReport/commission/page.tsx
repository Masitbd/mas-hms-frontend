/* eslint-disable react/no-children-prop */
"use client";
import Loading from "@/app/loading";
import {
  defaultDate,
  IdefaultDate,
} from "@/components/financialReport/comission/initialDataAndTypes";
import { useGetOverAllComissionQuery } from "@/redux/api/financialReport/financialReportSlice";
import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { DatePicker, SelectPicker, Table } from "rsuite";

const Comission = () => {
  const { HeaderCell, Cell, Column } = Table;
  const [date, setDate] = useState<IdefaultDate>(defaultDate as IdefaultDate);
  const [totalexp, setTotalExp] = useState(0);
  const [totaoSell, setTotalSell] = useState(0);
  const dateChangeHandler = (value: Partial<IdefaultDate>) => {
    setDate((prevValue) => ({ ...prevValue, ...value }));
  };
  const {
    isLoading: comissionLoading,
    isFetching: comissionFeatching,
    data: commissionData,
  } = useGetOverAllComissionQuery(date);
  const loading = comissionLoading || comissionFeatching;

  useEffect(() => {
    if (commissionData?.data.length) {
      setTotalExp(
        commissionData.data.reduce(
          (acc: number, curr: { exp: number }) => acc + curr.exp,
          0
        )
      );
      setTotalSell(
        commissionData.data.reduce(
          (acc: number, curr: { sell: any }) => acc + curr.sell,
          0
        )
      );
    }
  }, [commissionData]);
  return (
    <div className="my-5 border  shadow-lg mx-5">
      <div className="bg-[#3498ff] text-white px-2 py-2">
        <h2 className="text-center text-xl font-semibold">
          Overall Comission Report
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
                  console.log(value);
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

      <div className="mb-5 py-2">
        {loading ? (
          <>
            <div className="flex items-center justify-center">
              <div>
                <Loading />
              </div>
            </div>
          </>
        ) : (
          <div>
            <h2></h2>
            <Table
              loading={loading}
              data={commissionData?.data}
              cellBordered
              bordered
              height={500}
            >
              <Column flexGrow={0.5}>
                <HeaderCell children="SL" />
                <Cell dataKey="SL" />
              </Column>
              <Column flexGrow={1}>
                <HeaderCell children="Code" />
                <Cell dataKey="doctor.code" />
              </Column>
              <Column flexGrow={3}>
                <HeaderCell children="Doctor" />
                <Cell dataKey="doctor.name" />
              </Column>
              <Column flexGrow={2}>
                <HeaderCell children="Sell" />
                <Cell dataKey="sell" />
              </Column>
              <Column flexGrow={2}>
                <HeaderCell children="Exp" />
                <Cell dataKey="exp" />
              </Column>
            </Table>
            <div className="grid grid-cols-12">
              <div className="col-start-7">
                <h3 className="font-bold">Total Sell</h3>
                <div>{totaoSell}</div>
              </div>
              <div className="col-start-10">
                <h3 className="font-bold">Total Exp</h3>
                <div>{totalexp}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comission;
