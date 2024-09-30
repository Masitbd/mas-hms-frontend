/* eslint-disable react/no-children-prop */
"use client";

import { useGetAllDoctorsQuery } from "@/redux/api/financialReport/financialReportSlice";
import { IDoctor } from "@/types/allDepartmentInterfaces";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Button, SelectPicker, Table } from "rsuite";
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";
import { useGetDefaultQuery } from "@/redux/api/companyInfo/companyInfoSlice";
import { FinancialReportHeaderGenerator } from "@/components/financialStatment/HeaderGenerator";
import { useGetMarginDataQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";
import { useGetEmployeeQuery } from "@/redux/api/employee/employeeSlice";
import { IEmployeeRegistration } from "@/components/employee/TypesAndDefaults";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
const AllDoctors = () => {
  const [dataForTable, setDataForTable] = useState([]);
  const [dataForPdf, setDataForPdf]: any[] = useState([]);
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const { data: marginInfo } = useGetMarginDataQuery(undefined);
  const {
    data: employeeData,
    isLoading: EmployeeDataloading,
    isFetching: EmployeeDataFeatching,
  } = useGetEmployeeQuery(undefined);

  const pageMargin = marginInfo?.data?.value
    .split(",")
    .map((val: any) => Number(val.trim()));

  const [employee, setEmployee] = useState("");
  const { data, isLoading, isFetching } = useGetAllDoctorsQuery({
    id: employee,
  } as { id: string });

  const {
    data: companyInfoData,
    isLoading: companyInfoLoading,
    isFetching: companyInfoFeatching,
  } = useGetDefaultQuery(undefined);

  const [headers, setHeaders] = useState([]);
  useEffect(() => {
    (async function () {
      if (!companyInfoFeatching && !companyInfoFeatching) {
        await FinancialReportHeaderGenerator(companyInfoData?.data).then(
          (data) => setHeaders(data as never[])
        );
      }
    })();
  }, [
    companyInfoData,
    companyInfoFeatching,
    companyInfoFeatching,
    data,
    isFetching,
    isLoading,
  ]);
  const generatePDF = () => {
    const documentDefinition: any = {
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 12,
      },
      pageMargins: headers ? [20, 20, 20, 20] : pageMargin,
      content: [
        ...headers,
        {
          text: `Doctor's List`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 0],
        },
        //  table header
        ...dataForPdf?.map((d: any) => {
          const empDetails = {
            text: `${d?.doctors[0]?.assignedME?.name}`,
            style: "groupHeader",
            alignment: "left",
            margin: [0, 20, 0, 0],
          };
          const doctorTAble = {
            table: {
              widths: [80, 250, 90, "*"], // Fixed column widths
              headerRows: 1,
              body: [
                [
                  { text: "Code", style: "tableHeader" },
                  { text: "Name", style: "tableHeader" },
                  { text: "Phone", style: "tableHeader" },
                  { text: "Address", style: "tableHeader" },
                ],
                ...d?.doctors?.map((dd: Partial<IDoctor>) => [
                  dd.code ?? " ",
                  dd?.title + " " + dd?.name,
                  dd.phone ?? " ",
                  dd?.address ?? " ",
                ]),
              ],
            },
            margin: [0, 0, 0, 0],
          };

          return [empDetails, doctorTAble];
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

  // Processing data for table and pdf

  useEffect(() => {
    if (data?.data?.length) {
      const doctorData = data?.data;
      const dataForTable: any[] = [];
      let dataForPdf = [];
      const initialFilteredData = new Map();

      doctorData?.forEach((dd: IDoctor) => {
        const empData = dd?.assignedME as IEmployeeRegistration;
        if (!initialFilteredData.has(empData?._id?.toString())) {
          initialFilteredData.set(empData?._id?.toString(), { doctors: [] });
        }
        initialFilteredData.get(empData?._id?.toString())?.doctors.push(dd);
      });

      initialFilteredData.forEach((value, key) => {
        const sd = value.doctors[0];
        dataForTable.push({
          name: sd.assignedME?.name,
          f: "E",
        });
        dataForTable.push(...value.doctors);
      });
      setDataForTable(dataForTable as never[]);

      dataForPdf = Array.from(initialFilteredData, ([meId, doctors]) => ({
        _id: meId,
        ...doctors,
      }));

      setDataForPdf(dataForPdf as never[]);
    }
  }, [data]);
  return (
    <div className="my-5 border  shadow-lg mx-5">
      <div className="bg-[#3498ff] text-white px-2 py-2">
        <h2 className="text-center text-xl font-semibold">All Doctors</h2>
      </div>
      <div className="px-2 mb-5 py-2 grid grid-cols-12 gap-5">
        <div className="col-span-3">
          <h3>Employees</h3>
          <div>
            <SelectPicker
              loading={EmployeeDataFeatching || EmployeeDataFeatching}
              data={
                employeeData?.data?.data &&
                employeeData?.data?.data?.map((d: IEmployeeRegistration) => ({
                  label: d.name,
                  value: d._id,
                }))
              }
              onChange={(
                value: string | null,
                event: SyntheticEvent<Element, Event>
              ) => setEmployee(value as string)}
              block
            />
          </div>
        </div>
        <div>
          {dataForPdf.length ? (
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

      <div className="py-2">
        <Table data={dataForTable} loading={isLoading || isFetching} autoHeight>
          <Column flexGrow={1}>
            <HeaderCell children="Code" />
            <Cell dataKey="code" />
          </Column>
          <Column flexGrow={3}>
            <HeaderCell children="Name" />
            <Cell>
              {(rowData: Partial<IDoctor>) => {
                return (
                  <span>{(rowData?.title ?? " ") + " " + rowData?.name}</span>
                );
              }}
            </Cell>
          </Column>
          <Column flexGrow={2}>
            <HeaderCell children="Phone" />
            <Cell dataKey="phone" />
          </Column>
          <Column flexGrow={2}>
            <HeaderCell children="Address" />
            <Cell dataKey="address" />
          </Column>
        </Table>
      </div>
    </div>
  );
};

export default AllDoctors;
