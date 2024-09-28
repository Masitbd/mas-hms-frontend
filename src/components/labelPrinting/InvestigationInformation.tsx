/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from "react";
import { IOrderData } from "../order/initialDataAndTypes";
import { Button, Checkbox, Table } from "rsuite";
import { ITestsFromOrder } from "../generateReport/initialDataAndTypes";
import { ITest } from "@/types/allDepartmentInterfaces";
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const InvestigationInformation = (params: { order: IOrderData }) => {
  const { order } = params;
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const [dataForTable, setdataForTable] = useState<ITestsFromOrder[]>([]);
  const [dataForPrint, setDataForPrint] = useState<number[]>([]);
  const [dataForLabel, setDataForLable] = useState<ITest[]>();
  const [dataForSticker, setDataForSticker] = useState<ITest[]>();
  const orderDate = new Date(order?.createdAt as string).toLocaleDateString();

  useEffect(() => {
    if (params?.order?._id) {
      // filtering data for table
      const filteredData = params?.order?.tests.filter(
        (test: {
          SL: number;
          test: string | ITest | undefined;
          status: string;
          discount: number;
          remark?: string;
        }) => test?.status !== "tube" && test?.status !== "refunded"
      );
      setdataForTable(filteredData as ITestsFromOrder[]);
    }
  }, [params.order]);

  //   Filtering Data for label and Sticker
  useEffect(() => {
    if (dataForPrint && dataForTable) {
      const selectedTests = dataForTable.filter((t) =>
        dataForPrint.includes(t.SL)
      );
      let selectedForLabel: ITest[] = [];
      let selectedForSticker: ITest[] = [];
      if (selectedTests.length) {
        selectedTests.forEach((t) => {
          if (t.test.hasTestTube) {
            selectedForSticker.push(t.test);
          } else {
            selectedForLabel.push(t.test);
          }
        });
      }
      setDataForLable(selectedForLabel);
      setDataForSticker(selectedForSticker);
    }
  }, [dataForPrint]);

  const generateLabel = async () => {
    const data = new Map();
    if (dataForLabel?.length) {
      dataForLabel.forEach((t) => {
        if (!data.has(t.reportGroup)) {
          data.set(t.reportGroup, { test: [] });
        }
        data.get(t.reportGroup)?.test?.push(t);
      });
    } else {
      return;
    }
    const dataArray = Array.from(data, ([reportGroup, test]) => ({
      reportGroup,
      ...test,
    }));
    const documentDefinition: any = {
      pageOrientation: "portrait",
      defaultStyle: {
        fontSize: 10,
      },

      pageMargins: [5, 5, 5, 5],
      content: [
        ...dataArray.map((td) => {
          return {
            table: {
              heights: [10, 20, 10, 10, 30, 50],
              widths: [60, 215],
              body: [
                [
                  {
                    text: "Oid :",
                    fillColor: "#eeeeee",
                    style: { bold: true },
                  },
                  {
                    text: `${order?.oid ?? " "}`,
                    fillColor: "#eeeeee",
                    style: { bold: true },
                  },
                ],
                [
                  { text: "Pat. Name :" },
                  { text: `${order?.patient?.name ?? " "}` },
                ],
                [
                  { text: "Age :" },
                  {
                    text: `${order?.patient?.age ?? " "}     Sex: ${
                      order?.patient?.gender ?? " "
                    }`,
                  },
                ],
                [
                  { text: "BIll Date :" },
                  { text: `${order?.createdAt ? orderDate : " "}` },
                ],
                [
                  { text: "REFd. By" },
                  {
                    text: `${
                      order?.refBy &&
                      typeof order?.refBy === "object" &&
                      order?.refBy?.title
                        ? order?.refBy?.title + order?.refBy?.name
                        : " "
                    }`,
                  },
                ],
                [
                  { text: "Tests :" },
                  {
                    text: `${td?.test?.map((t: ITest) => t.label)?.join(", ")}`,
                  },
                ],
              ],
            },
            layout: "noBorders",
          };
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

  // For label printing
  const generateSticker = async () => {
    const data = new Map();
    if (dataForSticker?.length) {
      dataForSticker.forEach((t) => {
        if (!data.has(t.reportGroup)) {
          data.set(t.reportGroup, { test: [] });
        }
        data.get(t.reportGroup)?.test?.push(t);
      });
    } else {
      return;
    }
    const dataArray = Array.from(data, ([reportGroup, test]) => ({
      reportGroup,
      ...test,
    }));
    const documentDefinition: any = {
      pageOrientation: "portrait",
      defaultStyle: {
        fontSize: 10,
      },

      pageMargins: [5, 5, 5, 5],
      content: [
        ...dataArray.map((td) => {
          return {
            table: {
              widths: [105],

              body: [
                [
                  {
                    text: `${order?.oid ?? " "}`,
                    fillColor: "#eeeeee",
                    style: { bold: true },
                  },
                ],
                [
                  {
                    text: `${order?.patient?.name ?? " "}`,

                    style: { bold: true },
                  },
                ],
                ...td?.test?.map((t: ITest) => [t?.label]),
              ],
            },
            layout: "noBorders",
            margin: [0, 0, 0, 5],
          };
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
    <div>
      <Table data={dataForTable} autoHeight>
        <Column flexGrow={2}>
          <HeaderCell children={"Test Name"} />
          <Cell dataKey="test.label" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell children={"Rate"} />
          <Cell dataKey="test.price" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell children={"Select for Print"} />
          <Cell>
            {(rowData: ITestsFromOrder) => {
              return (
                <>
                  <Checkbox
                    value={rowData?.SL}
                    onChange={(e, v) => {
                      const data = new Set(dataForPrint);
                      const eventValue = Number(e);
                      if (v) {
                        data.add(eventValue);
                        setDataForPrint(Array.from(data));
                      }
                      if (!v) {
                        data.delete(eventValue);
                        setDataForPrint(Array.from(data));
                      }
                    }}
                  />
                </>
              );
            }}
          </Cell>
        </Column>
      </Table>
      {dataForTable.length &&
        (dataForPrint.length ? (
          <div className="my-5 grid grid-cols-12 gap-5">
            {dataForLabel?.length ? (
              <Button
                appearance="primary"
                color="blue"
                onClick={() => generateLabel()}
              >
                Print Label
              </Button>
            ) : (
              ""
            )}
            {dataForSticker?.length ? (
              <Button
                appearance="primary"
                color="green"
                onClick={() => generateSticker()}
              >
                Print Sticker
              </Button>
            ) : (
              ""
            )}
          </div>
        ) : (
          <>
            <div className="my-5 font-bold">
              Please Select the tests from the above table
            </div>
          </>
        ))}
    </div>
  );
};

export default InvestigationInformation;
