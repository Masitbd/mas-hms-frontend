/* eslint-disable react/display-name */
import React, { forwardRef, LegacyRef, useRef } from "react";
import { IOrderData } from "../order/initialDataAndTypes";
import {
  IDoctor,
  IReportGroup,
  IResultField,
} from "@/types/allDepartmentInterfaces";
import { ITestResultForParameter } from "./initialDataAndTypes";
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
                  padding: "10px 20px",
                  fontSize: "1.25rem", // text-xl
                  fontFamily: "serif",
                  fontWeight: "bold",
                }}
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
                  margin: "20px 0",
                  fontFamily: "monospace",
                  padding: "1rem 2.5rem",
                }}
              >
                {params.testResult.analyzerMachine}
              </div>
            ) : null}

            <div>
              <PatientInformaiton
                order={order}
                testResult={testResult}
                consultant={
                  { data: params.consultant } as unknown as {
                    data: { data: IDoctor };
                  }
                }
              />
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
                >
                  {fieldNames?.map((field) => {
                    if (field === "defaultValue") {
                      return null;
                    }
                    return (
                      <td
                        key={field}
                        style={{ padding: "8px", border: "1px solid black" }}
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
                  <tr>
                    <th
                      style={{
                        textTransform: "uppercase",
                        fontFamily: "serif",
                        fontWeight: "bold",
                        fontSize: "1.125rem",
                        textAlign: "left",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      {heading}:
                    </th>
                  </tr>
                  <tr
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${fieldsLength}, 1fr)`,
                    }}
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
                                      border: "1px solid black",
                                      padding: "8px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        gridColumn: "span 2",
                                        fontFamily: "serif",
                                        whiteSpace: "pre-wrap",
                                        overflowWrap: "break-word",
                                        overflow: "auto",
                                        padding: "8px",
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
                                    border: "1px solid black",
                                    padding: "8px",
                                  }}
                                >
                                  <div key={fieldName}>
                                    <span
                                      style={{
                                        fontFamily: "serif",
                                        fontWeight:
                                          fieldName === "result"
                                            ? "900"
                                            : "normal",
                                      }}
                                    >
                                      {resultField[fieldName]
                                        ? resultField[fieldName] + "   "
                                        : ""}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: "0.875rem",
                                        fontFamily: "monospace",
                                      }}
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
                  fontFamily: "monospace",
                  pageBreakInside: "avoid",
                }}
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
              fontSize: "smaller",
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
