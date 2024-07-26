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

const ReportViewerParameter = React.forwardRef(
  (
    params: {
      order: IOrderData;
      reportGroup: IReportGroup;
      testResult: ITestResultForParameter;
      fieldNames: string[];
      headings: string[];
      resultFields: IResultField[];
    },
    ref: LegacyRef<HTMLDivElement>
  ) => {
    const { order, testResult, headings, fieldNames, resultFields } = params;
    const refByInfromation = () => {
      if (order?.refBy) {
        const refBy: IDoctor = order?.refBy as unknown as IDoctor;

        if ("title" in refBy || "name" in refBy) {
          return (
            <>
              <div>
                <span className="font-bold">RefBy: </span>
                {refBy.title} {refBy.name}
              </div>
            </>
          );
        } else {
          return "";
        }
      }
    };
    const fieldsLength = fieldNames.length.toString();

    return (
      <>
        <div className=" my-5 mx-5 printable-div" ref={ref}>
          <div className="flex items-center justify-center">
            <div className=" border border-3 border-stone-700 rounded-md px-5 py-2 text-xl font-serif font-bold">
              {params.reportGroup.label}
            </div>
          </div>
          <div className="border border-1 border-stone-400 p-2 grid grid-cols-2 gap-1 my-5 rounded-md">
            <div>
              <span className="font-bold">ID: </span>
              {order.oid}
            </div>
            <div>
              <span className="font-bold">Name: </span>
              {order.patient?.name}
            </div>
            <div>
              <span className="font-bold">Age: </span>
              {order.patient?.age} Year(s)
            </div>
            <div>
              <span className="font-bold">Sex: </span>
              {order.patient?.gender}
            </div>
            {refByInfromation()}
            <div>
              <span className="font-bold">Receiving Date: </span>
              {new Date(order.createdAt as Date).toDateString()}
            </div>
            <div>
              <span className="font-bold">Report Creation Date: </span>
              {new Date(
                testResult?.createdAt as unknown as Date
              ).toDateString()}
            </div>
            <div>
              <span className="font-bold">Specimen: </span>
            </div>
          </div>

          <div className="border rounded-md p-2">
            <div className={`grid ${"grid-cols-" + fieldsLength} `}>
              {fieldNames?.map((field) => {
                if (field == "defaultValue") {
                  return;
                }
                return (
                  <div key={field}>
                    <span className="font-bold px-4">
                      {camelToFlat(field)}{" "}
                    </span>
                    {}
                  </div>
                );
              })}
            </div>
            <hr />

            <div className={` py-2`}>
              {headings.map((heading: string) => {
                return (
                  <>
                    <div
                      className={`uppercase font-serif font-bold col-span-4 text-lg underline`}
                    >
                      {heading}:
                    </div>
                    <div className={`grid ${"grid-cols-" + fieldsLength}   `}>
                      {resultFields.map((resultField: IResultField) => {
                        if (resultField.investigation === heading) {
                          return fieldNames.map((fieldName: string) => {
                            return (
                              <>
                                <div>
                                  <hr />
                                  <div key={fieldName}>
                                    <span
                                      className={`${
                                        fieldName == "result" ? "font-bold" : ""
                                      } font-serif px-4 py-2`}
                                    >
                                      {resultField[fieldName]}
                                    </span>
                                    {fieldName == "result"
                                      ? resultField?.unit
                                        ? resultField.unit
                                        : ""
                                      : ""}
                                  </div>
                                </div>
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
            <div className="border border-1  p-2 grid grid-cols-2 gap-1 my-5 rounded-md">
              <div
                dangerouslySetInnerHTML={{
                  __html: params?.testResult?.comment,
                }}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
);

export default ReportViewerParameter;
