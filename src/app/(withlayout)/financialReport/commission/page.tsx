/* eslint-disable react/no-children-prop */
"use client";
import Loading from "@/app/loading";
import {
  defaultDate,
  IdefaultDate,
} from "@/components/financialReport/comission/initialDataAndTypes";
import { useGetOverAllComissionQuery } from "@/redux/api/financialReport/financialReportSlice";
import pdfMake from "pdfmake/build/pdfmake";
import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { Button, DatePicker, SelectPicker, Table } from "rsuite";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  useGetCompnayInofQuery,
  useGetDefaultQuery,
} from "@/redux/api/companyInfo/companyInfoSlice";
import { FinancialReportHeaderGenerator } from "@/components/financialStatment/HeaderGenerator";
import { useGetMarginDataQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Comission = () => {
  const { HeaderCell, Cell, Column } = Table;
  const [date, setDate] = useState<IdefaultDate>(defaultDate as IdefaultDate);
  const dateChangeHandler = (value: Partial<IdefaultDate>) => {
    setDate((prevValue) => ({ ...prevValue, ...value }));
  };
  const {
    isLoading: comissionLoading,
    isFetching: comissionFeatching,
    data: commissionData,
  } = useGetOverAllComissionQuery(date);
  const loading = comissionLoading || comissionFeatching;

  // For printing
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
  }, [comapnyInfo, commissionData]);

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
          text: `Overall Commission Report: Between ${date.from.toLocaleDateString()} to  ${date.to.toLocaleDateString()}`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },

        // Static Table Header
        {
          table: {
            widths: [80, 80, 400, 100, 100], // Fixed column widths
            headerRows: 1,
            body: [
              [
                { text: "SL", style: "tableHeader" },
                { text: "Code", style: "tableHeader" },
                { text: "Doctor", style: "tableHeader" },
                { text: "Sell", style: "tableHeader" },
                { text: "Exp", style: "tableHeader" },
              ],
            ],
          },
          margin: [0, 0, 0, 0],
        },
        {
          table: {
            widths: [80, 80, 400, 100, 100], // Fixed column widths
            body: commissionData.data.map((cd: any) => [
              cd.SL,
              cd.doctor?.code ? cd?.doctor?.code : " ",
              cd?.doctor?.name,
              cd?.sell,
              cd?.exp,
            ]),
          },
        },
        ,
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
          {commissionData?.data?.length ? (
            <>
              <br />
              <div>
                <Button
                  onClick={() => generatePDF()}
                  appearance="primary"
                  color="blue"
                >
                  Print
                </Button>
              </div>
            </>
          ) : (
            ""
          )}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Comission;
