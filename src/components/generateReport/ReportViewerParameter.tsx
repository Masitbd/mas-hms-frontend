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
        <div
          ref={ref}
          style={{ margin: "20px", padding: "10px", width: "260mm" }}
        >
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
                padding: "20px",
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

          <div
            style={{
              border: "1px solid",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            {params.reportGroup.testResultType !== "descriptive" && (
              <>
                <div
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
                      <div key={field} style={{ paddingBottom: "8px" }}>
                        <span style={{ fontWeight: "bold" }}>
                          {camelToFlat(field)}{" "}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <hr />
              </>
            )}

            <div>
              {headings.map((heading: string) => {
                const doesHaveResult = resultFields.find(
                  (v) => v.investigation === heading
                );
                if (!doesHaveResult) return null;
                return (
                  <>
                    <div
                      style={{
                        textTransform: "uppercase",
                        fontFamily: "serif",
                        fontWeight: "bold",
                        fontSize: "1.125rem",
                        borderBottom: "1px solid black",
                        paddingTop: "10px",
                      }}
                    >
                      {heading}:
                    </div>
                    <div
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
                                    <div>
                                      <div
                                        style={{
                                          gridColumn: "span 2",
                                          fontFamily: "serif",
                                          whiteSpace: "pre-wrap",
                                          overflowWrap: "break-word",
                                          overflow: "auto",
                                        }}
                                        dangerouslySetInnerHTML={{
                                          __html: resultField?.result,
                                        }}
                                      />
                                    </div>
                                  ) : null
                                ) : (
                                  <div
                                    style={{
                                      borderBottom: "1px solid black",
                                      padding: "5px",
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
                                  </div>
                                )}
                              </>
                            );
                          });
                        }
                        return null;
                      })}
                    </div>
                  </>
                );
              })}
            </div>
          </div>

          {params?.testResult?.comment ? (
            <div
              style={{
                border: "1px solid",
                padding: "10px",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "4px",
                margin: "20px 0",
                borderRadius: "8px",
                fontFamily: "serif",
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: params?.testResult?.comment,
                }}
                style={{ whiteSpace: "pre", width: "270mm" }}
              />
            </div>
          ) : null}
        </div>
        {params?.testResult?.seal ? (
          <div
            style={{
              fontFamily: "Roboto",
              margin: "20px",
              padding: "10px",

              fontSize: "0.875rem",
              width: "270mm",
              pageBreakBefore: "always",
              breakBefore: "always",
            }}
            id="seals"
          >
            <div
              style={{
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
                overflow: "auto",
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
