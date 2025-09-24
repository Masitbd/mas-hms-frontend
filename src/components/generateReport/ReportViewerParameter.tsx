/* eslint-disable react/display-name */
import React, { forwardRef, LegacyRef, useRef } from "react";
import { IOrderData } from "../order/initialDataAndTypes";
import {
  IDoctor,
  IReportGroup,
  IResultField,
  ITest,
} from "@/types/allDepartmentInterfaces";
import {
  ITestResultForParameter,
  ITestsFromOrder,
} from "./initialDataAndTypes";
import { camelToFlat } from "@/utils/CamelToFlat";
import { getPageMargins } from "./functions";
import PatientInformaiton from "./PatientInformaiton";
import printIcon from "../../assets/images/print_img.png";
import Image from "next/image";

const ReportViewerParameter = React.forwardRef(
  (
    params: {
      order: IOrderData;
      reportGroup: IReportGroup;
      testResult: ITestResultForParameter;
      fieldNames: string[];
      headings: string[];
      resultFields: IResultField[];
      consultant: IDoctor;
      tests: ITestsFromOrder[];
      toggle: boolean;
    },
    ref: LegacyRef<HTMLDivElement>
  ) => {
    const { order, testResult, headings, fieldNames, resultFields } = params;
    let fieldsLength = fieldNames.length.toString();
    if (params.reportGroup.testResultType == "descriptive") {
      fieldsLength = "1";
    }

    return (
      <>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            padding: "10px",
            tableLayout: "auto",
          }}
        >
          <thead>
            <div>
              <PatientInformaiton
                order={order as IOrderData & { refBy: IDoctor }}
                testResult={testResult}
                consultant={
                  { data: params.consultant } as unknown as {
                    data: { data: IDoctor };
                  }
                }
                reportGroup={params.reportGroup._id}
                tests={params.tests}
                reportGroupData={params.reportGroup}
              />
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    border: "3px solid #4b5563", // stone-700
                    borderRadius: "8px",
                    padding: "5px 10px",
                    fontSize: "1rem", // text-xl

                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                  className="font-arial"
                >
                  {params.reportGroup.label}
                </div>
              </div>
              {params?.testResult?.analyzerMachine ? (
                <div
                  style={{
                    border: "1px solid black",
                    borderRadius: "8px",
                    textAlign: "center",
                    margin: "10px 0",

                    padding: ".5rem 2.5rem",
                  }}
                  className="font-arial"
                >
                  {params.testResult.analyzerMachine}
                </div>
              ) : null}
            </div>
          </thead>
          <tbody>
            {params.reportGroup.testResultType !== "descriptive" && (
              <>
                <tr
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${fieldsLength}, 1fr)`,
                    backgroundColor: "#e7e7e7",
                  }}
                  className="font-arial"
                >
                  {fieldNames?.map((field) => {
                    if (field === "defaultValue") {
                      return null;
                    }
                    return (
                      <td
                        key={field}
                        style={{
                          padding: "2px 4px",
                          border: ".001px solid black",
                          fontSize: ".950rem",
                        }}
                        className="font-arial"
                      >
                        <span style={{ fontWeight: "bold" }}>
                          {camelToFlat(field)}{" "}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              </>
            )}

            {headings.map((heading: string) => {
              const doesHaveResult = resultFields.find(
                (v) => v.investigation === heading
              );
              if (!doesHaveResult) return null;
              return (
                <>
                  {params?.toggle ? (
                    <tr>
                      <th
                        style={{
                          textTransform: "uppercase",

                          fontWeight: "bold",
                          fontSize: ".850rem",
                          textAlign: "left",
                          border: ".001px dotted black",
                          padding: "2px",
                        }}
                        className="font-arial"
                      >
                        {heading}:
                      </th>
                    </tr>
                  ) : (
                    <></>
                  )}
                  <tr
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${fieldsLength}, 1fr)`,
                      fontSize: "medium",
                    }}
                    className="font-arial"
                  >
                    {resultFields.map((resultField: IResultField) => {
                      if (resultField.investigation === heading) {
                        return fieldNames.map((fieldName: string) => {
                          return (
                            <>
                              {params.reportGroup.testResultType ===
                              "descriptive" ? (
                                fieldName === "result" ? (
                                  <td
                                    style={{
                                      // border: ".001px dotted black",
                                      padding: "1px !important",
                                    }}
                                  >
                                    <div
                                      style={{
                                        gridColumn: "span 2",

                                        whiteSpace: "pre-wrap",
                                        overflowWrap: "break-word",
                                        overflow: "auto",
                                        padding: "1px",
                                        fontSize: ".850rem",
                                      }}
                                      dangerouslySetInnerHTML={{
                                        __html: resultField?.result,
                                      }}
                                    />
                                  </td>
                                ) : null
                              ) : (
                                <td
                                  style={{
                                    borderBottom: ".1rem dotted gray ",
                                    padding: "2px 4px",
                                    fontSize: ".850rem",
                                  }}
                                >
                                  <div key={fieldName}>
                                    <span
                                      style={{
                                        fontWeight:
                                          fieldName === "result"
                                            ? "900"
                                            : "normal",
                                      }}
                                      className="font-arial"
                                    >
                                      {resultField[fieldName]
                                        ? resultField[fieldName] + "   "
                                        : ""}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: ".850rem",
                                      }}
                                      className="font-arial"
                                    >
                                      {fieldName === "result"
                                        ? resultField?.unit
                                          ? resultField.unit
                                          : " "
                                        : "  "}
                                    </span>
                                  </div>
                                </td>
                              )}
                            </>
                          );
                        });
                      }
                      return null;
                    })}
                  </tr>
                </>
              );
            })}

            {params?.testResult?.comment ? (
              <tr
                style={{
                  padding: "10px",
                  margin: "20px 0",
                  borderRadius: "8px",

                  pageBreakInside: "avoid",
                }}
                className="font-arial"
              >
                <td
                  colSpan={Number(fieldsLength ?? 0)}
                  dangerouslySetInnerHTML={{
                    __html: params?.testResult?.comment,
                  }}
                  style={{
                    overflowWrap: "break-word",
                    paddingTop: "3rem",
                  }}
                />
              </tr>
            ) : null}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={Number(fieldsLength ?? 1)}>
                <div className="footer-space" style={{ height: "100px" }}>
                  &nbsp;
                </div>
              </td>
            </tr>
          </tfoot>
        </table>

        {params?.testResult?.seal ? (
          <div
            style={{
              // margin: "20px",
              // pageBreakBefore: "always",
              // breakBefore: "always",
              // maxHeight: "200px",
              // position: "fixed",
              bottom: 0,
              width: "100%",
              fontSize: "medium",
            }}
            id="seals"
          >
            <div
              style={{
                whiteSpace: "pre-wrap",
                // overflowWrap: "break-word",
                // overflow: "auto",
                fontFamily: "monospace",
              }}
              dangerouslySetInnerHTML={{
                __html: params?.testResult?.seal,
              }}
            />
          </div>
        ) : null}
      </>
    );
  }
);

export default ReportViewerParameter;
