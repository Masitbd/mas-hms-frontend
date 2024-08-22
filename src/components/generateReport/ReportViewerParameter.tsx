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
        <div className=" my-5 mx-5 printable-div" ref={ref}>
          <div className="flex items-center justify-center">
            <div className=" border border-3 border-stone-700 rounded-md px-5 py-2 text-xl font-serif font-bold">
              {params.reportGroup.label}
            </div>
          </div>
          {params?.testResult?.analyzerMachine ? (
            <>
              <div
                className="border rounded-md px-2 p-3 text-center my-5 border-black"
                style={{
                  fontFamily: "monospace",
                  padding: "1rem 2.5rem",
                }}
              >
                {params.testResult.analyzerMachine}
              </div>
            </>
          ) : (
            ""
          )}
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

          <div className="border rounded-md p-2">
            {params.reportGroup.testResultType !== "descriptive" && (
              <>
                <div className={`grid ${"grid-cols-" + fieldsLength} `}>
                  {fieldNames?.map((field) => {
                    if (field == "defaultValue") {
                      return;
                    }
                    return (
                      <div key={field} className="pb-2">
                        <span className="font-bold px-4">
                          {camelToFlat(field)}{" "}
                        </span>
                        {}
                      </div>
                    );
                  })}
                </div>
                <hr />
              </>
            )}

            <div className={` py-2`}>
              {headings.map((heading: string) => {
                return (
                  <>
                    <div
                      className={`uppercase font-serif font-bold col-span-4 text-lg py-1`}
                    >
                      {heading}:
                    </div>
                    <div className={`grid ${"grid-cols-" + fieldsLength}`}>
                      {resultFields.map((resultField: IResultField) => {
                        if (resultField.investigation === heading) {
                          return fieldNames.map((fieldName: string) => {
                            return (
                              <>
                                {params.reportGroup.testResultType ==
                                "descriptive" ? (
                                  <>
                                    {fieldName == "result" ? (
                                      <div>
                                        <div
                                          className="col-span-2  font-serif"
                                          dangerouslySetInnerHTML={{
                                            __html: resultField?.result,
                                          }}
                                        ></div>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </>
                                ) : (
                                  <div>
                                    <hr />
                                    <div key={fieldName} className=" py-3 px-2">
                                      <span
                                        className={`${
                                          fieldName == "result"
                                            ? "font-extrabold"
                                            : ""
                                        } font-serif `}
                                      >
                                        {resultField[fieldName]
                                          ? resultField[fieldName] + "   "
                                          : ""}
                                      </span>
                                      <span className="text-sm font-mono">
                                        {fieldName == "result"
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
            <div className="border border-1  p-2 grid grid-cols-2 gap-1 my-5 rounded-md font-serif">
              <div
                dangerouslySetInnerHTML={{
                  __html: params?.testResult?.comment,
                }}
              />
            </div>
          ) : (
            ""
          )}
          <div>
            {params?.testResult?.seal ? (
              <div className="flex justify-end items-end font-serif mt-5">
                <div
                  dangerouslySetInnerHTML={{
                    __html: params?.testResult?.seal,
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

export default ReportViewerParameter;
