/* eslint-disable react/display-name */
import React, { forwardRef, LegacyRef, useRef } from "react";
import { IOrderData } from "../order/initialDataAndTypes";
import {
  IDoctor,
  IReportGroup,
  IResultField,
} from "@/types/allDepartmentInterfaces";
import {
  Isensitivity,
  ITEstREsultForMicroBio,
  ITestResultForParameter,
} from "./initialDataAndTypes";
import { camelToFlat } from "@/utils/CamelToFlat";
import { getPageMargins } from "./functions";
import PatientInformaiton from "./PatientInformaiton";
import { useGetSingleDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import Loading from "@/app/loading";
import { useGetMiscQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";
import { Grid, Table } from "rsuite";
import { ISensitivity } from "../bactrologicalInfo/typesAndInitialData";

const ReportViewerMicro = React.forwardRef(
  (
    params: {
      order: IOrderData;
      reportGroup: IReportGroup;
      result: ITEstREsultForMicroBio;
      specimenWiseDescription: { title: string; value: string };
    },

    ref: LegacyRef<HTMLDivElement>
  ) => {
    const { Cell, Column, ColumnGroup, HeaderCell } = Table;
    const { order, reportGroup, result, specimenWiseDescription } = params;

    const temp = result?.temperature;
    const bact = result?.bacteria;
    const dur = result?.duration;
    const cond = result?.condition;
    const replacePlaceholders = (str: string) => {
      if (str) {
        return str
          .replace("${temp}", temp + "°")
          .replace("${bact}", bact as string)
          .replace("${dur}", dur)
          .replace("${cond}", cond);
      } else return " ";
    };

    const fields = ["ANTIBIOTIC", "mic", "interpretation", "breakPoint"];

    const growth = result?.growth || false;

    return (
      <>
        <div ref={ref}>
          <div>
            <PatientInformaiton
              order={params.order}
              testResult={params.result}
            />
          </div>
          <table style={{ width: "100%" }}>
            <tr>
              <th style={{ paddingTop: "2rem", paddingBottom: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      padding: "0.5rem",
                      border: "1px solid black",
                      borderRadius: "5px",
                      fontSize: "1.5rem",
                    }}
                  >
                    {params.reportGroup.label}
                  </div>
                </div>
              </th>
            </tr>

            {!growth ? (
              <>
                <tr style={{ fontFamily: "serif" }}>
                  <td>
                    <h3 style={{ fontWeight: "bold", fontSize: "larger" }}>
                      CULTURE OF {result?.specimen}
                    </h3>

                    <span style={{ fontFamily: "sans-serif" }}>
                      {" "}
                      {replacePlaceholders(specimenWiseDescription?.value)}
                    </span>
                  </td>
                </tr>
              </>
            ) : (
              <>
                <tr>
                  <td
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(12,1fr)",
                    }}
                  >
                    <div style={{ gridColumn: "span 3" }}>Shows Growth Of:</div>
                    <div style={{ fontSize: "large", fontWeight: "normal" }}>
                      {result.bacteria}
                    </div>
                    <div style={{ gridRowStart: "2", gridColumn: "span 3" }}>
                      Colony Count:
                    </div>
                    <div
                      style={{
                        gridRowStart: "2",
                        gridColumn: "span 3",
                        width: "100%",
                        fontSize: "large",
                      }}
                    >
                      <code style={{ display: "block" }}>
                        1 X {result?.colonyCount?.base} 10
                        <sup>{result?.colonyCount?.power}</sup> /ml.
                      </code>
                    </div>
                  </td>
                </tr>

                {result?.sensivityOptions &&
                  result.sensivityOptions.length > 0 && (
                    <>
                      {" "}
                      <tr>
                        <th
                          style={{
                            fontFamily: "serif",
                            fontSize: "1.5rem",
                            border: "1px solid black",
                            textTransform: "uppercase",
                          }}
                          colSpan={4}
                        >
                          ANTI BIOGRAM OF ORGANISMS ISOLATED
                        </th>
                      </tr>
                      <tr
                        style={{
                          display: "grid",
                          gridTemplateColumns: `repeat(12, 1fr)`,
                          textAlign: "left",
                          textTransform: "uppercase",
                          fontSize: "medium",
                          wordWrap: "break-word",
                        }}
                      >
                        <th
                          style={{
                            gridColumn: "span 5",
                            border: "1px solid black",
                            padding: "8px",
                            textTransform: "uppercase",
                          }}
                        >
                          {fields[0]}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            gridColumn: "span 2",
                            padding: "8px",
                            textTransform: "uppercase",
                          }}
                        >
                          {fields[1]}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            gridColumn: "span 3",
                            padding: "8px",
                            textTransform: "uppercase",
                          }}
                        >
                          {fields[2]}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            gridColumn: "span 2",
                            padding: "8px",
                            textTransform: "uppercase",
                          }}
                        >
                          {fields[3]}
                        </th>
                      </tr>
                      {result?.sensivityOptions &&
                        result?.sensivityOptions?.length > 0 &&
                        result.sensivityOptions?.map(
                          (sensitivity: ISensitivity) => {
                            return (
                              <tr
                                key={sensitivity?._id}
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: `repeat(12, 1fr)`,
                                  textAlign: "left",
                                  fontSize: "medium",
                                }}
                              >
                                {fields.map((field: string) => {
                                  return (
                                    <>
                                      <td
                                        style={{
                                          border: "1px solid black",
                                          gridColumn:
                                            field == fields[0]
                                              ? "span 5"
                                              : field == fields[2]
                                              ? "span 3"
                                              : "span 2",
                                          padding: "6px",
                                        }}
                                        key={fields[0]}
                                      >
                                        {field == fields[0]
                                          ? sensitivity.value
                                          : sensitivity[
                                              field as keyof ISensitivity
                                            ]}
                                      </td>
                                    </>
                                  );
                                })}
                              </tr>
                            );
                          }
                        )}
                    </>
                  )}
              </>
            )}
            {result?.comment ? (
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
                  colSpan={4}
                  dangerouslySetInnerHTML={{
                    __html: result?.comment,
                  }}
                  style={{
                    overflowWrap: "break-word",
                    paddingTop: "3rem",
                  }}
                />
              </tr>
            ) : (
              ""
            )}

            <tfoot>
              <tr>
                <td>
                  <div className="footer-space" style={{ height: "100px" }}>
                    &nbsp;
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
          <div>
            {result.seal ? (
              <div
                style={{
                  bottom: 0,
                  width: "100%",
                  fontSize: "smaller",
                }}
                id="seals"
              >
                <div
                  style={{
                    whiteSpace: "pre-wrap",

                    fontFamily: "monospace",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: result?.seal,
                  }}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </>
    );
  }
);

export default ReportViewerMicro;
