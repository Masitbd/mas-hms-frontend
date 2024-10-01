"use client";
import AllTestsTable from "@/components/financialStatment/AllTestsTable";
import { useGetAllTestsQuery } from "@/redux/api/financialReport/financialReportSlice";
import { ITest } from "@/types/allDepartmentInterfaces";
import React, { useEffect, useState } from "react";
import { Button, Loader } from "rsuite";
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";
import { useGetDefaultQuery } from "@/redux/api/companyInfo/companyInfoSlice";
import { FinancialReportHeaderGenerator } from "@/components/financialStatment/HeaderGenerator";
import { useGetMarginDataQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const AllTests = () => {
  const { isLoading, isFetching, data } = useGetAllTestsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

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
  }, [comapnyInfo, data]);
  // margin
  const { data: marginInfo } = useGetMarginDataQuery(undefined);

  const pageMargin = marginInfo?.data?.value
    .split(",")
    .map((val: any) => Number(val.trim()));

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
          text: `All Tests`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 0],
        },

        ...data?.data?.map(
          (td: {
            _id: {
              department: string;
              departmentId: string;
              reportGroup: string;
              reportGroupId: string;
            };
            tests: ITest[];
          }) => {
            const dd = {
              text: `${td._id.department} (${td?._id.reportGroup})`,
              style: "groupHeader",
              alignment: "center",
              margin: [0, 20, 0, 0],
            };
            const testTAble = {
              table: {
                widths: [80, "*", "*"], // Fixed column widths
                headerRows: 1,
                body: [
                  ["Code", "Name", "Price"],
                  ...td?.tests?.map((td) => [
                    td?.testCode,
                    td?.label,
                    td?.price,
                  ]),
                ],
              },
              margin: [0, 0, 0, 0],
            };

            return [dd, testTAble];
          }
        ),
        // For detailed comission table
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
          <h2 className="text-center text-xl font-semibold">All Tests</h2>
        </div>
        <div className="px-2 mb-5 py-2 grid grid-cols-12 gap-5">
          {data?.data?.length ? (
            <Button
              appearance="primary"
              color="blue"
              onClick={() => generatePDF()}
            >
              Print
            </Button>
          ) : (
            " "
          )}
        </div>
        {!data?.data?.length || isLoading || isFetching ? (
          <div className="w-full h-56 flex items-center justify-center">
            {isLoading || isFetching ? (
              <>
                <div className="flex items-center justify-center">
                  <div>
                    <Loader />
                  </div>
                </div>
              </>
            ) : !data?.data?.length ? (
              <div className="text-center text-2xl font-semibold">
                No data found
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="py-2">
        <AllTestsTable
          data={data?.data}
          loading={isLoading}
          featching={isFetching}
        />
      </div>
    </div>
  );
};

export default AllTests;
