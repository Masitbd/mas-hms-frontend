/* eslint-disable react/no-children-prop */
"use client";
import { IEmployeeRegistration } from "@/components/employee/TypesAndDefaults";
import {
  defaultDate,
  IdefaultDate,
} from "@/components/financialReport/comission/initialDataAndTypes";
import { useGetEmployeeQuery } from "@/redux/api/employee/employeeSlice";
import { useGetEmployeePerformanceQuery } from "@/redux/api/financialReport/financialReportSlice";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Button, DatePicker, SelectPicker, Table } from "rsuite";
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const EmployeePerformance = () => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const [date, setDate] = useState<IdefaultDate>(defaultDate as IdefaultDate);
  const [dataForTable, setDataForTable] = useState<IEmployeePerformanceMain[]>(
    []
  );
  const [dataForPrint, setDataForPrint] = useState<
    { MEId: string; docs: IEmployeePerformanceMain[] }[] | []
  >([]);

  const dateChangeHandler = (value: Partial<IdefaultDate>) => {
    setDate((prevValue) => ({ ...prevValue, ...value }));
  };

  const {
    data: employeeData,
    isLoading: employeeDataLoading,
    isFetching: employeeDataFeatching,
  } = useGetEmployeeQuery(undefined);
  const {
    data: employeePerformanceData,
    isLoading: performanceDataLoading,
    isFetching: performanceDataFeatching,
  } = useGetEmployeePerformanceQuery(date);

  useEffect(() => {
    if (employeePerformanceData?.data[0]?.mainDocs?.length) {
      const Employees = new Set<string>();
      const DataForPrint = new Map();
      employeePerformanceData?.data[0].mainDocs.forEach(
        (doc: IEmployeePerformanceMain) => {
          Employees.add(doc.MEId);

          if (!DataForPrint.has(doc.MEId)) {
            DataForPrint.set(doc.MEId, { docs: [] });
          }
          DataForPrint.get(doc.MEId)?.docs.push(doc);
        }
      );
      // construting a array or object from the merketing executive data
      const finalData = Array.from(DataForPrint, ([id, docs]) => ({
        MEId: id,
        ...docs,
      }));
      setDataForPrint([
        ...finalData,
        { MEId: "Total", docs: employeePerformanceData?.data[0]?.totalDocs },
      ] as unknown as []);

      const DataForTable: IEmployeePerformanceMain[] = []; //f: "E" refers flag for employee Name data only
      Employees.forEach((id: string) => {
        const performnace = employeePerformanceData?.data[0].mainDocs.filter(
          (doc: IEmployeePerformanceMain) => doc.MEId == id
        );
        if (performnace.length) {
          DataForTable.push(
            {
              _id: "E",
              marketingExecutive: performnace[0].marketingExecutive,
            } as never,
            ...performnace
          );
        }
      });

      setDataForTable([
        ...DataForTable,
        ...employeePerformanceData?.data[0]?.totalDocs,
      ]);
    } else {
      setDataForTable([]);
      setDataForPrint([]);
    }
  }, [
    employeePerformanceData,
    performanceDataLoading,
    employeePerformanceData,
  ]);

  // Pdf Generation
  const generatePDF = () => {
    const documentDefinition: any = {
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 10,
      },
      pageMargins: [20, 20, 20, 20],
      content: [
        {
          text: `Marketing Executive Performance: Between ${date.from.toLocaleDateString()} to  ${date.to.toLocaleDateString()}`,
          style: "groupHeader",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        ...dataForPrint?.flatMap((d) => {
          return [
            {
              text: `${d.docs[0].marketingExecutive}`,
              style: "groupHeader",
              alignment: "left",
              margin: [0, 20, 0, 0],
            },

            {
              table: {
                widths: [80, "*", 100, 150, "*", "*", "*", "*", "*", "*"], // Fixed column widths
                headerRows: 1,
                body: [
                  [
                    { text: "OID", style: "tableHeader" },
                    { text: "Date", style: "tableHeader" },
                    { text: "Patient", style: "tableHeader" },
                    { text: "RefBy", style: "tableHeader" },
                    { text: "Total", style: "tableHeader" },
                    { text: "Discount", style: "tableHeader" },
                    { text: "vat", style: "tableHeader" },
                    { text: "Net Price", style: "tableHeader" },
                    { text: "Paid", style: "tableHeader" },
                    { text: "Due", style: "tableHeader" },
                  ],
                  ...d?.docs?.map((sd) => {
                    const date = new Date(sd.createdAt).toLocaleDateString();
                    const totalPrice = sd.totalPrice || 0;
                    const totalDiscount = sd.totalDiscount || 0;
                    const totalVat = sd.totalVat || 0;
                    const paid = sd.paid || 0;
                    const netPrice = Math.ceil(
                      totalPrice - totalDiscount + totalVat
                    );
                    const due = netPrice - paid > 0 ? netPrice - paid : 0;

                    return [
                      sd.oid,
                      sd?.createdAt ? date : "-",
                      sd?.patient ?? "-",
                      sd?.doctor ?? "-",
                      totalPrice,
                      totalDiscount,
                      totalVat,
                      netPrice,
                      paid,
                      due,
                    ];
                  }),
                ],
              },
            },
          ];
        }),
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
            Marketing Executive Preformance
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
                    value.setHours(0, 0, 0, 0);
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
          <div className="col-span-3 ">
            <h3>Employee</h3>
            <div>
              <SelectPicker
                loading={employeeDataFeatching || employeeDataLoading}
                data={employeeData?.data?.data?.map(
                  (ed: IEmployeeRegistration) => {
                    return { label: ed.name, value: ed._id };
                  }
                )}
                onChange={(v) =>
                  v &&
                  setDate((prevData) => {
                    return {
                      ...prevData,
                      id: v,
                    };
                  })
                }
                onClean={() => {
                  const data = Object.assign({}, date);
                  if (Object.hasOwn(data, "id")) {
                    delete data?.id;
                  }
                  setDate(data);
                }}
                block
              />
            </div>
          </div>
          <div>
            {dataForPrint?.length ? (
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
              Marketing Executive Preformance
            </h3>
            <h4 className="text-center text-lg font-serif">
              From <b> {new Date(date.from).toLocaleDateString()} </b> To{" "}
              <b>{new Date(date.to).toLocaleDateString()}</b>
            </h4>
          </div>
        </div>
        <div>
          <Table
            data={dataForTable}
            wordWrap={"break-word"}
            bordered
            cellBordered
            loading={performanceDataLoading || performanceDataFeatching}
            autoHeight
            rowHeight={65}
          >
            <Column flexGrow={1.5}>
              <HeaderCell children={"Marketing Executicve"} />
              <Cell>
                {(rowData) => {
                  return (
                    <>{rowData._id == "E" ? rowData?.marketingExecutive : ""}</>
                  );
                }}
              </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell children={"Oid"} />
              <Cell dataKey="oid" />
            </Column>
            <Column flexGrow={1}>
              <HeaderCell children={"Date"} />
              <Cell>
                {(rowData) => {
                  const cDate = new Date(
                    rowData.createdAt
                  ).toLocaleDateString();
                  return <>{rowData.createdAt ? cDate : ""}</>;
                }}
              </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell children={"Patient"} />
              <Cell dataKey="patient" />
            </Column>
            <Column flexGrow={2}>
              <HeaderCell children={"Ref By"} />
              <Cell dataKey="doctor" />
            </Column>
            <Column flexGrow={1}>
              <HeaderCell children={"Total"} />
              <Cell dataKey="totalPrice" />
            </Column>
            <Column flexGrow={0.5}>
              <HeaderCell children={"Discount"} />
              <Cell dataKey="totalDiscount" />
            </Column>
            <Column flexGrow={0.5}>
              <HeaderCell children={"Vat"} />
              <Cell dataKey="totalVat" />
            </Column>
            <Column flexGrow={1}>
              <HeaderCell children={"Net Price"} />
              <Cell>
                {(rowData: IEmployeePerformanceMain) => {
                  const totalPrice = rowData.totalPrice || 0;
                  const totalDiscount = rowData.totalDiscount || 0;
                  const totalVat = rowData.totalVat || 0;
                  const netPrice = Math.ceil(
                    totalPrice - totalDiscount + totalVat
                  );

                  return <>{rowData._id !== "E" && netPrice}</>;
                }}
              </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell children={"Paid"} />
              <Cell dataKey="paid" />
            </Column>
            <Column flexGrow={1}>
              <HeaderCell children={"Net Price"} />
              <Cell>
                {(rowData: IEmployeePerformanceMain) => {
                  const totalPrice = rowData.totalPrice || 0;
                  const totalDiscount = rowData.totalDiscount || 0;
                  const totalVat = rowData.totalVat || 0;
                  const netPrice = Math.ceil(
                    totalPrice - totalDiscount + totalVat
                  );
                  const paid = rowData.paid || 0;
                  const dueAMount = totalPrice - paid;

                  return (
                    <>{rowData._id !== "E" && dueAMount > 0 ? dueAMount : 0}</>
                  );
                }}
              </Cell>
            </Column>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default EmployeePerformance;
